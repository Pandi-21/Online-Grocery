from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import re   # for slugify

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myshop"
mongo = PyMongo(app)

def slugify(text: str) -> str:
    return re.sub(r"\s+", "-", text.strip().lower())

def seed_data():
    categories = [
        {"name": "Shop"},
    ]

    subcategories = [
        {"name": "Fruits & Vegetables", "category_name": "Shop"},
        {"name": "Diary & Bakery", "category_name": "Shop"},
        {"name": "Grocery & Staples", "category_name": "Shop"},
        {"name": "Snacks & Beverages", "category_name": "Shop"},
    ]

    items = [
        {"name": "Fresh Fruits",  "subcategory_name": "Fruits & Vegetables"},
        {"name": "Fresh Vegetables", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Organic Produce",  "subcategory_name": "Fruits & Vegetables"},
        {"name": "Exotic Fruits",  "subcategory_name": "Fruits & Vegetables"},
        {"name": "Seasonal Picks", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Milk, Curd & Paneer", "subcategory_name": "Diary & Bakery"},
        {"name": "Cheese & Butter", "subcategory_name": "Diary & Bakery"},
        {"name": "Eggs", "subcategory_name": "Diary & Bakery"},
        {"name": "Breads & Buns", "subcategory_name": "Diary & Bakery"},
        {"name": "Cakes & Pastries", "subcategory_name": "Diary & Bakery"},
    ]

    # Insert categories
    for cat in categories:
        if not mongo.db.categories.find_one({"name": cat["name"]}):
            mongo.db.categories.insert_one({
                "name": cat["name"],
                "slug": slugify(cat["name"])
            })

    # Insert subcategories
    for sub in subcategories:
        parent = mongo.db.categories.find_one({"name": sub["category_name"]})
        if parent and not mongo.db.subcategories.find_one({"name": sub["name"], "category_id": parent["_id"]}):
            mongo.db.subcategories.insert_one({
                "name": sub["name"],
                "slug": slugify(sub["name"]),
                "category_id": parent["_id"]
            })

    # Insert items
    for item in items:
        parent_sub = mongo.db.subcategories.find_one({"name": item["subcategory_name"]})
        if parent_sub and not mongo.db.items.find_one({"name": item["name"], "subcategory_id": parent_sub["_id"]}):
            mongo.db.items.insert_one({
                "name": item["name"],
                "slug": slugify(item["name"]),
                "subcategory_id": parent_sub["_id"],
                "category_id": parent_sub["category_id"]
            })

    print("✅ Seeding complete with slugs!")

if __name__ == "__main__":
    with app.app_context():
        seed_data()   # only runs when you python app.py
    app.run(debug=True)
