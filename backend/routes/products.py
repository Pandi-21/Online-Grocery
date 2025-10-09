# from flask import Blueprint, request, jsonify, current_app
# from werkzeug.utils import secure_filename
# from bson.objectid import ObjectId
# from bson.errors import InvalidId
# import os, json, re, unicodedata

# products_bp = Blueprint("products", __name__, url_prefix="/products")

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
# MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

# def allowed_file(filename):
#     return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# def slugify(text):
#     """Turn any string into a URL-safe slug"""
#     if not text:
#         return ""
#     text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
#     text = text.lower()
#     text = re.sub(r'[^a-z0-9]+', '-', text)
#     return text.strip('-')


# # ---------------- CREATE PRODUCT ----------------
# @products_bp.route("", methods=["POST"])
# def create_product():
#     try:
#         db = current_app.db
#         data = request.form

#         sub = db.subcategories.find_one({"_id": ObjectId(data.get("subcategory"))}) if data.get("subcategory") else None
#         item = db.items.find_one({"_id": ObjectId(data.get("item"))}) if data.get("item") else None

#         tags = data.getlist("tags[]")

#         product = {
#             "category": data.get("category"),
#             "subcategory": data.get("subcategory"),
#             "item": data.get("item"),
#             "name": data.get("name"),
#             "slug": slugify(data.get("name")),
#             "subcategory_slug": sub.get("slug") if sub else "",
#             "item_slug": item.get("slug") if item else "",
#             "category_slug": data.get("category_slug", ""),
#             "price": float(data.get("price", 0)),
#             "description": data.get("description", ""),
#             "sizes": data.getlist("sizes[]"),
#             "colors": data.getlist("colors[]"),
#             "quantity_options": data.getlist("quantity_options[]"),
#             "specifications": {},
#             "reviews": [],
#             "images": [],
#             "tags": tags
#         }

#         specs_json = data.get("specifications")
#         if specs_json:
#             try:
#                 product["specifications"] = json.loads(specs_json)
#             except Exception:
#                 product["specifications"] = {}

#         # handle images
#         for i in range(3):
#             file = request.files.get(f"image_{i}")
#             if file:
#                 if not allowed_file(file.filename):
#                     return jsonify({"error": "Only image files allowed"}), 400
#                 file.seek(0, os.SEEK_END)
#                 file_size = file.tell()
#                 file.seek(0)
#                 if file_size > MAX_FILE_SIZE:
#                     return jsonify({"error": "Each image must be ≤5MB"}), 400

#                 filename = secure_filename(file.filename)
#                 path = os.path.join(UPLOAD_FOLDER, filename)
#                 file.save(path)
#                 product["images"].append(filename)

#         inserted = db.products.insert_one(product)
#         product["_id"] = str(inserted.inserted_id)
#         return jsonify({"message": "Product created", "product": product}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # ---------------- GET ALL PRODUCTS ----------------
# @products_bp.route("", methods=["GET"])
# def get_all_products():
#     db = current_app.db
#     products = []
#     for p in db.products.find():
#         p["_id"] = str(p["_id"])

#         if p.get("category"):
#             cat = db.categories.find_one({"_id": ObjectId(p["category"])})
#             if cat:
#                 p["category"] = {"_id": str(cat["_id"]), "name": cat["name"], "slug": cat.get("slug")}

#         if p.get("subcategory"):
#             sub = db.subcategories.find_one({"_id": ObjectId(p["subcategory"])})
#             if sub:
#                 p["subcategory"] = {"_id": str(sub["_id"]), "name": sub["name"], "slug": sub.get("slug")}

#         if p.get("item"):
#             item = db.items.find_one({"_id": ObjectId(p["item"])})
#             if item:
#                 p["item"] = {"_id": str(item["_id"]), "name": item["name"], "slug": item.get("slug")}

#         products.append(p)
#     return jsonify(products)


# # ---------------- GET PRODUCTS BY SUBCATEGORY + ITEM ----------------
# @products_bp.route("/<subcategory_slug>/<item_slug>", methods=["GET"])
# def get_products_by_sub_and_item(subcategory_slug, item_slug):
#     db = current_app.db
#     query = {"subcategory_slug": subcategory_slug, "item_slug": item_slug}

#     products = []
#     for p in db.products.find(query):
#         p["_id"] = str(p["_id"])

#         if p.get("category"):
#             cat = db.categories.find_one({"_id": ObjectId(p["category"])})
#             if cat:
#                 p["category"] = {"_id": str(cat["_id"]), "name": cat["name"], "slug": cat.get("slug")}

#         if p.get("subcategory"):
#             sub = db.subcategories.find_one({"_id": ObjectId(p["subcategory"])})
#             if sub:
#                 p["subcategory"] = {"_id": str(sub["_id"]), "name": sub["name"], "slug": sub.get("slug")}

#         if p.get("item"):
#             item = db.items.find_one({"_id": ObjectId(p["item"])})
#             if item:
#                 p["item"] = {"_id": str(item["_id"]), "name": item["name"], "slug": item.get("slug")}

#         products.append(p)

#     return jsonify(products)


# # ---------------- GET SINGLE PRODUCT BY SLUG ----------------
# @products_bp.route("/slug/<product_slug>", methods=["GET"])
# def get_product_by_slug_simple(product_slug):
#     db = current_app.db
#     p = db.products.find_one({"slug": product_slug})
#     if not p:
#         return jsonify({"error": "Not found"}), 404
#     p["_id"] = str(p["_id"])
#     return jsonify(p)


# # ---------------- GET SINGLE PRODUCT BY ID ----------------
# @products_bp.route("/id/<id>", methods=["GET"])
# def get_product_by_id(id):
#     db = current_app.db
#     try:
#         product = db.products.find_one({"_id": ObjectId(id)})
#     except InvalidId:
#         return jsonify({"error": "Invalid product ID"}), 400

#     if not product:
#         return jsonify({"error": "Not found"}), 404
#     product["_id"] = str(product["_id"])
#     return jsonify(product)


# # ---------------- GET SINGLE PRODUCT BY SUB/ITEM/SLUG ----------------
# @products_bp.route("/<subcategory_slug>/<item_slug>/<product_slug>", methods=["GET"])
# def get_product_by_sub_item_slug(subcategory_slug, item_slug, product_slug):
#     db = current_app.db
#     product = db.products.find_one({"slug": product_slug})
#     if not product:
#         return jsonify({"error": "Product not found"}), 404
#     if product.get("subcategory_slug") != subcategory_slug or product.get("item_slug") != item_slug:
#         return jsonify({"error": "Mismatch"}), 404
#     product["_id"] = str(product["_id"])
#     return jsonify(product)


# # ---------------- SEARCH PRODUCTS ----------------
# @products_bp.route("/search")
# def search_products():
#     q = request.args.get("q", "")
#     db = current_app.db
#     products = list(db.products.find({"name": {"$regex": q, "$options": "i"}}))
#     for p in products:
#         p["_id"] = str(p["_id"])
#     return jsonify(products)


# # ---------------- GET PRODUCTS BY SECTION/TAG ----------------
# @products_bp.route("/section/<section_name>", methods=["GET"])
# def get_products_by_section(section_name):
#     db = current_app.db
#     products = list(db.products.find({"tags": {"$regex": section_name, "$options": "i"}}))
#     for p in products:
#         p["_id"] = str(p["_id"])
#     return jsonify(products)


# # ---------------- UPDATE PRODUCT ----------------
# @products_bp.route("/<id>", methods=["PUT"])
# def update_product(id):
#     db = current_app.db
#     try:
#         product = db.products.find_one({"_id": ObjectId(id)})
#     except InvalidId:
#         return jsonify({"error": "Invalid product ID"}), 400

#     if not product:
#         return jsonify({"error": "Not found"}), 404

#     data = request.form

#     sub = db.subcategories.find_one({"_id": ObjectId(data.get("subcategory"))}) if data.get("subcategory") else None
#     item = db.items.find_one({"_id": ObjectId(data.get("item"))}) if data.get("item") else None

#     tags = data.getlist("tags[]")

#     update = {
#         "category": data.get("category"),
#         "subcategory": data.get("subcategory"),
#         "item": data.get("item"),
#         "name": data.get("name"),
#         "slug": slugify(data.get("name")),
#         "subcategory_slug": sub.get("slug") if sub else "",
#         "item_slug": item.get("slug") if item else "",
#         "category_slug": data.get("category_slug", ""),
#         "price": float(data.get("price", 0)),
#         "description": data.get("description", ""),
#         "sizes": data.getlist("sizes[]"),
#         "colors": data.getlist("colors[]"),
#         "quantity_options": data.getlist("quantity_options[]"),
#         "specifications": {},
#         "tags": tags
#     }

#     specs_json = data.get("specifications")
#     if specs_json:
#         try:
#             update["specifications"] = json.loads(specs_json)
#         except Exception:
#             update["specifications"] = {}

#     existing_images = data.getlist("existingImages[]")
#     images = existing_images[:]

#     for i in range(3):
#         file = request.files.get(f"image_{i}")
#         if file:
#             if not allowed_file(file.filename):
#                 return jsonify({"error": "Only image files allowed"}), 400
#             file.seek(0, os.SEEK_END)
#             file_size = file.tell()
#             file.seek(0)
#             if file_size > MAX_FILE_SIZE:
#                 return jsonify({"error": "Each image must be ≤5MB"}), 400

#             filename = secure_filename(file.filename)
#             path = os.path.join(UPLOAD_FOLDER, filename)
#             file.save(path)
#             images.append(filename)

#     update["images"] = images

#     db.products.update_one({"_id": ObjectId(id)}, {"$set": update})
#     return jsonify({"message": "Product updated"})


# # ---------------- DELETE PRODUCT ----------------
# @products_bp.route("/<id>", methods=["DELETE"])
# def delete_product(id):
#     db = current_app.db
#     try:
#         db.products.delete_one({"_id": ObjectId(id)})
#     except InvalidId:
#         return jsonify({"error": "Invalid product ID"}), 400
#     return jsonify({"message": "Deleted successfully"})
from flask import Blueprint
from controllers.productController import *

products_bp = Blueprint("products", __name__, url_prefix="/products")

products_bp.route("", methods=["POST"])(create_product)
products_bp.route("", methods=["GET"])(get_all_products)
products_bp.route("/id/<id>", methods=["GET"])(get_product_by_id)
products_bp.route("/slug/<slug>", methods=["GET"])(get_product_by_slug)
products_bp.route("/<id>", methods=["PUT"])(update_product)
products_bp.route("/<id>", methods=["DELETE"])(delete_product)
# existing imports and blueprint code

products_bp.route("/<subcategory_slug>/<item_slug>", methods=["GET"])(get_products_by_sub_item)
products_bp.route("/<subcategory_slug>/<item_slug>/<product_slug>", methods=["GET"])(get_product_by_sub_item_slug)
products_bp.route("/search", methods=["GET"])(search_products)
products_bp.route("/section/<section_name>", methods=["GET"])(get_products_by_section)
