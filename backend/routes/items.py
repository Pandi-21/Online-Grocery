from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId

items_bp = Blueprint("items", __name__)

@items_bp.route("/items/<subcategory_id>", methods=["GET"])
def get_items(subcategory_id):
    items = []
    for item in current_app.mongo.db.items.find({"subcategory_id": ObjectId(subcategory_id)}):
        items.append({
            "_id": str(item["_id"]),
            "name": item["name"],
            
            "subcategory_id": str(item["subcategory_id"]),
            "category_id": str(item["category_id"])
        })
    return jsonify(items)

@items_bp.route("/items", methods=["POST"])
def create_item():
    data = request.json
    new_id = current_app.mongo.db.items.insert_one({
        "name": data["name"],
         
        "subcategory_id": ObjectId(data["subcategory_id"]),
        "category_id": ObjectId(data["category_id"])
    }).inserted_id
    return jsonify({"_id": str(new_id), "name": data["name"]}), 201
