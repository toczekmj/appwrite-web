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

table_id = "files"
api_url = f"https://backend.toczekmj.com/v1"
headers = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": project_id,
    "X-Appwrite-Key": appwrite_api_key,
    "X-Appwrite-Response-Format": "1.8.0"
}


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


def is_wav(file_bytes: bytes) -> bool:
    return (
            len(file_bytes) >= 12
            and file_bytes[0:4] == b"RIFF"
            and file_bytes[8:12] == b"WAVE"
    )

def main(context):
    try:
        '''
        context.req should contain the following fields:
        - file_id: the id of the file to be processed (from 'files' table)
        - user_id: the id of the user who requested the processing, ergo the owner of the file
        '''

        client = (
            Client()
                .set_endpoint(api_url)
                .set_project(project_id)
                .set_key(appwrite_api_key)
        )

        tablesDb = TablesDB(client)
        bucket = Storage(client)
        functions = Functions(client)
        
        user_id = context.req.get("user_id")
        file_id = context.req.get("file_id")

        row = tablesDb.get_row(
            database_id=database_id,
            table_id=table_id,
            row_id=file_id
        )

        # this function needs to have "read" and "update" permissions
        # read - to get corresponding file from storage
        # update - to update the row with new data_file_id after processing
        # thus we check if the user has both permissions before proceeding
        permission_result = functions.create_execution(
            function_id="checkuserpermissions",
            body={
                "user_id": user_id,
                "required_permissions": ["read", "update"],
                "actual_permissions": row.get("$permissions")
            }
        )
        context.log(f"Permission check result: {json_lib.dumps(permission_result)}")

        if not permission_result.get("has_permissions"):
            raise Exception("User does not have required permissions.")

        # if we are here, it means user has required permissions, 
        # so we can proceed with processing the file
        music_file_id = row.get('FileId')
        
        res = bucket.get_file_view(
            bucket_id=bucket_id,
            file_id=music_file_id
        )

        if not is_wav(res):
            raise Exception("File is not a wav file.")
        
        signal = wav_bytes_to_mono_signal(res)
        magnitudes = compute_fft_magnitude(signal)

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
        context.log(f"Created file with id: {unique_file_id}")

        row = tablesDb.update_row(
            database_id=database_id,
            table_id=table_id,
            row_id=file_id,
            data={
                "data_file_id": unique_file_id,
            }
        )
        context.log(f"Updated database row with id: {file_id} to include data_file_id: {unique_file_id}")

    except Exception as e:
        context.log(f"Error in main function: {str(e)}")
        return context.res.json(str(e), 500)
    
    return context.res.json("Hello world!", 200)