from bson.objectid import ObjectId
from bson.errors import InvalidId

def to_object_id(id_str):
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None
