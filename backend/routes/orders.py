from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
import datetime

orders_bp = Blueprint("orders", __name__, url_prefix="/orders")

# ---------------- Create Order ----------------
# ---------------- Create Order ----------------
@orders_bp.route("/create", methods=["POST"])
def create_order():
    db = current_app.db
    data = request.json

    if not data.get("user_id"):
        return jsonify({"error": "Missing user_id"}), 400
    if not data.get("items") or len(data["items"]) == 0:
        return jsonify({"error": "Cart is empty or missing items"}), 400

    user_id = data["user_id"]
    try:
        if isinstance(user_id, str) and len(user_id) == 24:
            user_obj_id = ObjectId(user_id)
        else:
            user_obj_id = user_id
    except Exception:
        return jsonify({"error": f"Invalid user_id: {user_id}"}), 400

    # prepare delivery address
    delivery_address = {
        "name": data.get("delivery_address", {}).get("name", ""),
        "address": data.get("delivery_address", {}).get("address", ""),
        "city": data.get("delivery_address", {}).get("city", ""),
        "state": data.get("delivery_address", {}).get("state", ""),
        "zip": data.get("delivery_address", {}).get("zip", ""),
        "phone": data.get("delivery_address", {}).get("phone", ""),
    }

    # ✅ Calculate order total
    total = sum(
        float(item.get("price", 0)) * int(item.get("quantity", 1))
        for item in data.get("items", [])
    )

    order = {
        "user_id": user_obj_id,
        "items": data["items"],
        "delivery_address": delivery_address,
        "payment_method": data.get("payment_method", "online"),
        "status": "pending",
        "total": total,   # ✅ save total
        "created_at": datetime.datetime.utcnow(),
    }

    try:
        result = db.orders.insert_one(order)
        return jsonify({
            "message": "Order placed successfully",
            "order_id": str(result.inserted_id),
            "total": total
        }), 201
    except Exception as e:
        print("Error creating order:", e)
        return jsonify({"error": "Failed to create order"}), 500



# ---------------- Get All Orders (Admin) ----------------
@orders_bp.route("/all", methods=["GET"])
def get_all_orders():
    db = current_app.db
    orders = []
    try:
        for o in db.orders.find().sort("created_at", -1):
            o["_id"] = str(o["_id"])
            if isinstance(o.get("user_id"), ObjectId):
                o["user_id"] = str(o["user_id"])
            if "created_at" in o and isinstance(o["created_at"], datetime.datetime):
                o["created_at"] = o["created_at"].isoformat()
            if "delivery_address" not in o:
                o["delivery_address"] = {
                    "name": "", "address": "", "city": "", "state": "", "zip": "", "phone": ""
                }
            orders.append(o)
        return jsonify(orders)
    except Exception as e:
        print("Error fetching orders:", e)
        return jsonify({"error": "Failed to fetch orders"}), 500


# ---------------- Get Single Order by ID ----------------
@orders_bp.route("/<order_id>", methods=["GET"])
def get_order(order_id):
    db = current_app.db
    try:
        order = db.orders.find_one({"_id": ObjectId(order_id)})
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order["_id"] = str(order["_id"])
        if isinstance(order.get("user_id"), ObjectId):
            order["user_id"] = str(order["user_id"])
        if "created_at" in order and isinstance(order["created_at"], datetime.datetime):
            order["created_at"] = order["created_at"].isoformat()

        # convert product_id inside items if present
        for item in order.get("items", []):
            if "product_id" in item and isinstance(item["product_id"], ObjectId):
                item["product_id"] = str(item["product_id"])

        return jsonify(order)
    except Exception as e:
        print("Error fetching order:", e)
        return jsonify({"error": "Failed to fetch order"}), 500


# ---------------- Update Order Status ----------------
@orders_bp.route("/<order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    db = current_app.db
    data = request.json
    new_status = data.get("status")

    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    try:
        result = db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": new_status}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Order not found"}), 404

        return jsonify({"message": "Status updated", "status": new_status})
    except Exception as e:
        print("Error updating order status:", e)
        return jsonify({"error": "Failed to update status"}), 500
