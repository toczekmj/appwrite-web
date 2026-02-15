from typing import List
import json as json_lib

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


def main(context):
    try:
        '''
            context.req should contain the following fields:
            - user_id
            - required_permissions (list of strings, e.g. ["read","update","delete"])
            - actual_permissions (list of strings, e.g. ["read(useridhere)","update(useridhere)"])
        '''

        raw_body = context.req.body
        
        # context.req.body may already be a parsed dict (depends on the runtime)
        if isinstance(raw_body, dict):
            payload = raw_body
        elif isinstance(raw_body, (bytes, bytearray)):
            payload = json_lib.loads(raw_body.decode("utf-8"))
        elif isinstance(raw_body, str):
            payload = json_lib.loads(raw_body)
        else:
            try:
                payload = json_lib.loads(json_lib.dumps(raw_body))
            except Exception:
                raise ValueError("Unsupported request body type")
            
        user_id = payload.get("user_id")
        required_permissions = payload.get("required_permissions", [])
        actual_permissions = payload.get("actual_permissions", [])

        # return of this function is either true or false
        # true if user has all required permissions, false otherwise
        has_permissions = all(
            _user_has_action(actual_permissions, user_id, action) for action in required_permissions
        )
        context.log(f"User {user_id} has permissions: {has_permissions}")
        
    except Exception as e:
        context.log(f"Error in main function: {str(e)}")
        return context.res.text(str(e), 500)
    
    return context.res.json({"has_permissions": has_permissions})