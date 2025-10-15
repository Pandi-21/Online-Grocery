from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import Config
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
from routes.users import user_bp
from routes.auth import auth_bp
from routes.mail_routes import mail_bp
from routes.sms_routes import sms_bp

from extensions import mail, jwt, mongo

# -----------------------------
# Initialize Flask App
# -----------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Config
# -----------------------------
app.config.from_object(Config)

# Debug: confirm Mongo URI is loaded
print("MONGO_URI =", app.config.get("MONGO_URI"))

# -----------------------------
# MongoDB
# -----------------------------
mongo.init_app(app)
app.mongo = mongo
app.db = mongo.db

# -----------------------------
# Extensions
# -----------------------------
mail.init_app(app)
jwt.init_app(app)

# -----------------------------
# Uploads folder
# -----------------------------
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -----------------------------
# Register Blueprints
# -----------------------------
app.register_blueprint(categories_bp)
app.register_blueprint(subcategories_bp)
app.register_blueprint(items_bp)
app.register_blueprint(products_bp)
app.register_blueprint(recipes_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(dashboard_bp)

# Auth / User
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/user")

# Mail & SMS
app.register_blueprint(mail_bp, url_prefix="/user")
app.register_blueprint(sms_bp, url_prefix="/user")

# -----------------------------
# Serve uploaded files
# -----------------------------
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# -----------------------------
# Test route
# -----------------------------
@app.route("/")
def home():
    return {"message": "Backend running with Flask & MongoDB!"}

# -----------------------------
# Run the app
# -----------------------------
if __name__ == "__main__":
    # Debug mode ON for EC2 initial setup
    app.run(host="0.0.0.0", port=5000, debug=True)
