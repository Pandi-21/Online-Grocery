from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from bson.errors import InvalidId
from utils import slugify

subcategories_bp = Blueprint("subcategories", __name__)

@subcategories_bp.route("/subcategories", methods=["GET"])
def get_subcategories():
    """
    Accepts either:
      GET /subcategories?category=<category_id>
      or
      GET /subcategories?category=<slug>
    """
    category_val = request.args.get("category")
    if not category_val:
        return jsonify({"error": "category query param required"}), 400

    db = current_app.mongo.db

    # Try to resolve to ObjectId first
    category_id = None
    try:
        category_id = ObjectId(category_val)
    except InvalidId:
        # Not a valid ObjectId; treat as slug
        cat_doc = db.categories.find_one({"slug": category_val})
        if not cat_doc:
            return jsonify({"error": "category not found"}), 404
        category_id = cat_doc["_id"]

    subs = []
    for sub in db.subcategories.find({"category_id": category_id}):
        subs.append({
            "_id": str(sub["_id"]),
            "name": sub["name"],
            "slug": sub.get("slug", ""),
            "category_id": str(sub["category_id"])
        })
    return jsonify(subs)

@subcategories_bp.route("/subcategories", methods=["POST"])
def create_subcategory():
    data = request.json
    slug = slugify(data["name"])
    new_id = current_app.mongo.db.subcategories.insert_one({
        "name": data["name"],
        "slug": slug,
        "category_id": ObjectId(data["category_id"])
    }).inserted_id
    return jsonify({"_id": str(new_id), "name": data["name"], "slug": slug}), 201
