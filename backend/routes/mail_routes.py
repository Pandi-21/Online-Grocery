from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from bson import ObjectId
from extensions import mongo, mail

mail_bp = Blueprint("mail", __name__)

@mail_bp.route("/send-email", methods=["POST"])
@jwt_required()
def send_email():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        msg = Message(
            subject="Welcome!",
            sender="kpandiyarajan59@gmail.com",  # Must match MAIL_USERNAME
            recipients=[user["email"]],
            body=f"Hello {user['name']}, welcome to our store!"
        )
        mail.send(msg)
        return jsonify({"message": f"Email sent to {user['email']}!"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500
