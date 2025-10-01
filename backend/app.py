from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import MONGO_URI
import os

# Import Blueprints
from routes.categories import categories_bp
from routes.subcategories import subcategories_bp
from routes.items import items_bp
from routes.products import products_bp
from routes.recipes import recipes_bp
from routes.cart import cart_bp
from routes.orders import orders_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)
CORS(app)

# ✅ MongoDB Config
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# ✅ Shortcut DB instance
app.mongo = mongo
app.db = mongo.db

# ✅ Uploads folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Register Blueprints
app.register_blueprint(categories_bp)
app.register_blueprint(subcategories_bp)
app.register_blueprint(items_bp)
app.register_blueprint(products_bp)
app.register_blueprint(recipes_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(dashboard_bp)
# ✅ Serve uploaded files
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/")
def home():
    return {"message": "Backend running with Flask & MongoDB!"}

if __name__ == "__main__":
    app.run(debug=True)
