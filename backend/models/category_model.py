from bson.objectid import ObjectId

def category_serializer(category) -> dict:
    return {
        "id": str(category["_id"]),
        "name": category["name"],
        "menu_type": category["menu_type"]
    }
