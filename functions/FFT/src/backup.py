import json as json_lib
from typing import Dict, List
import requests

def _extract_permissions_from_row(row: dict) -> List[str]:
    return row.get("$permissions") or row.get("permissions") or []


def _user_has_action(perms: List[str], user_id: str, action: str) -> bool:
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


def check_row_permissions(row: dict, user_id: str, action=("read","update")) -> Dict:
    perms = _extract_permissions_from_row(row)
    missing = [a for a in action if not _user_has_action(perms, user_id, a)]
    return {
        "ok": not missing,
        "missing": missing
    }

user_id  = "698b1048001ee8c4540c"
file_id = "698de52d00067447d1d2"
project_id = "698b09b80015413578cc"
database_id = "698b1344001fada58b06"
appwrite_api_key = "standard_1c06320a4e0296800f4877446a4405226ccd4877621f127fe881dfd96823a6b68af0479d67dbb588117bd9a9161a51e2c98fca05b080158f783b55f12e161d357d48db27a206100ecc873287fa18a4a0143243679aebc8cb7f48a54b6e64ab212b8e0efd49d5f99aa74af56815d7b3184c22625bf9abfc031e6cfa5350f184b7"
table_id = "files"
api_url = f"https://backend.toczekmj.com/v1"
api_db_url = f"{api_url}/tablesdb/{database_id}/tables"
headers = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": project_id,
    "X-Appwrite-Key": appwrite_api_key,
    "X-Appwrite-Response-Format": "1.8.0"
}


def fetch_row(table: str, rowid: str, userid: str):
    """
    Fetches a row from the database and checks if the user has permissions to access it.
    """
    get_row_url = f"{api_db_url}/{table}/rows/{rowid}"
    response = requests.get(get_row_url, headers=headers)

    if response.status_code != 200:
        raise Exception("Error fetching row from database.")
    
    row = response.json()
    if not check_row_permissions(row, userid)["ok"]:
        raise Exception("User does not have required permissions.")
    
    return row


def update_row(table: str, rowid: str, data: dict, context):
    uri = f"{api_url}/tablesdb/{database_id}/tables/{table}/rows/{rowid}"
    try:
        response = requests.patch(uri, headers=headers, json=data)
    except requests.RequestException as exc:
        raise Exception(f"Error updating row in database: request failed: {exc}") from exc
    
    if response.status_code < 200 or response.status_code >= 300:
        raise Exception(f"Error updating row in database: {response.status_code} {response.text}")
    

def main(context):
    try:
        row = fetch_row(table_id, file_id, user_id)
        # context.log("Fetched row: " + json_lib.dumps(row))

        update_data_dict = {
            "data": {
                "is_transformed": True
            }
        }

        update_row(table_id, file_id, update_data_dict, context)


        return context.res.json(row)
    except Exception as e:
        context.error("Failed to execute function: " + str(e))
        return context.res.empty()
