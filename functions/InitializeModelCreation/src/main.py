"""
InitializeModelCreation – Appwrite function that trains a genre classifier model.

Flow:
1. Gather all genres and files the user has uploaded (files must have data_file_id set; FFT already run).
2. Download existing .csv files from storage (FFT magnitude spectra).
3. Build a fixed-size feature matrix (pad/truncate frequency bins) and genre labels.
4. Train a classifier (e.g. RandomForest) and save artifact (model + label encoder).
5. Upload artifact to bucket and create a new row in the models table.
6. Return model id and artifact_file_id so the model can be loaded later without re-training.

Expects context.req.body (JSON): { "user_id": "<user_id>" }
Optional: { "user_id": "<user_id>", "model_name": "My Genre Model" }

Requires env: DATABASE_ID, PROJECT_ID, ENDPOINT, APPWRITE_API_KEY, BUCKET_ID

If you see "Internal curl error 28" (timeout): the function does many storage downloads + training.
Either reduce the number of files with FFT data, or increase the function execution timeout in Appwrite
(Console → Functions → [this function] → Settings, or _APP_FUNCTIONS_TIMEOUT for self-hosted).
"""

from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.services.storage import Storage
from appwrite.query import Query
from appwrite.id import ID
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.input_file import InputFile
from appwrite.services.functions import Functions
import os
import json
import io
import csv
import tempfile
import shutil
from datetime import datetime

# Fixed length for FFT feature vector (frequency bins). FFT output may vary; we truncate or zero-pad.
FEATURE_LENGTH = 2000
# Cap files used for training to avoid function timeout (each file = one storage download + training time).
MAX_FILES_FOR_TRAINING = 75


def _user_has_action(perms: list, user_id: str, action: str) -> bool:
    """Check if user has the given action in the permission list. Matches CheckUserPermissions logic."""
    if not perms:
        return False
    target = f"user:{user_id}"
    prefix = f"{action}("
    for p in perms:
        if not isinstance(p, str):
            continue
        if not p.startswith(prefix):
            continue
        if target in p:
            return True
    return False


def _user_has_read(perms: list, user_id: str) -> bool:
    """True if user has read permission on the row."""
    return _user_has_action(perms, user_id, "read")


class AppwriteHelper:
    def __init__(self, context):
        self.database_id = os.environ["DATABASE_ID"]
        self.project_id = os.environ["PROJECT_ID"]
        self.endpoint = os.environ["ENDPOINT"]
        self.appwrite_api_key = os.environ["APPWRITE_API_KEY"]
        self.bucket_id = os.environ.get("BUCKET_ID")
        if not self.bucket_id:
            raise ValueError("BUCKET_ID environment variable is required")
        self.context = context
        body = context.req.body
        if isinstance(body, (bytes, bytearray)):
            body = body.decode("utf-8")
        if isinstance(body, str):
            body = json.loads(body) if body.strip() else {}
        self.user_id = body.get("user_id") or body.get("$id")
        if not self.user_id:
            raise ValueError("user_id is required in request body")
        self.client = (
            Client()
            .set_endpoint(self.endpoint)
            .set_project(self.project_id)
            .set_key(self.appwrite_api_key)
        )
        self.tablesDb = TablesDB(self.client)
        self.storage = Storage(self.client)
        self.functions = Functions(self.client)

    def get_user_genres(self):
        """List genres the user has read access to. Lists all genres then filters by $permissions (function has full DB access)."""
        result = self.tablesDb.list_rows(
            database_id=self.database_id,
            table_id="genres",
            queries=[Query.limit(100)],
        )
        rows = result.get("rows", [])
        return [r for r in rows if _user_has_read(r.get("$permissions") or [], self.user_id)]

    def get_user_files_with_data(self, allowed_genre_ids: set):
        """List files that have data_file_id set and genre in allowed_genre_ids. No permission query (function sees all); access is derived from folder (genre) permission."""
        result = self.tablesDb.list_rows(
            database_id=self.database_id,
            table_id="files",
            queries=[
                Query.is_not_null("data_file_id"),
                Query.is_not_null("genre"),
                Query.limit(MAX_FILES_FOR_TRAINING),
            ],
        )
        rows = result.get("rows", [])
        filtered = []
        for r in rows:
            genre_id = r.get("genre")
            if isinstance(genre_id, dict):
                genre_id = genre_id.get("$id")
            if genre_id and genre_id in allowed_genre_ids:
                filtered.append(r)
        return filtered

    def download_csv(self, data_file_id: str) -> bytes:
        """Download CSV file content from storage by data_file_id."""
        return self.storage.get_file_download(
            bucket_id=self.bucket_id,
            file_id=data_file_id,
        )

    def upload_artifact(self, file_path: str, filename: str) -> str:
        """Upload a file to storage with user permissions; returns the new file_id."""
        with open(file_path, "rb") as f:
            content = f.read()
        file_id = ID.unique()
        self.storage.create_file(
            bucket_id=self.bucket_id,
            file_id=file_id,
            file=InputFile.from_bytes(content, filename=filename),
            permissions=[
                Permission.read(Role.user(self.user_id)),
                Permission.write(Role.user(self.user_id)),
                Permission.delete(Role.user(self.user_id)),
            ],
        )
        return file_id

    def create_model_row(
        self,
        name: str,
        artifact_file_id: str,
        feature_length: int,
        genre_names: list[str],
    ) -> dict:
        """Create a new row in the models table with all fields."""
        data = {
            "name": name,
            "artifact_file_id": artifact_file_id,
            "feature_length": feature_length,
            "genre_names": genre_names or None,
        }
        row = self.tablesDb.create_row(
            database_id=self.database_id,
            table_id="models",
            row_id=ID.unique(),
            data=data,
            permissions=[
                Permission.read(Role.user(self.user_id)),
                Permission.write(Role.user(self.user_id)),
                Permission.delete(Role.user(self.user_id)),
            ],
        )
        return row


def parse_csv_magnitudes(csv_bytes: bytes) -> list[float]:
    """Parse FFT CSV (frequency,magnitude) and return list of magnitudes in order."""
    reader = csv.DictReader(io.StringIO(csv_bytes.decode("utf-8")))
    magnitudes = []
    for row in reader:
        try:
            magnitudes.append(float(row["magnitude"]))
        except (KeyError, ValueError):
            continue
    return magnitudes


def features_from_magnitudes(magnitudes: list[float], length: int = FEATURE_LENGTH) -> list[float]:
    """Convert variable-length magnitude list to fixed-length feature vector (pad with 0 or truncate)."""
    if len(magnitudes) >= length:
        return magnitudes[:length]
    return magnitudes + [0.0] * (length - len(magnitudes))


def main(context):
    work_dir = None
    try:
        helper = AppwriteHelper(context)
        work_dir = tempfile.mkdtemp(prefix="init_model_")
        os.chdir(work_dir)

        context.log("Gathering user genres and files with FFT data.")
        genres = helper.get_user_genres()
        if not genres:
            return context.res.json(
                {"error": "No genres found. Create at least one genre (folder) first."},
                400,
            )
        allowed_genre_ids = {g["$id"] for g in genres}
        files = helper.get_user_files_with_data(allowed_genre_ids)

        if not files:
            return context.res.json(
                {
                    "error": "No files with FFT data found. Upload .wav files to genres and run FFT on them first."
                },
                400,
            )

        genre_ids = {g["$id"] for g in genres}
        genre_id_to_name = {g["$id"]: g.get("ReadableName", g["$id"]) for g in genres}

        context.log(f"Processing up to {len(files)} files (max {MAX_FILES_FOR_TRAINING} to avoid timeout).")
        # Build (features, label) per file; label = genre ReadableName
        X_list = []
        y_list = []
        for row in files:
            genre_id = row.get("genre")
            if isinstance(genre_id, dict):
                genre_id = genre_id.get("$id")
            if not genre_id or genre_id not in genre_ids:
                continue
            data_file_id = row.get("data_file_id")
            if not data_file_id:
                continue
            try:
                csv_bytes = helper.download_csv(data_file_id)
            except Exception as e:
                context.log(f"Could not download data_file_id {data_file_id}: {e}")
                continue
            magnitudes = parse_csv_magnitudes(csv_bytes)
            if not magnitudes:
                context.log(f"Empty or invalid CSV for file {row.get('$id')}")
                continue
            features = features_from_magnitudes(magnitudes)
            X_list.append(features)
            y_list.append(genre_id_to_name[genre_id])

        if len(X_list) < 2 or len(set(y_list)) < 2:
            return context.res.json(
                {
                    "error": "Need at least 2 samples and at least 2 different genres to train. Add more files and run FFT."
                },
                400,
            )

        context.log("Building dataset and training classifier.")
        import numpy as np
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import LabelEncoder
        import joblib

        X = np.array(X_list, dtype=np.float64)
        y = np.array(y_list)
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)

        clf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=20)
        clf.fit(X, y_encoded)

        artifact_path = os.path.join(work_dir, "genre_classifier.joblib")
        artifact = {
            "model": clf,
            "label_encoder": label_encoder,
            "feature_length": FEATURE_LENGTH,
        }
        joblib.dump(artifact, artifact_path)

        model_name = "Genre classifier"
        try:
            body = context.req.body
            if isinstance(body, (bytes, bytearray)):
                body = body.decode("utf-8")
            if isinstance(body, str) and body.strip():
                parsed = json.loads(body)
                model_name = parsed.get("model_name", model_name)
        except Exception:
            pass
        model_name = f"{model_name} {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"

        # Unique genre names this model was trained on (for display and validation)
        genre_names_trained = sorted(set(y_list))

        context.log("Uploading model artifact to storage.")
        artifact_file_id = helper.upload_artifact(
            artifact_path,
            f"genre_classifier_{ID.unique()}.joblib",
        )

        context.log("Creating model row in database.")
        model_row = helper.create_model_row(
            name=model_name,
            artifact_file_id=artifact_file_id,
            feature_length=FEATURE_LENGTH,
            genre_names=genre_names_trained,
        )

        model_id = model_row.get("$id")
        context.log(f"Model created: {model_id}, artifact: {artifact_file_id}")

        return context.res.json(
            {
                "model_id": model_id,
                "artifact_file_id": artifact_file_id,
                "model_name": model_name,
                "files_used": len(X_list),
                "message": "Model trained and saved. Use artifact_file_id to load this model later without re-training.",
            },
            200,
        )

    except ValueError as e:
        context.log(f"Validation error: {e}")
        return context.res.json({"error": str(e)}, 400)
    except Exception as e:
        context.log(f"Error in InitializeModelCreation: {e}")
        if work_dir and os.path.isdir(work_dir):
            try:
                shutil.rmtree(work_dir)
            except Exception:
                pass
        return context.res.json({"error": str(e)}, 500)
    finally:
        if work_dir and os.path.isdir(work_dir):
            try:
                shutil.rmtree(work_dir)
            except Exception:
                pass
