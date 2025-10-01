from flask import Blueprint, jsonify, current_app
from bson.objectid import ObjectId

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/admin")

# ---------------- Dashboard Stats ----------------
@dashboard_bp.route("/dashboard-stats", methods=["GET"])
def dashboard_stats():
    db = current_app.db
    try:
        total_orders = db.orders.count_documents({})

        revenue = 0
        for o in db.orders.find({}):
            total = o.get("total") or o.get("order_total") or None
            if total is not None:
                try:
                    revenue += float(total)
                except:
                    pass
            else:
                # calculate from items
                for item in o.get("items", []):
                    price = float(item.get("price", 0))
                    qty = int(item.get("quantity", 1))
                    revenue += price * qty

        active_users = len(db.orders.distinct("user_id"))

        # safer low stock check
        product_sample = db.products.find_one({})
        if product_sample and "stock" in product_sample:
            low_stock_items = db.products.count_documents({"stock": {"$lt": 5}})
        else:
            low_stock_items = db.products.count_documents({"quantity": {"$lt": 5}})

        return jsonify({
            "totalOrders": total_orders,
            "revenue": revenue,
            "activeUsers": active_users,
            "lowStockItems": low_stock_items
        })

    except Exception as e:
        print("Dashboard stats error:", e)
        return jsonify({"error": "Failed to fetch stats"}), 500



# ---------------- Latest Orders ----------------
@dashboard_bp.route("/latest-orders", methods=["GET"])
def latest_orders():
    db = current_app.db
    try:
        latest = list(
            db.orders.find({}, {"delivery_address.name": 1, "total": 1, "status": 1})
            .sort("created_at", -1)
            .limit(10)
        )
        for order in latest:
            order["_id"] = str(order["_id"])
            order["customer_name"] = order.get("delivery_address", {}).get("name", "Unknown")
            if "total" not in order:
                order["total"] = sum(
                    float(item.get("price", 0)) * int(item.get("quantity", 1))
                    for item in order.get("items", [])
                )
        return jsonify(latest)
    except Exception as e:
        print("Latest orders error:", e)
        return jsonify({"error": "Failed to fetch latest orders"}), 500
