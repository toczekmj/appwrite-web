import json as json_lib
from typing import Dict, List
import requests
import numpy as np
import os
import wave
import io
from appwrite.client import Client
from appwrite.query import Query
from appwrite.services.functions import Functions
from appwrite.services.storage import Storage
from appwrite.services.tables_db import TablesDB
from appwrite.input_file import InputFile
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.id import ID


project_id = os.environ['PROJECT_ID']
database_id = os.environ['DATABASE_ID']
bucket_id = os.environ['BUCKET_ID']
appwrite_api_key = os.environ['APPWRITE_API_KEY']
api_url = f"https://backend.toczekmj.com/v1"
table_id = "files"


def _get_wav_audio_format(file_bytes: bytes) -> int | None:
    header = _parse_wav_fmt_and_data(file_bytes)
    if header is None:
        return None
    return int(header["audio_format"])


def _parse_wav_fmt_and_data(file_bytes: bytes) -> dict | None:
    """
    Minimal WAV parser:
    - Reads the 'fmt ' chunk for format/channels/rate/bits-per-sample.
    - Locates the 'data' chunk (offset+size).
    """
    if len(file_bytes) < 12 or file_bytes[0:4] != b"RIFF" or file_bytes[8:12] != b"WAVE":
        return None

    offset = 12  # skip RIFF header
    data_len = len(file_bytes)

    fmt: dict | None = None
    data: dict | None = None

    while offset + 8 <= data_len:
        chunk_id = file_bytes[offset:offset + 4]
        chunk_size = int.from_bytes(file_bytes[offset + 4:offset + 8], "little")
        offset += 8

        if offset + chunk_size > data_len:
            return None

        if chunk_id == b"fmt ":
            if chunk_size < 16:
                return None
            audio_format = int.from_bytes(file_bytes[offset:offset + 2], "little")
            channels = int.from_bytes(file_bytes[offset + 2:offset + 4], "little")
            sample_rate = int.from_bytes(file_bytes[offset + 4:offset + 8], "little")
            bits_per_sample = int.from_bytes(file_bytes[offset + 14:offset + 16], "little")
            fmt = {
                "audio_format": audio_format,
                "channels": channels,
                "sample_rate": sample_rate,
                "bits_per_sample": bits_per_sample,
            }
        elif chunk_id == b"data":
            data = {"data_offset": offset, "data_size": chunk_size}

        # Chunks are padded to even sizes.
        offset += chunk_size + (chunk_size % 2)

        if fmt is not None and data is not None:
            break

    if fmt is None or data is None:
        return None

    return {**fmt, **data}


def _alaw_bytes_to_int16(data_bytes: bytes) -> np.ndarray:
    # Vectorized G.711 A-law decode (8-bit -> int16).
    a = np.frombuffer(data_bytes, dtype=np.uint8) ^ np.uint8(0x55)
    sign = a & np.uint8(0x80)
    exponent = (a & np.uint8(0x70)) >> np.uint8(4)
    mantissa = a & np.uint8(0x0F)

    t = (mantissa.astype(np.int32) << 4) + 8
    t = np.where(exponent == 0, t, t + 0x100)
    t = np.where(exponent <= 1, t, t << (exponent.astype(np.int32) - 1))
    decoded = np.where(sign != 0, t, -t)
    return decoded.astype(np.int16)


def _ulaw_bytes_to_int16(data_bytes: bytes) -> np.ndarray:
    # Vectorized G.711 µ-law decode (8-bit -> int16).
    u = (~np.frombuffer(data_bytes, dtype=np.uint8)).astype(np.uint8)
    sign = u & np.uint8(0x80)
    exponent = (u >> np.uint8(4)) & np.uint8(0x07)
    mantissa = u & np.uint8(0x0F)

    t = ((mantissa.astype(np.int32) << 3) + 0x84) << exponent.astype(np.int32)
    decoded = np.where(sign != 0, 0x84 - t, t - 0x84)
    return decoded.astype(np.int16)


def wav_bytes_to_mono_signal(file_bytes: bytes) -> np.ndarray:
    header = _parse_wav_fmt_and_data(file_bytes)
    if header is None:
        raise ValueError("Invalid WAV file.")

    audio_format = int(header["audio_format"])
    channels = int(header["channels"])

    if audio_format in (6, 7):
        data_offset = int(header["data_offset"])
        data_size = int(header["data_size"])
        encoded = file_bytes[data_offset:data_offset + data_size]

        if audio_format == 6:
            pcm16 = _alaw_bytes_to_int16(encoded)
        else:
            pcm16 = _ulaw_bytes_to_int16(encoded)

        audio = pcm16.astype(np.float32) / 32768.0
        if channels > 1:
            audio = audio.reshape(-1, channels).mean(axis=1)
        return audio

    # For uncompressed PCM we keep using the wave module.
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
    elif sample_width == 3:
        bytes_array = np.frombuffer(raw_frames, dtype=np.uint8)
        if len(bytes_array) % 3 != 0:
            raise ValueError("Invalid 24-bit WAV data length.")
        bytes_array = bytes_array.reshape(-1, 3).astype(np.int32)
        audio_int32 = (
                bytes_array[:, 0]
                | (bytes_array[:, 1] << 8)
                | (bytes_array[:, 2] << 16)
        )
        
        audio_int32 = np.where(
                audio_int32 & 0x800000,
                audio_int32 | ~0xFFFFFF,
                audio_int32
        )
        audio = audio_int32.astype(np.float32) / 8388608.0
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


def is_wav(file_bytes: bytes) -> bool:
    return (
            len(file_bytes) >= 12
            and file_bytes[0:4] == b"RIFF"
            and file_bytes[8:12] == b"WAVE"
    )


def _validate_user_permissions(user_id: str, functions: Functions, row: Dict):
    perm_data = {
        "user_id": user_id,
        "required_permissions": ["read", "update"],
        "actual_permissions": row.get("$permissions")
    }

    permission_result = functions.create_execution(
        function_id="checkuserpermissions",
        body=json_lib.dumps(perm_data),
        headers={"Content-Type": "application/json"}
    )

    permission_response_body = json_lib.loads(permission_result["responseBody"])
    if not permission_response_body.get("has_permissions"):
        raise Exception("User does not have required permissions.")


def _instantiate_required_clients():
    client = (
        Client()
            .set_endpoint(api_url)
            .set_project(project_id)
            .set_key(appwrite_api_key)
    )

    tablesDb = TablesDB(client)
    bucket = Storage(client)
    functions = Functions(client)
    return tablesDb, bucket, functions


def _parse_request_body(body):
    user_id = body["user_id"]
    file_id = body["file_id"]
    return user_id, file_id


def _process_file(bucket: Storage, row: Dict):
    music_file_id = row.get('FileId')
    res = bucket.get_file_view(
        bucket_id=bucket_id,
        file_id=music_file_id
    )

    if not is_wav(res):
        raise Exception("File is not a wav file.")

    audio_format = _get_wav_audio_format(res)
    if audio_format is None:
        raise Exception("Invalid WAV file: missing 'fmt ' and/or 'data' chunk.")
    if audio_format not in (1, 6, 7):
        raise Exception(
            f"Unsupported WAV format. Supported: 1 (PCM), 6 (A-law), 7 (µ-law). "
            f"Audio format code: {audio_format}"
        )

    signal = wav_bytes_to_mono_signal(res)
    magnitudes = compute_fft_magnitude(signal)
    return magnitudes


def _create_csv_file(bucket: Storage, tablesDb: TablesDB, magnitudes: List[float], user_id: str, file_id: str) -> str:
    csv_content = "frequency,magnitude\n"
    for i, magnitude in enumerate(magnitudes):
        csv_content += f"{i},{magnitude}\n"
    csv_bytes = csv_content.encode("utf-8")

    unique_file_id = ID.unique()
    bucket.create_file(
        bucket_id=bucket_id,
        file_id=unique_file_id,
        file=InputFile.from_bytes(csv_bytes, filename=f"{unique_file_id}.csv"),
        permissions=[
            Permission.read(Role.user(user_id)),
            Permission.write(Role.user(user_id)),
            Permission.delete(Role.user(user_id))
        ]
    )

    row = tablesDb.update_row(
        database_id=database_id,
        table_id=table_id,
        row_id=file_id,
        data={
            "data_file_id": unique_file_id,
        }
    )



def main(context):
    try:
        '''
        context.req should contain the following fields:
        - file_id: the id of the file to be processed (from 'files' table)
        - user_id: the id of the user who requested the processing, ergo the owner of the file
        '''
        tablesDb, bucket, functions = _instantiate_required_clients()
        user_id, file_id = _parse_request_body(context.req.body)
        
        row = tablesDb.get_row(
            database_id=database_id,
            table_id=table_id,
            row_id=file_id
        )

        # we need to check if the file wasn't already processed, 
        # if it was, we can skip processing and just return
        # at this point we don't care about user permission for this file
        # because in case it's already processed - we'll do nothing and return,
        # and in case it's not processed yet - we need to validate the permissions 
        if row.get("data_file_id") is not None:
            context.log(f"File {file_id} already processed.")
            return context.res.empty()

        # this function needs to have "read" and "update" permissions
        # read - to get corresponding file from storage
        # update - to update the row with new data_file_id after processing
        # thus we check if the user has both permissions before proceeding
        # if user doesn't have required permissions, we throw an error and stop execution
        _validate_user_permissions(user_id, functions, row)

        # at this point we know that the user has required permissions and file wasn't processed yet,
        # so we can proceed with processing the file
        magnitudes = _process_file(bucket, row)
        _create_csv_file(bucket, tablesDb, magnitudes, user_id, file_id)

    except Exception as e:
        context.log(f"Error in main function: {str(e)}")
        return context.res.json(str(e), 500)
    
    return context.res.empty()