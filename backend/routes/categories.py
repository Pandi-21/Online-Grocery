from flask import Blueprint, jsonify, current_app
from bson import ObjectId

categories_bp = Blueprint("categories", __name__)

@categories_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = []
    for cat in current_app.mongo.db.categories.find():
        cat_id = cat["_id"]

        subcategories = []
        for sub in current_app.mongo.db.subcategories.find({"category_id": cat_id}):
            sub_id = sub["_id"]

            items = []
            for item in current_app.mongo.db.items.find({"subcategory_id": sub_id}):
                items.append({
                    "_id": str(item["_id"]),
                    "name": item["name"],
                    "slug": item.get("slug", "")
                })

            subcategories.append({
                "_id": str(sub_id),
                "name": sub["name"],
                "slug": sub.get("slug", ""),
                "items": items
            })

        categories.append({
            "_id": str(cat_id),
            "name": cat["name"],
            "slug": cat.get("slug", ""),
            "subcategories": subcategories
        })

    return jsonify(categories)
