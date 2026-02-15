from appwrite.services.functions import Functions
from appwrite.services.tables_db import TablesDB
from appwrite.query import Query
from appwrite.client import Client
import json as json_lib
import os

project_id = os.environ['PROJECT_ID']
database_id = os.environ['DATABASE_ID']
appwrite_api_key = os.environ['APPWRITE_API_KEY']
api_url = f"https://backend.toczekmj.com/v1"
table_id = "genres"

def _instantiate_required_clients():
    client = (
        Client()
            .set_endpoint(api_url)
            .set_project(project_id)
            .set_key(appwrite_api_key)
    )

    tablesDb = TablesDB(client)
    functions = Functions(client)
    return tablesDb, functions


def setComputationStatus(tablesDb: TablesDB, file_id: str, is_ongoing: bool):
    tablesDb.update_row(
        database_id=database_id,
        table_id=table_id,
        row_id=file_id,
        data={
            "transformation_ongoing": is_ongoing
        }
    )

def main(context):
    '''
        context.req.body should contain the following fields:
        - user_id
        - folder_id
    '''
    try:
        body_json = json_lib.loads(context.req.body)
        user_id = body_json.get("user_id")
        folder_id = body_json.get("folder_id")
        
        tablesDb, functions = _instantiate_required_clients()
        setComputationStatus(tablesDb, folder_id, True)

        # get all files in the folder
        result = tablesDb.list_rows(
            database_id=database_id,
            table_id="files",
            queries=[
                Query.equal("genre", folder_id),
                Query.select(["$id"])
            ]
        )

        files = result['rows']

        for file in files:
            file_id = file["$id"]
            exec_resp = functions.create_execution(
                function_id='fft',
                body=json_lib.dumps({
                    "user_id": user_id,
                    "file_id": file_id
                }),
                headers={"Content-Type": "application/json"},
                xasync=True
            )

        setComputationStatus(tablesDb, folder_id, False)
    except Exception as e:
        setComputationStatus(tablesDb, folder_id, False)
        context.log(f"Error instantiating clients: {str(e)}")
        return context.res.text(str(e), 500)
    context.log(exec_resp)
    return context.res.json(exec_resp, 200)