from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from utils import slugify

items_bp = Blueprint("items", __name__)

# -------------------------------
# GET items (filter by subcategory via query param)
# Example: GET /items?subcategory=<id>
# -------------------------------
@items_bp.route("/items", methods=["GET"])
def get_items():
    db = current_app.mongo.db
    subcategory_id = request.args.get("subcategory")

    query = {}
    if subcategory_id:
        try:
            query["subcategory_id"] = ObjectId(subcategory_id)
        except:
            return jsonify({"error": "Invalid subcategory id"}), 400

    items = []
    for item in db.items.find(query):
        items.append({
            "_id": str(item["_id"]),
            "name": item["name"],
            "slug": item.get("slug", ""),
            "subcategory_id": str(item["subcategory_id"]),
            "category_id": str(item["category_id"])
        })
    return jsonify(items)


# -------------------------------
# GET items by subcategory_id (path param)
# Example: GET /items/<subcategory_id>
# -------------------------------
@items_bp.route("/items/<subcategory_id>", methods=["GET"])
def get_items_by_subcategory(subcategory_id):
    try:
        subcat_id = ObjectId(subcategory_id)
    except:
        return jsonify({"error": "Invalid subcategory id"}), 400

    items = []
    for item in current_app.mongo.db.items.find({"subcategory_id": subcat_id}):
        items.append({
            "_id": str(item["_id"]),
            "name": item["name"],
            "slug": item.get("slug", ""),
            "subcategory_id": str(item["subcategory_id"]),
            "category_id": str(item["category_id"])
        })
    return jsonify(items)


# -------------------------------
# POST create new item
# -------------------------------
@items_bp.route("/items", methods=["POST"])
def create_item():
    data = request.json
    slug = slugify(data["name"])

    new_id = current_app.mongo.db.items.insert_one({
        "name": data["name"],
        "slug": slug,
        "subcategory_id": ObjectId(data["subcategory_id"]),
        "category_id": ObjectId(data["category_id"])
    }).inserted_id

    return jsonify({
        "_id": str(new_id),
        "name": data["name"],
        "slug": slug
    }), 201
