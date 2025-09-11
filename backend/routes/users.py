from flask import Blueprint, request, jsonify
from db import db

users_bp = Blueprint("users", __name__)

@users_bp.route("/", methods=["GET"])
def get_users():
    users = list(db.users.find())
    for u in users:
        u["_id"] = str(u["_id"])
    return jsonify(users)

@users_bp.route("/", methods=["POST"])
def add_user():
    data = request.json
    result = db.users.insert_one(data)
    return jsonify({"message": "User added", "id": str(result.inserted_id)})

@users_bp.route("/<id>", methods=["PUT"])
def update_user(id):
    data = request.json
    db.users.update_one({"_id": id}, {"$set": data})
    return jsonify({"message": "User updated"}) 

@users_bp.route("/<id>", methods=["DELETE"])
def delete_user(id):
    db.users.delete_one({"_id": id})
    return jsonify({"message": "User deleted"})

