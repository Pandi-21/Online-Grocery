from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
import os, json

products_bp = Blueprint("products", __name__, url_prefix="/products")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------- CREATE PRODUCT ----------------
@products_bp.route("", methods=["POST"])
def create_product():
    try:
        db = current_app.db
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
            "images": [],
        }

        # specifications JSON
        specs_json = data.get("specifications")
        if specs_json:
            try:
                product["specifications"] = json.loads(specs_json)
            except Exception:
                product["specifications"] = {}

        # images (image_0, image_1, image_2)
        for i in range(3):
            file = request.files.get(f"image_{i}")
            if file:
                if not allowed_file(file.filename):
                    return jsonify({"error": "Only image files allowed"}), 400
                file.seek(0, os.SEEK_END)
                file_size = file.tell()
                file.seek(0)
                if file_size > MAX_FILE_SIZE:
                    return jsonify({"error": "Each image must be ≤5MB"}), 400

                filename = secure_filename(file.filename)
                path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(path)
                product["images"].append(filename)

        db.products.insert_one(product)
        return jsonify({"message": "Product created", "product": product}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- GET ALL PRODUCTS ----------------
@products_bp.route("", methods=["GET"])
def get_products():
    db = current_app.db
    products = []

    for p in db.products.find():
        p["_id"] = str(p["_id"])

        # fetch category
        if p.get("category"):
            cat = db.categories.find_one({"_id": ObjectId(p["category"])})
            if cat:
                p["category"] = {
                    "_id": str(cat["_id"]),
                    "name": cat["name"],
                    "slug": cat.get("slug")  # 👈 important
                }

        # fetch subcategory
        if p.get("subcategory"):
            sub = db.subcategories.find_one({"_id": ObjectId(p["subcategory"])})
            if sub:
                p["subcategory"] = {
                    "_id": str(sub["_id"]),
                    "name": sub["name"],
                    "slug": sub.get("slug")  # 👈 important
                }

        # fetch item
        if p.get("item"):
            item = db.items.find_one({"_id": ObjectId(p["item"])})
            if item:
                p["item"] = {
                    "_id": str(item["_id"]),
                    "name": item["name"],
                    "slug": item.get("slug")  # 👈 important
                }

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

    # fetch category name
    if p.get("category"):
        cat = db.categories.find_one({"_id": ObjectId(p["category"])})
        if cat:
            p["category"] = {"_id": str(cat["_id"]), "name": cat["name"]}

    # fetch subcategory name
    if p.get("subcategory"):
        sub = db.subcategories.find_one({"_id": ObjectId(p["subcategory"])})
        if sub:
            p["subcategory"] = {"_id": str(sub["_id"]), "name": sub["name"]}

    # fetch item name
    if p.get("item"):
        item = db.items.find_one({"_id": ObjectId(p["item"])})
        if item:
            p["item"] = {"_id": str(item["_id"]), "name": item["name"]}

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
        except Exception:
            update["specifications"] = {}

    # existing images from form
    existing_images = data.getlist("existingImages[]")
    images = existing_images[:]

    # new uploads
    for i in range(3):
        file = request.files.get(f"image_{i}")
        if file:
            if not allowed_file(file.filename):
                return jsonify({"error": "Only image files allowed"}), 400
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            if file_size > MAX_FILE_SIZE:
                return jsonify({"error": "Each image must be ≤5MB"}), 400

            filename = secure_filename(file.filename)
            path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(path)
            images.append(filename)

    update["images"] = images

    db.products.update_one({"_id": ObjectId(id)}, {"$set": update})
    return jsonify({"message": "Product updated"})


# ---------------- DELETE PRODUCT ----------------
@products_bp.route("/<id>", methods=["DELETE"])
def delete_product(id):
    db = current_app.db
    db.products.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Deleted successfully"})
