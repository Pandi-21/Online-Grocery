from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
import re, unicodedata
from bson.objectid import ObjectId

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myshop"
mongo = PyMongo(app)

# ---------------- Slugify ----------------
def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# ---------------- API ----------------
@app.route("/categories", methods=["GET"])
def get_categories():
    """Return categories with nested subcategories and items"""
    categories = []
    for cat in mongo.db.categories.find():
        cat_id = cat["_id"]

        subcategories = []
        for sub in mongo.db.subcategories.find({"category_id": cat_id}):
            sub_id = sub["_id"]

            items = []
            for item in mongo.db.items.find({"subcategory_id": sub_id}):
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

@app.route("/subcategories", methods=["GET"])
def get_subcategories():
    """Return only subcategories for a given category slug (flat)"""
    category_slug = request.args.get("category")
    if not category_slug:
        return jsonify([])

    category = mongo.db.categories.find_one({"slug": category_slug})
    if not category:
        return jsonify([])

    subs = list(mongo.db.subcategories.find({"category_id": category["_id"]}, {"name": 1, "slug": 1}))
    for s in subs:
        s["_id"] = str(s["_id"])
    return jsonify(subs)

@app.route("/recipes", methods=["GET"])
def get_recipes():
    """Return recipes (optionally filtered by subcategory slug)"""
    sub_slug = request.args.get("subcategory")

    if not sub_slug:
        # return all recipes
        recipes = list(mongo.db.recipes.find())
    else:
        # find the subcategory first
        sub = mongo.db.subcategories.find_one({"slug": sub_slug})
        if not sub:
            return jsonify([])
        recipes = list(mongo.db.recipes.find({"subcategory_id": sub["_id"]}))

    for r in recipes:
        r["_id"] = str(r["_id"])
    return jsonify(recipes)

# ---------------- Seed Data ----------------
def seed_data():
    # --- Categories ---
    categories = [
        {"name": "Shop"},
        {"name": "Recipes"}
    ]

    # --- Shop Subcategories ---
    shop_subcategories = [
        {"name": "Fruits & Vegetables", "category_name": "Shop"},
        {"name": "Diary & Bakery", "category_name": "Shop"},
        {"name": "Grocery & Staples", "category_name": "Shop"},
        {"name": "Snacks & Beverages", "category_name": "Shop"},
    ]

    # --- Shop Items ---
    shop_items = [
        {"name": "Fresh Fruits", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Fresh Vegetables", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Organic Produce", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Exotic Fruits", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Seasonal Picks", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Milk, Curd & Paneer", "subcategory_name": "Diary & Bakery"},
        {"name": "Cheese & Butter", "subcategory_name": "Diary & Bakery"},
        {"name": "Eggs", "subcategory_name": "Diary & Bakery"},
        {"name": "Breads & Buns", "subcategory_name": "Diary & Bakery"},
        {"name": "Cakes & Pastries", "subcategory_name": "Diary & Bakery"},
    ]

    # ---------------- Insert Categories ----------------
    for cat in categories:
        if not mongo.db.categories.find_one({"name": cat["name"]}):
            mongo.db.categories.insert_one({
                "name": cat["name"],
                "slug": slugify(cat["name"])
            })

    # ---------------- Insert Shop Subcategories ----------------
    for sub in shop_subcategories:
        parent = mongo.db.categories.find_one({"name": sub["category_name"]})
        if parent and not mongo.db.subcategories.find_one({"name": sub["name"], "category_id": parent["_id"]}):
            mongo.db.subcategories.insert_one({
                "name": sub["name"],
                "slug": slugify(sub["name"]),
                "category_id": parent["_id"]
            })

    # ---------------- Insert Shop Items ----------------
    for item in shop_items:
        parent_sub = mongo.db.subcategories.find_one({"name": item["subcategory_name"]})
        if parent_sub and not mongo.db.items.find_one({"name": item["name"], "subcategory_id": parent_sub["_id"]}):
            mongo.db.items.insert_one({
                "name": item["name"],
                "slug": slugify(item["name"]),
                "subcategory_id": parent_sub["_id"],
                "category_id": parent_sub["category_id"]
            })

    # ---------------- Insert Recipe Subcategories under Recipes ----------------
    recipes_cat = mongo.db.categories.find_one({"name": "Recipes"})
    if recipes_cat:
        for name in ["Quick & Easy", "Healthy Choices", "Breakfast Ideas", "Lunch & Dinner", "Desserts & Drinks"]:
            if not mongo.db.subcategories.find_one({"name": name, "category_id": recipes_cat["_id"]}):
                mongo.db.subcategories.insert_one({
                    "name": name,
                    "slug": slugify(name),
                    "category_id": recipes_cat["_id"]
                })

    print("✅ Seeding complete: Shop + Recipes structure created!")

# ---------------- Run App ----------------
if __name__ == "__main__":
    with app.app_context():
        seed_data()
    app.run(debug=True)
