# backend/services/recipes_seed.py
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

def seed_recipes():
    """Seed Recipes category and subcategories"""
    # --- Category ---
    if not mongo.db.categories.find_one({"name": "Recipes"}):
        recipes_cat_id = mongo.db.categories.insert_one({
            "name": "Recipes",
            "slug": slugify("Recipes")
        }).inserted_id
    else:
        recipes_cat_id = mongo.db.categories.find_one({"name": "Recipes"})["_id"]

    # --- Recipe Subcategories ---
    subcategories = [
        "Quick & Easy",
        "Healthy Choices",
        "Breakfast Ideas",
        "Lunch & Dinner",
        "Desserts & Drinks"
    ]
    for name in subcategories:
        if not mongo.db.subcategories.find_one({"name": name, "category_id": recipes_cat_id}):
            mongo.db.subcategories.insert_one({
                "name": name,
                "slug": slugify(name),
                "category_id": recipes_cat_id
            })

    print("✅ Recipes seed complete!")

if __name__ == "__main__":
    with app.app_context():
        seed_recipes()
