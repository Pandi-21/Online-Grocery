from flask import Blueprint, request, jsonify
from models import mongo, serialize_doc
from bson import ObjectId

category_bp = Blueprint("categories", __name__)

# ✅ Create a new category
@category_bp.route("/categories", methods=["POST"])
def create_category():
    data = request.json
    if not data.get("name"):
        return jsonify({"error": "Category name is required"}), 400

    new_category = {
        "name": data["name"],
        "subcategories": []  # each subcategory has { name, items }
    }
    mongo.db.categories.insert_one(new_category)
    return jsonify({"message": "Category created successfully"}), 201


# ✅ Get all categories
@category_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = list(mongo.db.categories.find())
    return jsonify([serialize_doc(c) for c in categories])


# ✅ Add Subcategory to a Category
@category_bp.route("/categories/<id>/subcategories", methods=["POST"])
def add_subcategory(id):
    data = request.json
    if not data.get("name"):
        return jsonify({"error": "Subcategory name is required"}), 400

    subcategory = {
        "_id": str(ObjectId()),
        "name": data["name"],
        "items": []
    }
    mongo.db.categories.update_one(
        {"_id": ObjectId(id)},
        {"$push": {"subcategories": subcategory}}
    )
    return jsonify({"message": "Subcategory added successfully"}), 201


# ✅ Add Item to a Subcategory
@category_bp.route("/categories/<cat_id>/subcategories/<sub_id>/items", methods=["POST"])
def add_item(cat_id, sub_id):
    data = request.json
    if not data.get("name"):
        return jsonify({"error": "Item name is required"}), 400

    item = {
        "_id": str(ObjectId()),
        "name": data["name"]
    }
    mongo.db.categories.update_one(
        {"_id": ObjectId(cat_id), "subcategories._id": sub_id},
        {"$push": {"subcategories.$.items": item}}
    )
    return jsonify({"message": "Item added successfully"}), 201


# ✅ Get single category with subcategories & items
@category_bp.route("/categories/<id>", methods=["GET"])
def get_category(id):
    category = mongo.db.categories.find_one({"_id": ObjectId(id)})
    if not category:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(serialize_doc(category))
