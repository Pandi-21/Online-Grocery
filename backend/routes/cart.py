# from flask import Blueprint, request, jsonify, current_app
# from bson.objectid import ObjectId

# cart_bp = Blueprint("cart", __name__, url_prefix="/cart")

# # ---------------- Add to Cart ----------------
# @cart_bp.route("/add", methods=["POST"])
# def add_to_cart():
#     db = current_app.db
#     data = request.json

#     user_id = data.get("user_id")
#     product_id = data.get("product_id")
#     quantity = int(data.get("quantity", 1))

#     if not user_id or not product_id:
#         return jsonify({"error": "Missing user_id or product_id"}), 400

#     # Fetch product details
#     try:
#         product = db.products.find_one({"_id": ObjectId(product_id)})
#     except Exception:
#         return jsonify({"error": "Invalid product_id format"}), 400

#     if not product:
#         return jsonify({"error": "Product not found"}), 404

#     # Check if item already in cart
#     cart_item = db.cart.find_one({"user_id": str(user_id), "product_id": str(product_id)})

#     if cart_item:
#         # Increase quantity
#         db.cart.update_one(
#             {"_id": cart_item["_id"]},
#             {"$inc": {"quantity": quantity}}
#         )
#         return jsonify({"message": "Cart updated"}), 200
#     else:
#         # Insert new cart item
#         res = db.cart.insert_one({
#             "user_id": str(user_id),
#             "product_id": str(product_id),
#             "quantity": quantity,
#             "product_name": product.get("name"),
#             "product_price": product.get("price", 0),
#             "images": product.get("images", [])
#         })
#         return jsonify({
#             "message": "Product added to cart",
#             "inserted_id": str(res.inserted_id)
#         }), 200

# # ---------------- Get Cart Items ----------------
# @cart_bp.route("/<user_id>", methods=["GET"])
# def get_cart(user_id):
#     db = current_app.db
#     cart_items = list(db.cart.find({"user_id": str(user_id)}))
#     for item in cart_items:
#         item["_id"] = str(item["_id"])
#     return jsonify({"cartItems": cart_items}), 200

# # ---------------- Update Cart Quantity ----------------
# @cart_bp.route("/update", methods=["POST"])
# def update_cart():
#     db = current_app.db
#     data = request.json
#     cart_id = data.get("cart_id")
#     quantity = data.get("quantity")

#     if not cart_id or quantity is None:
#         return jsonify({"error": "Missing cart_id or quantity"}), 400

#     try:
#         db.cart.update_one(
#             {"_id": ObjectId(cart_id)},
#             {"$set": {"quantity": int(quantity)}}
#         )
#     except Exception:
#         return jsonify({"error": "Invalid cart_id format"}), 400

#     return jsonify({"message": "Cart updated"}), 200

# # ---------------- Remove from Cart ----------------
# @cart_bp.route("/remove", methods=["POST"])
# def remove_from_cart():
#     db = current_app.db
#     data = request.json
#     cart_id = data.get("cart_id")

#     if not cart_id:
#         return jsonify({"error": "Missing cart_id"}), 400

#     try:
#         db.cart.delete_one({"_id": ObjectId(cart_id)})
#     except Exception:
#         return jsonify({"error": "Invalid cart_id format"}), 400

#     return jsonify({"message": "Item removed from cart"}), 200


# # ---------------- Clear Cart ----------------
# @cart_bp.route("/clear", methods=["POST"])
# def clear_cart():
#     db = current_app.db
#     data = request.json
#     user_id = data.get("user_id")

#     if not user_id:
#         return jsonify({"error": "Missing user_id"}), 400

#     try:
#         db.cart.delete_many({"user_id": str(user_id)})
#     except Exception as e:
#         return jsonify({"error": "Could not clear cart", "details": str(e)}), 500

#     return jsonify({"message": "Cart cleared"}), 200
from flask import Blueprint
from controllers.cart_controller import (
    add_to_cart,
    get_cart,
    update_cart,
    remove_from_cart,
    clear_cart
)

cart_bp = Blueprint("cart", __name__, url_prefix="/cart")

# Add product to cart
cart_bp.route("/add", methods=["POST"])(add_to_cart)

# Get cart items for a user
cart_bp.route("/<user_id>", methods=["GET"])(get_cart)

# Update quantity of a cart item
cart_bp.route("/update/<cart_id>", methods=["PUT"])(update_cart)

# Remove a single cart item
cart_bp.route("/remove/<cart_id>", methods=["DELETE"])(remove_from_cart)

# Clear all items in a user's cart
cart_bp.route("/clear/<user_id>", methods=["DELETE"])(clear_cart)
