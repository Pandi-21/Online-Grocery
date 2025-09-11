from flask import Blueprint, request, jsonify
from db import db

coupons_bp = Blueprint("coupons", __name__)

@coupons_bp.route("/", methods=["GET"])
def get_coupons():
    coupons = list(db.coupons.find())
    for c in coupons:
        c["_id"] = str(c["_id"])
    return jsonify(coupons)

@coupons_bp.route("/", methods=["POST"])
def add_coupon():
    data = request.json
    result = db.coupons.insert_one(data)
    return jsonify({"message": "Coupon added", "id": str(result.inserted_id)})


@coupons_bp.route("/<id>", methods=["PUT"])
def update_coupon(id):
    data = request.json
    db.coupons.update_one({"_id": id
}, {"$set": data})
    return jsonify({"message": "Coupon updated"})

@coupons_bp.route("/<id>", methods=["DELETE"])
def delete_coupon(id):
    db.coupons.delete_one({"_id": id})
    return jsonify({"message": "Coupon deleted"})       
    
    