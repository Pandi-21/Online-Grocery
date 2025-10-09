from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from bson.errors import InvalidId
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

user_bp = Blueprint("user", __name__, url_prefix="/user")
SECRET_KEY = "your_secret_key_here"  # Replace with env var in production

# ---------------- SIGNUP ----------------
@user_bp.route("/signup", methods=["POST"])
def signup():
    db = current_app.db
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)
    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.datetime.utcnow()
    }

    result = db.users.insert_one(user)
    user["_id"] = str(result.inserted_id)
    del user["password"]

    token = jwt.encode(
        {"user_id": user["_id"], "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"user": user, "token": token})


# ---------------- LOGIN ----------------
@user_bp.route("/login", methods=["POST"])
def login():
    db = current_app.db
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    user["_id"] = str(user["_id"])
    del user["password"]

    token = jwt.encode(
        {"user_id": user["_id"], "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"user": user, "token": token})


# ---------------- GET USER ----------------
@user_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    db = current_app.db
    try:
        obj_id = ObjectId(user_id)
    except InvalidId:
        return jsonify({"error": "Invalid user ID"}), 400

    user = db.users.find_one({"_id": obj_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user["_id"] = str(user["_id"])
    del user["password"]
    return jsonify(user)


# ---------------- UPDATE USER ----------------
@user_bp.route("/update/<user_id>", methods=["PUT"])
def update_user(user_id):
    db = current_app.db
    try:
        obj_id = ObjectId(user_id)
    except InvalidId:
        return jsonify({"error": "Invalid user ID"}), 400

    data = request.json or {}
    if "password" in data:
        data["password"] = generate_password_hash(data["password"])

    result = db.users.update_one({"_id": obj_id}, {"$set": data})

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User updated successfully"})
