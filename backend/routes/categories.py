from flask import Blueprint, jsonify, current_app
from bson.objectid import ObjectId
from utils import slugify  # ✅ now works


categories_bp = Blueprint("categories", __name__)

@categories_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = []
    for cat in current_app.mongo.db.categories.find():
        categories.append({
            "_id": str(cat["_id"]),
            "name": cat["name"]
        })
    return jsonify(categories)

@categories_bp.route("/categories", methods=["POST"])
def create_category():
    data = request.json
    slug = slugify(data["name"])
    new_id = current_app.mongo.db.categories.insert_one({
        "name": data["name"],
        "slug": slug
    }).inserted_id
    return jsonify({"_id": str(new_id), "name": data["name"], "slug": slug}), 201

# 🔹 New API → Full category → subcategory → items tree
@categories_bp.route("/categories/tree", methods=["GET"])
def get_category_tree():
    pipeline = [
        {
            "$lookup": {
                "from": "subcategories",
                "localField": "_id",
                "foreignField": "category_id",
                "as": "subcategories"
            }
        },
        {
            "$unwind": {
                "path": "$subcategories",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$lookup": {
                "from": "items",
                "localField": "subcategories._id",
                "foreignField": "subcategory_id",
                "as": "subcategories.items"
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "name": {"$first": "$name"},
                "subcategories": {"$push": "$subcategories"}
            }
        }
    ]

    categories = list(current_app.mongo.db.categories.aggregate(pipeline))

    # Convert ObjectId → string
#    for cat in categories:
#     cat["_id"] = str(cat["_id"])
#     cat["slug"] = cat.get("slug")  # add this
#     for sub in cat["subcategories"]:
#         if sub:
#             sub["_id"] = str(sub["_id"])
#             sub["slug"] = sub.get("slug")  # add this
#             sub["category_id"] = str(sub["category_id"])
#             for item in sub.get("items", []):
#                 item["_id"] = str(item["_id"])
#                 item["slug"] = item.get("slug")  # add this
#                 item["subcategory_id"] = str(item["subcategory_id"])
#                 item["category_id"] = str(item["category_id"])
                
    for cat in categories:
        cat["_id"] = str(cat["_id"])
        cat["slug"] = cat.get("slug")  # add this
        for sub in cat["subcategories"]:
            if sub:
                sub["_id"] = str(sub["_id"])
                sub["slug"] = sub.get("slug")  # add this
                sub["category_id"] = str(sub["category_id"])
                for item in sub.get("items", []):
                    item["_id"] = str(item["_id"])
                    item["slug"] = item.get("slug")  # add this
                    item["subcategory_id"] = str(item["subcategory_id"])
                    item["category_id"] = str(item["category_id"])


    return jsonify(categories)
