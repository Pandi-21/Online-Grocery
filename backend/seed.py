from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myshop"
mongo = PyMongo(app)

def seed_data():
    categories = [
        {"name": "Shop"},
       
    ]

    subcategories = [
        {"name": "Fruits & Vegetables", "category_name": "Shop"},
        {"name": "Diary & Bakery", "category_name": "Shop"},
        {"name": "Grocery & Staples", "category_name": "Shop"},
        {"name": "Snacks & Beverages", "category_name": "Shop"},
        # {"name": "Juices", "category_name": "Beverages"}
    ]

    items = [
        {"name": "Fresh Fruits",  "subcategory_name": "Fruits & Vegetables"},
        {"name": "Fresh Vegetables", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Organic Produce",  "subcategory_name": "Fruits & Vegetables"},
        {"name": "Exotic Fruits",  "subcategory_name": "Fruits & Vegetables"},
        {"name": "Seasonal Picks", "subcategory_name": "Fruits & Vegetables"},
        {"name": "Milk, Curd & Paneer", "category_name": "Diary & Bakery"},
        {"name": "Cheese & Butter", "category_name": "Diary & Bakery"},
        {"name": "Eggs", "category_name": "Diary & Bakery"},
        {"name": "Breads & Buns ", "category_name": "Diary & Bakery"},
        {"name": "Cakes & Pastries ", "category_name": "Diary & Bakery"},
        
    ]

    # Insert categories
    for cat in categories:
        existing = mongo.db.categories.find_one({"name": cat["name"]})
        if not existing:
            mongo.db.categories.insert_one(cat)

    # Insert subcategories
    for sub in subcategories:
        parent = mongo.db.categories.find_one({"name": sub["category_name"]})
        if parent:
            existing = mongo.db.subcategories.find_one(
                {"name": sub["name"], "category_id": parent["_id"]}
            )
            if not existing:
                mongo.db.subcategories.insert_one({
                    "name": sub["name"],
                    "category_id": parent["_id"]
                })

    # Insert items
    for item in items:
        parent_sub = mongo.db.subcategories.find_one({"name": item["subcategory_name"]})
        if parent_sub:
            existing = mongo.db.items.find_one(
                {"name": item["name"], "subcategory_id": parent_sub["_id"]}
            )
            if not existing:
                mongo.db.items.insert_one({
                    "name": item["name"],
                    
                    "subcategory_id": parent_sub["_id"],
                    "category_id": parent_sub["category_id"]
                })

    print("✅ Seeding complete with categories, subcategories & items!")

if __name__ == "__main__":
    with app.app_context():
        seed_data()
