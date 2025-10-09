# # src/backend/orders.py
# from flask import Blueprint, request, jsonify, current_app
# from bson.objectid import ObjectId
# import datetime

# orders_bp = Blueprint("orders", __name__, url_prefix="/orders")

# # ---------------- Create Order ----------------
# # ---------------- Create Order ----------------
# @orders_bp.route("/create", methods=["POST"])
# def create_order():
#     db = current_app.db
#     data = request.json

#     if not data.get("user_id"):
#         return jsonify({"error": "Missing user_id"}), 400
#     if not data.get("items") or len(data["items"]) == 0:
#         return jsonify({"error": "Cart is empty or missing items"}), 400

#     user_id = data["user_id"]
#     try:
#         user_obj_id = ObjectId(user_id) if isinstance(user_id, str) and len(user_id) == 24 else user_id
#     except Exception:
#         return jsonify({"error": f"Invalid user_id: {user_id}"}), 400

#     delivery_address = {
#         "name": data.get("delivery_address", {}).get("name", ""),
#         "address": data.get("delivery_address", {}).get("address", ""),
#         "city": data.get("delivery_address", {}).get("city", ""),
#         "state": data.get("delivery_address", {}).get("state", ""),
#         "zip": data.get("delivery_address", {}).get("zip", ""),
#         "phone": data.get("delivery_address", {}).get("phone", ""),
#     }

#     # Enrich each item with product name
#     order_items = []
#     for item in data["items"]:
#         product_id = item.get("product_id")
#         try:
#             product = db.products.find_one({"_id": ObjectId(product_id)})
#         except Exception:
#             product = None

#         order_items.append({
#             "product_id": ObjectId(product_id) if product_id and len(product_id) == 24 else product_id,
#             "product_name": product.get("product_name") if product else "Unknown Product",
#             "price": float(item.get("price", 0)),
#             "quantity": int(item.get("quantity", 1)),
#         })

#     total = sum(i["price"] * i["quantity"] for i in order_items)

#     order = {
#         "user_id": user_obj_id,
#         "items": order_items,  # ✅ enriched with product name
#         "delivery_address": delivery_address,
#         "payment_method": data.get("payment_method", "online"),
#         "status": "pending",
#         "total": total,
#         "created_at": datetime.datetime.utcnow(),
#     }

#     try:
#         result = db.orders.insert_one(order)
#         return jsonify({
#             "message": "Order placed successfully",
#             "order_id": str(result.inserted_id),
#             "total": total
#         }), 201
#     except Exception as e:
#         print("Error creating order:", e)
#         return jsonify({"error": "Failed to create order"}), 500


# # ---------------- Get All Orders (Admin) ----------------
# @orders_bp.route("/all", methods=["GET"])
# def get_all_orders():
#     db = current_app.db
#     orders = []
#     try:
#         for o in db.orders.find().sort("created_at", -1):
#             o["_id"] = str(o["_id"])
#             o["user_id"] = str(o["user_id"]) if isinstance(o.get("user_id"), ObjectId) else o.get("user_id")
#             if "created_at" in o and isinstance(o["created_at"], datetime.datetime):
#                 o["created_at"] = o["created_at"].isoformat()
#             if "delivery_address" not in o:
#                 o["delivery_address"] = {"name": "", "address": "", "city": "", "state": "", "zip": "", "phone": ""}
#             orders.append(o)
#         return jsonify(orders)
#     except Exception as e:
#         print("Error fetching orders:", e)
#         return jsonify({"error": "Failed to fetch orders"}), 500

# # ---------------- Get Orders by User ----------------
# @orders_bp.route("/user/<user_id>", methods=["GET"])
# def get_user_orders(user_id):
#     db = current_app.db
#     try:
#         orders = list(db.orders.find({"user_id": ObjectId(user_id)}).sort("created_at", -1))
#         for order in orders:
#             order["_id"] = str(order["_id"])
#             order["user_id"] = str(order["user_id"]) if isinstance(order.get("user_id"), ObjectId) else order.get("user_id")
#             if "created_at" in order and isinstance(order["created_at"], datetime.datetime):
#                 order["created_at"] = order["created_at"].isoformat()
#         return jsonify(orders)
#     except Exception as e:
#         print("Error fetching user orders:", e)
#         return jsonify({"error": "Failed to fetch orders"}), 500

# # ---------------- Get Single Order by ID ----------------
# @orders_bp.route("/<order_id>", methods=["GET"])
# def get_order(order_id):
#     db = current_app.db
#     try:
#         order = db.orders.find_one({"_id": ObjectId(order_id)})
#         if not order:
#             return jsonify({"error": "Order not found"}), 404

#         order["_id"] = str(order["_id"])
#         order["user_id"] = str(order["user_id"]) if isinstance(order.get("user_id"), ObjectId) else order.get("user_id")
#         if "created_at" in order and isinstance(order["created_at"], datetime.datetime):
#             order["created_at"] = order["created_at"].isoformat()

#         for item in order.get("items", []):
#             if "product_id" in item and isinstance(item["product_id"], ObjectId):
#                 item["product_id"] = str(item["product_id"])

#         return jsonify(order)
#     except Exception as e:
#         print("Error fetching order:", e)
#         return jsonify({"error": "Failed to fetch order"}), 500

# # ---------------- Update Order Status ----------------
# @orders_bp.route("/<order_id>/status", methods=["PUT"])
# def update_order_status(order_id):
#     db = current_app.db
#     new_status = request.json.get("status")
#     if not new_status:
#         return jsonify({"error": "Status is required"}), 400
#     try:
#         result = db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": new_status}})
#         if result.matched_count == 0:
#             return jsonify({"error": "Order not found"}), 404
#         return jsonify({"message": "Status updated", "status": new_status})
#     except Exception as e:
#         print("Error updating order status:", e)
#         return jsonify({"error": "Failed to update status"}), 500
from flask import Blueprint
from controllers.orders_controller import (
    create_order,
    get_all_orders,
    get_user_orders,
    get_order,
    update_order_status
)

orders_bp = Blueprint("orders", __name__, url_prefix="/orders")

orders_bp.route("/create", methods=["POST"])(create_order)
orders_bp.route("/all", methods=["GET"])(get_all_orders)
orders_bp.route("/user/<user_id>", methods=["GET"])(get_user_orders)
orders_bp.route("/<order_id>", methods=["GET"])(get_order)
orders_bp.route("/<order_id>/status", methods=["PUT"])(update_order_status)
