# from flask import Flask
# from flask_pymongo import PyMongo
# from bson.objectid import ObjectId
# import re
# import unicodedata

# app = Flask(__name__)
# app.config["MONGO_URI"] = "mongodb://localhost:27017/myshop"
# mongo = PyMongo(app)

# # ✅ Slugify
# def slugify(text: str) -> str:
#     text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
#     text = text.lower()
#     text = re.sub(r'[^a-z0-9]+', '-', text)
#     return text.strip('-')

# def seed_data():
#     # Categories
#     categories = [
#         {"name": "Shop"},
#         {"name": "Recipes"}   # ✅ Added Recipes as constant category
#     ]

#     # Subcategories for Shop
#     shop_subcategories = [
#         {"name": "Fruits & Vegetables", "category_name": "Shop"},
#         {"name": "Diary & Bakery", "category_name": "Shop"},
#         {"name": "Grocery & Staples", "category_name": "Shop"},
#         {"name": "Snacks & Beverages", "category_name": "Shop"},
#     ]

#     # Items for Shop
#     items = [
#         {"name": "Fresh Fruits", "subcategory_name": "Fruits & Vegetables"},
#         {"name": "Fresh Vegetables", "subcategory_name": "Fruits & Vegetables"},
#         {"name": "Organic Produce", "subcategory_name": "Fruits & Vegetables"},
#         {"name": "Exotic Fruits", "subcategory_name": "Fruits & Vegetables"},
#         {"name": "Seasonal Picks", "subcategory_name": "Fruits & Vegetables"},
#         {"name": "Milk, Curd & Paneer", "subcategory_name": "Diary & Bakery"},
#         {"name": "Cheese & Butter", "subcategory_name": "Diary & Bakery"},
#         {"name": "Eggs", "subcategory_name": "Diary & Bakery"},
#         {"name": "Breads & Buns", "subcategory_name": "Diary & Bakery"},
#         {"name": "Cakes & Pastries", "subcategory_name": "Diary & Bakery"},
#     ]

#     # Subcategories for Recipes (constant list)
#     recipe_subcategories = [
#         {"name": "Quick & Easy", "category_name": "Recipes"},
#         {"name": "Healthy Choices", "category_name": "Recipes"},
#         {"name": "Breakfast Ideas", "category_name": "Recipes"},
#         {"name": "Lunch & Dinner", "category_name": "Recipes"},
#         {"name": "Desserts & Drinks", "category_name": "Recipes"},
#     ]

#     # ✅ Insert categories
#     for cat in categories:
#         if not mongo.db.categories.find_one({"name": cat["name"]}):
#             mongo.db.categories.insert_one({
#                 "name": cat["name"],
#                 "slug": slugify(cat["name"])
#             })

#     # ✅ Insert Shop subcategories
#     for sub in shop_subcategories:
#         parent = mongo.db.categories.find_one({"name": sub["category_name"]})
#         if parent and not mongo.db.subcategories.find_one({"name": sub["name"], "category_id": parent["_id"]}):
#             mongo.db.subcategories.insert_one({
#                 "name": sub["name"],
#                 "slug": slugify(sub["name"]),
#                 "category_id": parent["_id"]
#             })

#     # ✅ Insert Items under Shop subcategories
#     for item in items:
#         parent_sub = mongo.db.subcategories.find_one({"name": item["subcategory_name"]})
#         if parent_sub and not mongo.db.items.find_one({"name": item["name"], "subcategory_id": parent_sub["_id"]}):
#             mongo.db.items.insert_one({
#                 "name": item["name"],
#                 "slug": slugify(item["name"]),
#                 "subcategory_id": parent_sub["_id"],
#                 "category_id": parent_sub["category_id"]
#             })

#     # ✅ Insert Recipes subcategories (constant)
#     for sub in recipe_subcategories:
#         parent = mongo.db.categories.find_one({"name": sub["category_name"]})
#         if parent and not mongo.db.subcategories.find_one({"name": sub["name"], "category_id": parent["_id"]}):
#             mongo.db.subcategories.insert_one({
#                 "name": sub["name"],
#                 "slug": slugify(sub["name"]),
#                 "category_id": parent["_id"]
#             })

#     print("✅ Seeding complete: Shop + Recipes structure created!")

# if __name__ == "__main__":
#     with app.app_context():
#         seed_data()
#     app.run(debug=True)
from flask import Flask
from flask_pymongo import PyMongo
import re
import unicodedata

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myshop"
mongo = PyMongo(app)

# ---------------- Slugify ----------------
def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

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

    # --- Recipes Items (no subcategories) ---
    recipe_items = [
        {"name": "Quick & Easy"},
        {"name": "Healthy Choices"},
        {"name": "Breakfast Ideas"},
        {"name": "Lunch & Dinner"},
        {"name": "Desserts & Drinks"},
        
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

    # ---------------- Insert Recipe Items (no subcategories) ----------------
# inside your seeder
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

# ---------------- Run Seeder ----------------
if __name__ == "__main__":
    with app.app_context():
        seed_data()
    app.run(debug=True)
