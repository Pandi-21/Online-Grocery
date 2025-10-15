from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user_model import create_user, find_user_by_email, check_user_password,get_admin_by_email, verify_password

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if find_user_by_email(data["email"]):
        return jsonify({"error": "Email already exists"}), 400
    create_user(data)
    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = find_user_by_email(data["email"])
    if not user or not check_user_password(user, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_access_token(identity=str(user["_id"]))
    return jsonify({"token": token, "user": {"name": user["name"], "email": user["email"]}})



@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    admin = get_admin_by_email(email)
    if not admin or not verify_password(admin["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(admin["_id"]))
    return jsonify({"token": access_token, "email": admin["email"]}), 200
