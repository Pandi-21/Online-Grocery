from flask import current_app, request, jsonify
from bson.objectid import ObjectId
import json
from utils.helpers import slugify, save_images, to_object_id, object_id_str

# ---------------- CREATE PRODUCT ----------------
def create_product():
    db = current_app.db
    data = request.form
    tags = data.getlist("tags[]")

    sub = db.subcategories.find_one({"_id": to_object_id(data.get("subcategory"))}) if data.get("subcategory") else None
    item = db.items.find_one({"_id": to_object_id(data.get("item"))}) if data.get("item") else None

    product = {
        "category": data.get("category"),
        "subcategory": data.get("subcategory"),
        "item": data.get("item"),
        "name": data.get("name"),
        "slug": slugify(data.get("name")),
        "subcategory_slug": sub.get("slug") if sub else "",
        "item_slug": item.get("slug") if item else "",
        "category_slug": data.get("category_slug", ""),
        "price": float(data.get("price", 0)),
        "description": data.get("description", ""),
        "sizes": data.getlist("sizes[]"),
        "colors": data.getlist("colors[]"),
        "quantity_options": data.getlist("quantity_options[]"),
        "specifications": {},
        "reviews": [],
        "images": [],
        "tags": tags
    }

    specs_json = data.get("specifications")
    if specs_json:
        try:
            product["specifications"] = json.loads(specs_json)
        except Exception:
            product["specifications"] = {}

    try:
        product["images"] = save_images(request.files)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    inserted = db.products.insert_one(product)
    product["_id"] = str(inserted.inserted_id)
    return jsonify({"message": "Product created", "product": product}), 201

# ---------------- GET ALL PRODUCTS ----------------
def get_all_products():
    db = current_app.db
    products = []
    for p in db.products.find():
        p["_id"] = object_id_str(p)

        if p.get("category"):
            cat = db.categories.find_one({"_id": to_object_id(p["category"])})
            if cat:
                p["category"] = {"_id": object_id_str(cat), "name": cat["name"], "slug": cat.get("slug")}

        if p.get("subcategory"):
            sub = db.subcategories.find_one({"_id": to_object_id(p["subcategory"])})
            if sub:
                p["subcategory"] = {"_id": object_id_str(sub), "name": sub["name"], "slug": sub.get("slug")}

        if p.get("item"):
            item = db.items.find_one({"_id": to_object_id(p["item"])})
            if item:
                p["item"] = {"_id": object_id_str(item), "name": item["name"], "slug": item.get("slug")}

        products.append(p)
    return jsonify(products)

# ---------------- GET SINGLE PRODUCT ----------------
def get_product_by_id(id):
    db = current_app.db
    product = db.products.find_one({"_id": to_object_id(id)})
    if not product:
        return jsonify({"error": "Not found"}), 404
    product["_id"] = object_id_str(product)
    return jsonify(product)

def get_product_by_slug(slug):
    db = current_app.db
    product = db.products.find_one({"slug": slug})
    if not product:
        return jsonify({"error": "Not found"}), 404
    product["_id"] = object_id_str(product)
    return jsonify(product)

# ---------------- UPDATE PRODUCT ----------------
def update_product(id):
    db = current_app.db
    product = db.products.find_one({"_id": to_object_id(id)})
    if not product:
        return jsonify({"error": "Not found"}), 404

    data = request.form
    tags = data.getlist("tags[]")
    sub = db.subcategories.find_one({"_id": to_object_id(data.get("subcategory"))}) if data.get("subcategory") else None
    item = db.items.find_one({"_id": to_object_id(data.get("item"))}) if data.get("item") else None

    update = {
        "category": data.get("category"),
        "subcategory": data.get("subcategory"),
        "item": data.get("item"),
        "name": data.get("name"),
        "slug": slugify(data.get("name")),
        "subcategory_slug": sub.get("slug") if sub else "",
        "item_slug": item.get("slug") if item else "",
        "category_slug": data.get("category_slug", ""),
        "price": float(data.get("price", 0)),
        "description": data.get("description", ""),
        "sizes": data.getlist("sizes[]"),
        "colors": data.getlist("colors[]"),
        "quantity_options": data.getlist("quantity_options[]"),
        "specifications": {},
        "tags": tags
    }

    specs_json = data.get("specifications")
    if specs_json:
        try:
            update["specifications"] = json.loads(specs_json)
        except Exception:
            update["specifications"] = {}

    existing_images = data.getlist("existingImages[]")
    try:
        update["images"] = save_images(request.files, existing_images)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    db.products.update_one({"_id": to_object_id(id)}, {"$set": update})
    return jsonify({"message": "Product updated"})

# ---------------- DELETE PRODUCT ----------------
def delete_product(id):
    db = current_app.db
    db.products.delete_one({"_id": to_object_id(id)})
    return jsonify({"message": "Deleted successfully"})

# ---------------- GET PRODUCTS BY SUBCATEGORY + ITEM ----------------
def get_products_by_sub_item(subcategory_slug, item_slug):
    db = current_app.db
    query = {"subcategory_slug": subcategory_slug, "item_slug": item_slug}
    products = []
    for p in db.products.find(query):
        p["_id"] = object_id_str(p)
        if p.get("category"):
            cat = db.categories.find_one({"_id": to_object_id(p["category"])})
            if cat:
                p["category"] = {"_id": object_id_str(cat), "name": cat["name"], "slug": cat.get("slug")}
        if p.get("subcategory"):
            sub = db.subcategories.find_one({"_id": to_object_id(p["subcategory"])})
            if sub:
                p["subcategory"] = {"_id": object_id_str(sub), "name": sub["name"], "slug": sub.get("slug")}
        if p.get("item"):
            item = db.items.find_one({"_id": to_object_id(p["item"])})
            if item:
                p["item"] = {"_id": object_id_str(item), "name": item["name"], "slug": item.get("slug")}
        products.append(p)
    return jsonify(products)

# ---------------- GET SINGLE PRODUCT BY SUB/ITEM/SLUG ----------------
def get_product_by_sub_item_slug(subcategory_slug, item_slug, product_slug):
    db = current_app.db
    product = db.products.find_one({"slug": product_slug})
    if not product:
        return jsonify({"error": "Product not found"}), 404
    if product.get("subcategory_slug") != subcategory_slug or product.get("item_slug") != item_slug:
        return jsonify({"error": "Mismatch"}), 404
    product["_id"] = object_id_str(product)
    return jsonify(product)

# ---------------- SEARCH PRODUCTS ----------------
def search_products():
    db = current_app.db
    q = request.args.get("q", "")
    products = list(db.products.find({"name": {"$regex": q, "$options": "i"}}))
    for p in products:
        p["_id"] = object_id_str(p)
    return jsonify(products)

# ---------------- GET PRODUCTS BY TAG/SECTION ----------------
def get_products_by_section(section_name):
    db = current_app.db
    products = list(db.products.find({"tags": {"$regex": section_name, "$options": "i"}}))
    for p in products:
        p["_id"] = object_id_str(p)
    return jsonify(products)
