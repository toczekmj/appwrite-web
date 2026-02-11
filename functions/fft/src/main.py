import os
import io
import wave
from typing import TypedDict, Optional

import numpy as np
import json as json_lib
from appwrite.client import Client
from appwrite.query import Query
from appwrite.services.storage import Storage
from appwrite.services.tables_db import TablesDB


class Folder(TypedDict):
    genre: str
    files: list[str]


class GenreFFT(TypedDict):
    Genre: str
    Files: dict[str, list[float]]


def initialize_variables(context):
    global dbId, \
        bucketId, \
        projectId, \
        endpoint, \
        tablesDb, \
        storage, \
        selected_genre, \
        current_user_session

    dbId = os.environ['APPWRITE_DATABASE_ID']
    bucketId = os.environ['APPWRITE_BUCKET_ID']
    projectId = os.environ['APPWRITE_FUNCTION_PROJECT_ID']
    endpoint = os.environ['APPWRITE_FUNCTION_API_ENDPOINT']

    # TODO: this needs to be replaced with user id or something
    # because with function key we have access to all files of all users
    # not only the files for a particular user
    # apiKey = os.environ['APPWRITE_FUNCTION_API_KEY']

    # this is an attempt to use user session instead of an api key
    raw_body = context.req.body
    json = json_lib.loads(raw_body)
    selected_genre = json['genre']
    current_user_session = json['session']
    context.log(f"Genre: {selected_genre}, session: {current_user_session}")

    client = (
        Client()
        .set_endpoint(endpoint)
        .set_project(projectId)
        # .set_key(apiKey)
        .set_session(current_user_session)
    )
    context.log("Client created")

    tablesDb = TablesDB(client)
    storage = Storage(client)


def get_rows(table_id: str, context, query: Optional[list[str]] = None) -> list:
    if query is None:
        context.log("Query not provided")

    context.log(f"Calling list row with params dbid = {dbId}, table_id = {table_id}, queries = {query}")
    rows = tablesDb.list_rows(
        database_id=dbId,
        table_id=table_id,
    )
    context.log("Fetched rows")
    return rows["rows"]


def find_files_for_genre(genres: list[dict]) -> list[Folder]:
    folders: list[Folder] = []
    for genre in genres:
        query = Query.equal('genre', genre['$id'])
        genre_files = get_rows('files', [query])
        file_ids = [row['FileId'] for row in genre_files]
        folders.append({
            "genre": genre['ReadableName'],
            "files": file_ids
        })
    return folders


def is_wav(file_bytes: bytes) -> bool:
    return (
            len(file_bytes) >= 12
            and file_bytes[0:4] == b"RIFF"
            and file_bytes[8:12] == b"WAVE"
    )


def get_only_wav_files(folders: list[Folder]) -> list[Folder]:
    filtered: list[Folder] = []

    for folder in folders:
        wav_ids: list[str] = []
        for file_id in folder['files']:
            file_bytes = storage.get_file_view(
                file_id=file_id,
                bucket_id=bucketId,
            )
            if is_wav(file_bytes):
                wav_ids.append(file_id)
        filtered.append({
            'genre': folder['genre'],
            'files': wav_ids
        })

    return filtered


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


def build_fft_output(folders: list[Folder]) -> list[GenreFFT]:
    fft_by_genre: list[GenreFFT] = []

    for folder in folders:
        files_fft: dict[str, list[float]] = {}
        for file_id in folder["files"]:
            file_bytes = storage.get_file_view(
                file_id=file_id,
                bucket_id=bucketId,
            )
            signal = wav_bytes_to_mono_signal(file_bytes)
            files_fft[file_id] = compute_fft_magnitude(signal)

        fft_by_genre.append({
            "Genre": folder["genre"],
            "Files": files_fft
        })

    return fft_by_genre


def main(context):
    try:
        # first we need to grab environment variables and initialize our appwrite client
        initialize_variables(context)

        # folder_query = Query.equal('$id', selected_genre)
        # genres = get_rows('genres', [folder_query])
        context.log("Lets get rows")
        genres = get_rows('genres', context)
        context.log(f"Found {len(genres)} genres.")
        context.log(genres)
        return context.res.json(genres)
        # and map files in each folder
        folders: list[Folder] = find_files_for_genre(genres)

        # now get rid of files that are not in .wav format
        # as it's the only format we want to work with
        wav_files: list[Folder] = get_only_wav_files(folders)

        # run transform
        fft_results = build_fft_output(wav_files)



    except Exception as e:
        context.error(f"Error {str(e)}")
        return context.res.json({"error": str(e)})
    return context.res.json(fft_results)
