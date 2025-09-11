from flask import Blueprint, request, jsonify
from db import db

categories_bp = Blueprint("categories", __name__)

@categories_bp.route("/", methods=["GET"])
def get_categories():
    categories = list(db.categories.find())
    for c in categories:
        c["_id"] = str(c["_id"])
    return jsonify(categories)

@categories_bp.route("/", methods=["POST"])
def add_category():
    data = request.json
    result = db.categories.insert_one(data)
    return jsonify({"message": "Category added", "id": str(result.inserted_id)})

@categories_bp.route("/<id>", methods=["PUT"])
def update_category(id):    
    data = request.json
    db.categories.update_one({"_id": id}, {"$set": data})
    return jsonify({"message": "Category updated"})

@categories_bp.route("/<id>", methods=["DELETE"])
def delete_category(id):
    db.categories.delete_one({"_id": id
)
    return jsonify({"message": "Category deleted"}) 