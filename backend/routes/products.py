from flask import Blueprint, request, jsonify
from db import db

products_bp = Blueprint("products", __name__)

@products_bp.route("/", methods=["GET"])
def get_products():
    products = list(db.products.find())
    for p in products:
        p["_id"] = str(p["_id"])
    return jsonify(products)

@products_bp.route("/", methods=["POST"])
def add_product():
    data = request.json
    result = db.products.insert_one(data)
    return jsonify({"message": "Product added", "id": str(result.inserted_id)})

@products_bp.route("/<id>", methods=["PUT"])
def update_product(id):
    data = request.json
    db.products.update_one({"_id": id}, {"$set": data})
    return jsonify({"message": "Product updated"})

@products_bp.route("/<id>", methods=["DELETE"])
def delete_product(id):
    db.products.delete_one({"_id": id})
    return jsonify({"message": "Product deleted"})
