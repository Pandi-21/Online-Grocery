from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import MONGO_URI

# Import Blueprints
from routes.categories import categories_bp
from routes.subcategories import subcategories_bp
from routes.items import items_bp
from routes.products import products_bp

app = Flask(__name__)
CORS(app)

# ✅ Setup MongoDB with Flask-PyMongo
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# ✅ Attach mongo to app context so blueprints can use it
app.mongo = mongo
app.db = mongo.db   # <-- shortcut: use app.db to access collections

# ✅ Register Blueprints
app.register_blueprint(categories_bp)
app.register_blueprint(subcategories_bp)
app.register_blueprint(items_bp)
app.register_blueprint(products_bp)

@app.route("/")
def home():
    return {"message": "🚀 Backend running with Flask & MongoDB!"}

if __name__ == "__main__":
    app.run(debug=True)
