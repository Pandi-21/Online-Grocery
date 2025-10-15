# backend/services/all_seed.py

from flask import Flask
from flask_pymongo import PyMongo

# --- Import seed functions from the same folder ---
from shop_seed import seed_shop
from recipes_seed import seed_recipes

# --- Flask app setup ---
app = Flask(__name__)
app.config["MONGO_URI"] = "os.getenv("MONGO_URI")"
mongo = PyMongo(app)

# --- Run both seeds ---
if __name__ == "__main__":
    with app.app_context():
        seed_shop()
        seed_recipes()
        print("✅ All seeds complete!")
