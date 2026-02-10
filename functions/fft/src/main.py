from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
import io
import json
import os
import wave
from typing import Any, Dict, Optional, Tuple

import numpy as np


def _get_request_data(context) -> Dict[str, Any]:
    body = getattr(context.req, "body", None)
    if isinstance(body, (bytes, bytearray)):
        body_text = body.decode("utf-8", errors="ignore")
    elif body is None:
        body_text = ""
    else:
        body_text = str(body)

    data: Dict[str, Any] = {}
    body_text = body_text.strip()
    if body_text:
        try:
            data = json.loads(body_text)
        except Exception:
            data = {}

    query = getattr(context.req, "query", None) or {}
    if isinstance(query, dict):
        data = {**query, **data}
    return data


def _parse_wav_samples(file_bytes: bytes) -> Tuple[np.ndarray, int]:
    with wave.open(io.BytesIO(file_bytes), "rb") as wav:
        n_channels = wav.getnchannels()
        sample_width = wav.getsampwidth()
        sample_rate = wav.getframerate()
        n_frames = wav.getnframes()
        raw = wav.readframes(n_frames)

    if sample_width == 1:
        data = np.frombuffer(raw, dtype=np.uint8).astype(np.float32)
        data = (data - 128.0) / 128.0
    elif sample_width == 2:
        data = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    elif sample_width == 3:
        bytes_array = np.frombuffer(raw, dtype=np.uint8)
        bytes_array = bytes_array.reshape(-1, 3)
        data32 = (
            bytes_array[:, 0].astype(np.int32)
            | (bytes_array[:, 1].astype(np.int32) << 8)
            | (bytes_array[:, 2].astype(np.int32) << 16)
        )
        sign_bit = 1 << 23
        data32 = (data32 ^ sign_bit) - sign_bit
        data = data32.astype(np.float32) / float(1 << 23)
    elif sample_width == 4:
        data = np.frombuffer(raw, dtype=np.int32).astype(np.float32) / float(1 << 31)
    else:
        raise ValueError(f"Unsupported WAV sample width: {sample_width}")

    if n_channels > 1:
        data = data.reshape(-1, n_channels)
        data = data.mean(axis=1)

    return data, sample_rate


def _is_wav(file_bytes: bytes) -> bool:
    return (
        len(file_bytes) >= 12
        and file_bytes[0:4] == b"RIFF"
        and file_bytes[8:12] == b"WAVE"
    )


def main(context):
    data = _get_request_data(context)
    context.log("Received data:", data)
    file_id = data.get("fileId") or data.get("FileId") or data.get("id")
    if not file_id:
        return context.res.json({
            "ok": False,
            "error": "Missing required field: fileId"
        })

    max_points_raw = data.get("maxPoints") or data.get("max_points") or 4096
    try:
        max_points = int(max_points_raw)
        if max_points <= 0:
            raise ValueError()
    except Exception:
        return context.res.json({
            "ok": False,
            "error": "Invalid maxPoints. Must be a positive integer."
        })

    endpoint = os.environ.get("APPWRITE_FUNCTION_API_ENDPOINT") or os.environ.get("APPWRITE_ENDPOINT") or os.environ.get("NEXT_PUBLIC_APPWRITE_ENDPOINT")
    project_id = os.environ.get("APPWRITE_FUNCTION_PROJECT_ID") or os.environ.get("NEXT_PUBLIC_APPWRITE_PROJECT_ID")
    api_key = (getattr(context.req, "headers", {}) or {}).get("x-appwrite-key") or os.environ.get("APPWRITE_FUNCTION_API_KEY")

    database_id = os.environ.get("APPWRITE_DATABASE_ID") or os.environ.get("NEXT_PUBLIC_APPWRITE_DATABASE_ID")
    bucket_id = os.environ.get("APPWRITE_BUCKET_ID") or os.environ.get("NEXT_PUBLIC_APPWRITE_BUCKET_ID")
    collection_id = os.environ.get("APPWRITE_FILES_COLLECTION_ID") or "files"

    if not endpoint or not project_id or not api_key or not database_id or not bucket_id:
        return context.res.json({
            "ok": False,
            "error": "Missing Appwrite configuration. Ensure endpoint, project ID, API key, database ID, and bucket ID are set."
        })

    client = Client()
    client.set_endpoint(endpoint)
    client.set_project(project_id)
    client.set_key(api_key)

    databases = Databases(client)
    storage = Storage(client)

    try:
        document = databases.get_document(database_id, collection_id, file_id)
    except Exception as exc:
        context.error(str(exc))
        return context.res.json({
            "ok": False,
            "error": "File document not found."
        })

    bucket_file_id = document.get("FileId") or document.get("fileId")
    if not bucket_file_id:
        return context.res.json({
            "ok": False,
            "error": "File document missing FileId field."
        })

    try:
        file_bytes = storage.get_file_download(bucket_id, bucket_file_id)
    except Exception as exc:
        context.error(str(exc))
        return context.res.json({
            "ok": False,
            "error": "Unable to download file from bucket."
        })

    if not isinstance(file_bytes, (bytes, bytearray)):
        file_bytes = str(file_bytes).encode("utf-8", errors="ignore")

    if not _is_wav(file_bytes):
        return context.res.json({
            "ok": False,
            "error": "Unsupported file type. Only WAV is accepted."
        })

    try:
        samples, sample_rate = _parse_wav_samples(file_bytes)
    except Exception as exc:
        context.error(str(exc))
        return context.res.json({
            "ok": False,
            "error": "Unable to parse WAV file."
        })

    if samples.size == 0:
        return context.res.json({
            "ok": False,
            "error": "No samples found in WAV file."
        })

    n = samples.size
    fft_values = np.fft.rfft(samples)
    magnitudes = np.abs(fft_values)
    frequencies = np.fft.rfftfreq(n, d=1.0 / sample_rate)

    if magnitudes.size > max_points:
        step = int(np.ceil(magnitudes.size / max_points))
        magnitudes = magnitudes[::step]
        frequencies = frequencies[::step]

    if magnitudes.size > 1:
        peak_index = int(np.argmax(magnitudes[1:])) + 1
    else:
        peak_index = 0

    context.log(f"FFT computed: {len(frequencies)} frequencies, peak at {frequencies[peak_index]:.2f} Hz with magnitude {magnitudes[peak_index]:.2f}")
    return context.res.json({
        "ok": True,
        "fileId": file_id,
        "bucketFileId": bucket_file_id,
        "sampleRate": sample_rate,
        "n": n,
        "frequencies": frequencies.tolist(),
        "magnitudes": magnitudes.tolist(),
        "peakFrequency": float(frequencies[peak_index]) if frequencies.size else 0.0,
        "peakMagnitude": float(magnitudes[peak_index]) if magnitudes.size else 0.0,
    })
