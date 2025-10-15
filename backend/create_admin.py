from flask import Flask
from extensions import mongo
from models.user_model import create_admin_user
import os
from dotenv import load_dotenv

# ----------------- Load environment variables -----------------
load_dotenv()

app = Flask(__name__)

# Read Mongo URI from .env file (safer than hardcoding)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

# ----------------- Initialize Mongo -----------------
mongo.init_app(app)

# ----------------- Run inside app context -----------------
with app.app_context():
    result = create_admin_user("admin@example.com", "admin123")
    if result:
        print("✅ Admin created successfully!")
    else:
        print("ℹ️ Admin already exists.")
