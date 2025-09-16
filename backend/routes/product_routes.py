from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from models.product_model import product_serializer

product_bp = Blueprint("product_bp", __name__)
mongo = None  # Will be set in app.py

@product_bp.route("/products", methods=["GET"])
def get_all_products():
    products = mongo.db.products.find()
    return jsonify([product_serializer(p) for p in products])

@product_bp.route("/products/<id>", methods=["GET"])
def get_product(id):
    product = mongo.db.products.find_one({"_id": ObjectId(id)})
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product_serializer(product))

@product_bp.route("/products", methods=["POST"])
def add_product():
    data = request.json
    # Validate category
    category_id = data["category_id"]
    if not mongo.db.categories.find_one({"_id": ObjectId(category_id)}):
        return jsonify({"error": "Invalid category"}), 400

    product = {
        "name": data["name"],
         
        "category_id": ObjectId(category_id),
        "description": data.get("description", "")
    }

    result = mongo.db.products.insert_one(product)
    return jsonify({"message": "Product added", "id": str(result.inserted_id)})

@product_bp.route("/products/<id>", methods=["PUT"])
def update_product(id):
    data = request.json
    update_data = {
        "name": data.get("name"),
       
        "description": data.get("description")
    }
    if "category_id" in data:
        if not mongo.db.categories.find_one({"_id": ObjectId(data["category_id"])}):
            return jsonify({"error": "Invalid category"}), 400
        update_data["category_id"] = ObjectId(data["category_id"])

    mongo.db.products.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    return jsonify({"message": "Product updated"})

@product_bp.route("/products/<id>", methods=["DELETE"])
def delete_product(id):
    mongo.db.products.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Product deleted"})
