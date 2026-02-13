import io
import json as json_lib
import os
import wave

import numpy as np
from appwrite.client import Client
from appwrite.query import Query
from appwrite.services.functions import Functions
from appwrite.services.storage import Storage
from appwrite.services.tables_db import TablesDB


def initialize_variables(context):
    global dbId, \
        bucketId, \
        projectId, \
        endpoint, \
        tablesDb, \
        storage, \
        fileId, \
        jwt, \
        functions, \
        background

    dbId = os.environ['APPWRITE_DATABASE_ID']
    bucketId = os.environ['APPWRITE_BUCKET_ID']
    projectId = os.environ['APPWRITE_FUNCTION_PROJECT_ID']
    endpoint = os.environ['APPWRITE_FUNCTION_API_ENDPOINT']
    key = os.environ['APPWRITE_FUNCTION_API_KEY']

    raw_body = context.req.body
    json = json_lib.loads(raw_body)
    fileId = json['file']
    jwt = json['jwt']
    background = json['background']

    client = (
        Client()
        .set_endpoint(endpoint)
        .set_project(projectId)
        .set_jwt(jwt)
    )

    tablesDb = TablesDB(client)
    storage = Storage(client)
    functions = Functions(client)


def is_wav(file_bytes: bytes) -> bool:
    return (
            len(file_bytes) >= 12
            and file_bytes[0:4] == b"RIFF"
            and file_bytes[8:12] == b"WAVE"
    )


def wav_bytes_to_mono_signal(file_bytes: bytes) -> np.ndarray:
    with wave.open(io.BytesIO(file_bytes), "rb") as wav_file:
        channels = wav_file.getnchannels()
        sample_width = wav_file.getsampwidth()
        frame_count = wav_file.getnframes()
        raw_frames = wav_file.readframes(frame_count)

    if sample_width == 1:
        dtype = np.uint8
        audio = np.frombuffer(raw_frames, dtype=dtype).astype(np.float32)
        audio = (audio - 128.0) / 128.0
    elif sample_width == 2:
        dtype = np.int16
        audio = np.frombuffer(raw_frames, dtype=dtype).astype(np.float32)
        audio = audio / 32768.0
    elif sample_width == 4:
        dtype = np.int32
        audio = np.frombuffer(raw_frames, dtype=dtype).astype(np.float32)
        audio = audio / 2147483648.0
    else:
        raise ValueError(f"Unsupported WAV sample width: {sample_width}")

    if channels > 1:
        audio = audio.reshape(-1, channels).mean(axis=1)

    return audio


def compute_fft_magnitude(signal: np.ndarray) -> list[float]:
    if signal.size == 0:
        return []

    fft_values = np.fft.rfft(signal)
    magnitudes = np.abs(fft_values)
    return magnitudes.tolist()


def main(context):
    try:
        # first we need to grab environment variables and initialize our appwrite client
        initialize_variables(context)

        db_file_row = tablesDb.get_row(
            database_id=dbId,
            table_id="files",
            row_id=fileId,
            queries=[
                Query.select(['FileId', 'is_transformed', 'transformData.$id'])
            ],
        )

        is_transformed = db_file_row['is_transformed']
        if is_transformed is True:
            data_id = db_file_row['transformData']['$id']
            existing_fft = tablesDb.get_row(
                database_id=dbId,
                table_id="transform_data",
                row_id=data_id,
                queries=[Query.select(['data'])],
            )
            if background:
                return context.res.text("Ok", 204)
            else:
                return context.res.json(existing_fft['data'], 200)

        bucket_file_id = db_file_row['FileId']
        file_bytes = storage.get_file_view(
            file_id=bucket_file_id,
            bucket_id=bucketId,
        )

        if not is_wav(file_bytes):
            return context.res.json({"error": "File is not a WAV file"}, 500)

        # run transform
        signal = wav_bytes_to_mono_signal(file_bytes)
        fft_results = compute_fft_magnitude(signal)
    except Exception as e:
        context.error(f"Error {str(e)}")
        return context.res.json({"error": str(e)}, 500)
    return context.res.json(fft_results, 201)
