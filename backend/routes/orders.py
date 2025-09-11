from flask import Blueprint, request, jsonify
from db import db

orders_bp = Blueprint("orders", __name__)

@orders_bp.route("/", methods=["GET"])
def get_orders():
    orders = list(db.orders.find())
    for o in orders:
        o["_id"] = str(o["_id"])
    return jsonify(orders)

@orders_bp.route("/", methods=["POST"])
def add_order():
    data = request.json
    result = db.orders.insert_one(data)
    return jsonify({"message": "Order created", "id": str(result.inserted_id)})

@orders_bp.route("/<id>", methods=["PUT"])
def update_order(id):
    data = request.json
    db.orders.update_one({"_id": id}, {"$set": data})
    return jsonify({"message": "Order updated"})    

@orders_bp.route("/<id>", methods=["DELETE"])
def delete_order(id):
    db.orders.delete_one({"_id": id})
    return jsonify({"message": "Order deleted"})

