from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from utils import slugify

subcategories_bp = Blueprint("subcategories", __name__)

@subcategories_bp.route("/subcategories/<category_id>", methods=["GET"])
def get_subcategories(category_id):
    subs = []
    for sub in current_app.mongo.db.subcategories.find({"category_id": ObjectId(category_id)}):
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
