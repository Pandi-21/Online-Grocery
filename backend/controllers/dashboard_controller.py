from flask import current_app
from utils.response_helper import success_response, error_response
from utils.helpers import safe_float, safe_int
from datetime import datetime, timedelta

def dashboard_stats():
    db = current_app.db
    try:
        total_orders = db.orders.count_documents({})

        # Total revenue calculation
        revenue = 0
        for o in db.orders.find({}):
            total = o.get("total") or o.get("order_total")
            if total is not None:
                revenue += safe_float(total)
            else:
                for item in o.get("items", []):
                    price = safe_float(item.get("price", 0))
                    qty = safe_int(item.get("quantity", 1))
                    revenue += price * qty

        # Active users in last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_users = len(
            db.orders.distinct("user_id", {"created_at": {"$gte": thirty_days_ago}})
        )

        # Low stock items
        product_sample = db.products.find_one({})
        stock_field = "stock" if product_sample and "stock" in product_sample else "quantity"
        low_stock_items = db.products.count_documents({stock_field: {"$lt": 5}})

        return success_response("Dashboard stats fetched", {
            "totalOrders": total_orders,
            "revenue": revenue,
            "activeUsers": active_users,
            "lowStockItems": low_stock_items
        })

    except Exception as e:
        print("Dashboard stats error:", e)
        return error_response("Failed to fetch stats", 500)


def latest_orders():
    db = current_app.db
    try:
        orders = list(
            db.orders.find(
                {}, 
                {"delivery_address.name": 1, "total": 1, "status": 1, "items": 1, "created_at":1}
            )
            .sort("created_at", -1)
            .limit(10)
        )

        for order in orders:
            order["_id"] = str(order["_id"])
            order["customer_name"] = order.get("delivery_address", {}).get("name", "Unknown")
            if "total" not in order or order["total"] is None:
                order["total"] = sum(
                    safe_float(item.get("price", 0)) * safe_int(item.get("quantity", 1))
                    for item in order.get("items", [])
                )

        return success_response("Latest orders fetched", {"orders": orders})

    except Exception as e:
        print("Latest orders error:", e)
        return error_response("Failed to fetch latest orders", 500)
