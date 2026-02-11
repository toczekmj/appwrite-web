import json as json_lib
import os

from appwrite.client import Client
from appwrite.services.tables_db import TablesDB


def initialize_variables(context):
    global db_id, project_id, project_endpoint
    db_id = os.environ['APPWRITE_DATABASE_ID']
    project_id = os.environ['APPWRITE_FUNCTION_PROJECT_ID']
    project_endpoint = os.environ['APPWRITE_FUNCTION_API_ENDPOINT']

    raw_body = context.req.body
    json = json_lib.loads(raw_body)
    jwt = json['jwt']

    global genre, rowid
    genre = json['genre']

    client = (
        Client()
              .set_endpoint(project_endpoint)
              .set_project(project_id)
              .set_jwt(jwt)
    )


    global tablesDb
    tablesDb = TablesDB(client)


def main(context):
    try:
        initialize_variables(context)

        res = tablesDb.list_rows(
            table_id="genres",
            database_id=db_id
        )

        rows = res['rows']
        return context.res.json(rows)

    except Exception as e:
        context.error(f"Error while processing request {str(e)}")
        return context.res.text("error", 500)