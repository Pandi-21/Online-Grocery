from flask import current_app, request
from bson.objectid import ObjectId
import datetime
from utils.helpers import safe_float, safe_int, to_object_id
from utils.response_helper import success_response, error_response

# ---------------- Create Order ----------------
def create_order():
    db = current_app.db
    data = request.json

    user_id = data.get("user_id")
    items = data.get("items", [])

    if not user_id:
        return error_response("Missing user_id", 400)
    if not items:
        return error_response("Cart is empty or missing items", 400)

    user_obj_id = to_object_id(user_id)
    if not user_obj_id:
        return error_response("Invalid user_id", 400)

    delivery_address = {k: data.get("delivery_address", {}).get(k, "") for k in
                        ["name", "address", "city", "state", "zip", "phone"]}

    order_items = []
    for item in items:
        product_id = item.get("product_id")
        if not product_id:
            continue
        product_obj = to_object_id(product_id)
        product = db.products.find_one({"_id": product_obj}) if product_obj else None

        order_items.append({
            "product_id": product_obj,
            "product_name": product.get("name") if product else "Unknown Product",
            "price": safe_float(item.get("price", 0)),
            "quantity": max(1, safe_int(item.get("quantity", 1)))
        })

    total = sum(i["price"] * i["quantity"] for i in order_items)

    order_doc = {
        "user_id": user_obj_id,
        "items": order_items,
        "delivery_address": delivery_address,
        "payment_method": data.get("payment_method", "online"),
        "status": "pending",
        "total": total,
        "created_at": datetime.datetime.utcnow()
    }

    try:
        result = db.orders.insert_one(order_doc)
        return success_response("Order placed successfully", {
            "order_id": str(result.inserted_id),
            "total": total
        }, 201)
    except Exception as e:
        print("Error creating order:", e)
        return error_response("Failed to create order", 500)


# ---------------- Get All Orders (Admin) ----------------
def get_all_orders():
    db = current_app.db
    try:
        orders = []
        for o in db.orders.find().sort("created_at", -1):
            o["_id"] = str(o["_id"])
            o["user_id"] = str(o["user_id"]) if isinstance(o.get("user_id"), ObjectId) else o.get("user_id")
            if "created_at" in o and isinstance(o["created_at"], datetime.datetime):
                o["created_at"] = o["created_at"].isoformat()
            o["delivery_address"] = o.get("delivery_address", {k:"" for k in ["name","address","city","state","zip","phone"]})
            orders.append(o)
        return success_response("Orders fetched", {"orders": orders})
    except Exception as e:
        print("Error fetching orders:", e)
        return error_response("Failed to fetch orders", 500)


# ---------------- Get Orders by User ----------------
def get_user_orders(user_id):
    db = current_app.db
    user_obj_id = to_object_id(user_id)
    if not user_obj_id:
        return error_response("Invalid user_id", 400)
    try:
        orders = list(db.orders.find({"user_id": user_obj_id}).sort("created_at", -1))
        for o in orders:
            o["_id"] = str(o["_id"])
            o["user_id"] = str(o["user_id"])
            if "created_at" in o and isinstance(o["created_at"], datetime.datetime):
                o["created_at"] = o["created_at"].isoformat()
        return success_response("User orders fetched", {"orders": orders})
    except Exception as e:
        print("Error fetching user orders:", e)
        return error_response("Failed to fetch orders", 500)


# ---------------- Get Single Order ----------------
def get_order(order_id):
    db = current_app.db
    order_obj_id = to_object_id(order_id)
    if not order_obj_id:
        return error_response("Invalid order_id", 400)
    try:
        order = db.orders.find_one({"_id": order_obj_id})
        if not order:
            return error_response("Order not found", 404)

        order["_id"] = str(order["_id"])
        order["user_id"] = str(order["user_id"])
        if "created_at" in order and isinstance(order["created_at"], datetime.datetime):
            order["created_at"] = order["created_at"].isoformat()

        for item in order.get("items", []):
            if "product_id" in item and isinstance(item["product_id"], ObjectId):
                item["product_id"] = str(item["product_id"])
        return success_response("Order fetched", {"order": order})
    except Exception as e:
        print("Error fetching order:", e)
        return error_response("Failed to fetch order", 500)


# ---------------- Update Order Status ----------------
def update_order_status(order_id):
    db = current_app.db
    new_status = request.json.get("status")
    if not new_status:
        return error_response("Status is required", 400)

    order_obj_id = to_object_id(order_id)
    if not order_obj_id:
        return error_response("Invalid order_id", 400)

    try:
        result = db.orders.update_one({"_id": order_obj_id}, {"$set": {"status": new_status}})
        if result.matched_count == 0:
            return error_response("Order not found", 404)
        return success_response("Status updated", {"status": new_status})
    except Exception as e:
        print("Error updating order status:", e)
        return error_response("Failed to update status", 500)
