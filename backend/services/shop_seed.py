# backend/services/shop_seed.py
from flask import Flask
from flask_pymongo import PyMongo
import re, unicodedata

app = Flask(__name__)
app.config["MONGO_URI"] = "os.getenv("MONGO_URI")"
mongo = PyMongo(app)

def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def seed_shop():
    """Seed Shop category, subcategories, and items"""
    # --- Category ---
    if not mongo.db.categories.find_one({"name": "Shop"}):
        shop_cat_id = mongo.db.categories.insert_one({
            "name": "Shop",
            "slug": slugify("Shop")
        }).inserted_id
    else:
        shop_cat_id = mongo.db.categories.find_one({"name": "Shop"})["_id"]

    # --- Subcategories ---
    subcategories = [
        "Fruits & Vegetables",
        "Dairy & Bakery",
        "Grocery & Staples",
        "Snacks & Beverages",
    ]
    for name in subcategories:
    existing = mongo.db.subcategories.find_one({"name": name, "category_id": shop_cat_id})
    if not existing:
        mongo.db.subcategories.insert_one({
            "name": name,
            "slug": slugify(name),
            "category_id": shop_cat_id
        })


    # --- Items ---
    items = [
        {"subcategory": "Fruits & Vegetables", "names": [
            "Fresh Fruits", "Fresh Vegetables", "Organic Produce", "Exotic Fruits", "Seasonal Picks"
        ]},
        {"subcategory": "Dairy & Bakery", "names": [
            "Milk, Curd & Paneer", "Cheese & Butter", "Eggs", "Breads & Buns", "Cakes & Pastries"
        ]}
    ]

    for block in items:
        sub = mongo.db.subcategories.find_one({"name": block["subcategory"], "category_id": shop_cat_id})
        if sub:
            for name in block["names"]:
                if not mongo.db.items.find_one({"name": name, "subcategory_id": sub["_id"]}):
                    mongo.db.items.insert_one({
                        "name": name,
                        "slug": slugify(name),
                        "subcategory_id": sub["_id"],
                        "category_id": shop_cat_id
                    })

    print("✅ Shop seed complete!")

if __name__ == "__main__":
    with app.app_context():
        seed_shop()
