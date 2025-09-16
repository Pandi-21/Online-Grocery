from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
import os, json

products_bp = Blueprint("products", __name__, url_prefix="/products")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- CREATE PRODUCT ----------------
@products_bp.route("", methods=["POST"])
def create_product():
    try:
        db = current_app.db  # ✅ use db from Flask app context

        data = request.form
        product = {
            "category": data.get("category"),
            "subcategory": data.get("subcategory"),
            "item": data.get("item"),
            "name": data.get("name"),
            "price": float(data.get("price", 0)),
            "description": data.get("description", ""),
            "sizes": data.getlist("sizes[]"),
            "colors": data.getlist("colors[]"),
            "quantity_options": data.getlist("quantity_options[]"),
            "specifications": {},
            "reviews": [],
            "images": []
        }

        # specifications JSON
        specs_json = data.get("specifications")
        if specs_json:
            try:
                product["specifications"] = json.loads(specs_json)
            except:
                product["specifications"] = {}

        # images (image_0, image_1, image_2)
        for i in range(3):
            file = request.files.get(f"image_{i}")
            if file:
                filename = secure_filename(file.filename)
                path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(path)
                product["images"].append(filename)

        db.products.insert_one(product)
        return jsonify({"message": "✅ Product created", "product": product}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET ALL PRODUCTS ----------------
@products_bp.route("", methods=["GET"])
def get_products():
    db = current_app.db
    products = []
    for p in db.products.find():
        p["_id"] = str(p["_id"])
        products.append(p)
    return jsonify(products)


# ---------------- GET SINGLE PRODUCT ----------------
@products_bp.route("/<id>", methods=["GET"])
def get_product(id):
    db = current_app.db
    p = db.products.find_one({"_id": ObjectId(id)})
    if not p:
        return jsonify({"error": "Not found"}), 404
    p["_id"] = str(p["_id"])
    return jsonify(p)


# ---------------- UPDATE PRODUCT ----------------
@products_bp.route("/<id>", methods=["PUT"])
def update_product(id):
    db = current_app.db
    p = db.products.find_one({"_id": ObjectId(id)})
    if not p:
        return jsonify({"error": "Not found"}), 404

    data = request.form
    update = {
        "category": data.get("category"),
        "subcategory": data.get("subcategory"),
        "item": data.get("item"),
        "name": data.get("name"),
        "price": float(data.get("price", 0)),
        "description": data.get("description", ""),
        "sizes": data.getlist("sizes[]"),
        "colors": data.getlist("colors[]"),
        "quantity_options": data.getlist("quantity_options[]"),
        "specifications": {},
    }

    # specifications JSON
    specs_json = data.get("specifications")
    if specs_json:
        try:
            update["specifications"] = json.loads(specs_json)
        except:
            update["specifications"] = {}

    # replace images only if new ones uploaded
    images = []
    for i in range(3):
        file = request.files.get(f"image_{i}")
        if file:
            filename = secure_filename(file.filename)
            path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(path)
            images.append(filename)
    if images:
        update["images"] = images

    db.products.update_one({"_id": ObjectId(id)}, {"$set": update})
    return jsonify({"message": "✅ Product updated"})


# ---------------- DELETE PRODUCT ----------------
@products_bp.route("/<id>", methods=["DELETE"])
def delete_product(id):
    db = current_app.db
    db.products.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "🗑️ Deleted successfully"})
