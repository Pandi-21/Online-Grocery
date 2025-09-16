from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId

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
    new_id = current_app.mongo.db.categories.insert_one({
        "name": data["name"]
    }).inserted_id
    return jsonify({"_id": str(new_id), "name": data["name"]}), 201
