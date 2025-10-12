# from flask import Blueprint, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from bson import ObjectId
# from twilio.rest import Client
# from extensions import mongo
# from config import Config

# sms_bp = Blueprint("sms", __name__)

# client = Client(Config.TWILIO_SID, Config.TWILIO_AUTH_TOKEN)

# @sms_bp.route("/send-sms", methods=["POST"])
# @jwt_required()
# def send_sms():
#     user_id = get_jwt_identity()
#     try:
#         user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
#     except Exception:
#         return jsonify({"error": "Invalid user ID"}), 422

#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     if not user.get("phone"):
#         return jsonify({"error": "Phone number is missing"}), 422

#     try:
#         message = client.messages.create(
#             body=f"Hi {user['name']}, your order has been confirmed!",
#             from_=Config.TWILIO_PHONE,
#             to=user["phone"]
#         )
#         return jsonify({"message": "SMS sent successfully!", "sid": message.sid}), 200
#     except Exception as e:
#         print("Twilio error:", e)
#         return jsonify({"error": str(e)}), 422
# routes/sms_routes.py



from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from twilio.rest import Client
from extensions import mongo
from config import Config

sms_bp = Blueprint("sms", __name__)

client = Client(Config.TWILIO_SID, Config.TWILIO_AUTH_TOKEN)

@sms_bp.route("/send-sms", methods=["POST"])
@jwt_required()
def send_sms():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    phone = user.get("phone")
    if not phone or not phone.startswith("+"):
        return jsonify({"error": "Phone number missing or invalid"}), 422

    try:
        message = client.messages.create(
            body=f"Hi {user.get('name', 'User')}, your order has been confirmed!",
            from_=Config.TWILIO_PHONE,
            to=phone
        )
        return jsonify({"message": "SMS sent successfully!", "sid": message.sid}), 200
    except Exception as e:
        return jsonify({"error": f"Twilio error: {str(e)}"}), 500
