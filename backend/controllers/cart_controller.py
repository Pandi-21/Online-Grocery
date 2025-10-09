# # from flask import current_app, request
# from utils.response_helper import success_response, error_response
# from utils.objectid_helper import to_object_id

# # ---------------- Add to Cart ----------------
# def add_to_cart():
#     db = current_app.db
#     data = request.json
#     user_id = data.get("user_id")
#     product_id = data.get("product_id")
#     quantity = max(1, int(data.get("quantity", 1)))

#     if not user_id or not product_id:
#         return error_response("Missing user_id or product_id")

#     product_obj_id = to_object_id(product_id)
#     if not product_obj_id:
#         return error_response("Invalid product_id format")

#     product = db.products.find_one({"_id": product_obj_id})
#     if not product:
#         return error_response("Product not found", 404)

#     existing_item = db.cart.find_one({"user_id": user_id, "product_id": product_obj_id})

#     if existing_item:
#         db.cart.update_one({"_id": existing_item["_id"]}, {"$inc": {"quantity": quantity}})
#         return success_response("Cart updated")
#     else:
#         res = db.cart.insert_one({
#             "user_id": user_id,
#             "product_id": product_obj_id,
#             "quantity": quantity,
#             "product_name": product.get("name"),
#             "product_price": product.get("price", 0),
#             "images": product.get("images", [])
#         })
#         return success_response("Product added to cart", {"inserted_id": str(res.inserted_id)})

# # ---------------- Get Cart Items ----------------
# def get_cart(user_id):
#     db = current_app.db
#     limit = int(request.args.get("limit", 50))
#     skip = int(request.args.get("skip", 0))

#     cart_items = list(db.cart.find({"user_id": user_id}).skip(skip).limit(limit))
#     for item in cart_items:
#         item["_id"] = str(item["_id"])
#         item["product_id"] = str(item["product_id"])
#     return success_response("Cart fetched successfully", {"cartItems": cart_items})

# # ---------------- Update Cart Quantity ----------------
# def update_cart():
#     db = current_app.db
#     data = request.json
#     cart_id = data.get("cart_id")
#     quantity = data.get("quantity")

#     if not cart_id or quantity is None:
#         return error_response("Missing cart_id or quantity")

#     cart_obj_id = to_object_id(cart_id)
#     if not cart_obj_id:
#         return error_response("Invalid cart_id format")

#     db.cart.update_one({"_id": cart_obj_id}, {"$set": {"quantity": max(1, int(quantity))}})
#     return success_response("Cart updated")

# # ---------------- Remove from Cart ----------------
# def remove_from_cart():
#     db = current_app.db
#     data = request.json
#     cart_id = data.get("cart_id")

#     if not cart_id:
#         return error_response("Missing cart_id")

#     cart_obj_id = to_object_id(cart_id)
#     if not cart_obj_id:
#         return error_response("Invalid cart_id format")

#     db.cart.delete_one({"_id": cart_obj_id})
#     return success_response("Item removed from cart")

# # ---------------- Clear Cart ----------------
# def clear_cart():
#     db = current_app.db
#     data = request.json
#     user_id = data.get("user_id")

#     if not user_id:
#         return error_response("Missing user_id")

#     db.cart.delete_many({"user_id": user_id})
#     return success_response("Cart cleared")
from flask import current_app, request
from utils.response_helper import success_response, error_response
from utils.objectid_helper import to_object_id

# ---------------- Add to Cart ----------------
def add_to_cart():
    db = current_app.db
    data = request.json
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = max(1, int(data.get("quantity", 1)))

    if not user_id or not product_id:
        return error_response("Missing user_id or product_id")

    product_obj_id = to_object_id(product_id)
    if not product_obj_id:
        return error_response("Invalid product_id format")

    product = db.products.find_one({"_id": product_obj_id})
    if not product:
        return error_response("Product not found", 404)

    existing_item = db.cart.find_one({"user_id": user_id, "product_id": product_id})

    if existing_item:
        db.cart.update_one({"_id": existing_item["_id"]}, {"$inc": {"quantity": quantity}})
        return success_response("Cart updated")
    else:
        res = db.cart.insert_one({
            "user_id": user_id,
            "product_id": product_id,
            "quantity": quantity,
            "product_name": product.get("name"),
            "product_price": product.get("price", 0),
            "images": product.get("images", [])
        })
        return success_response("Product added to cart", {"inserted_id": str(res.inserted_id)})

# ---------------- Get Cart Items ----------------
def get_cart(user_id):
    db = current_app.db
    limit = int(request.args.get("limit", 50))
    skip = int(request.args.get("skip", 0))

    cart_items = list(db.cart.find({"user_id": user_id}).skip(skip).limit(limit))
    for item in cart_items:
        item["_id"] = str(item["_id"])
    return success_response("Cart fetched successfully", {"cartItems": cart_items})

# ---------------- Update Cart Quantity ----------------
def update_cart(cart_id):
    db = current_app.db
    data = request.json
    quantity = data.get("quantity")

    if quantity is None:
        return error_response("Missing quantity")

    cart_obj_id = to_object_id(cart_id)
    if not cart_obj_id:
        return error_response("Invalid cart_id format")

    db.cart.update_one({"_id": cart_obj_id}, {"$set": {"quantity": max(1, int(quantity))}})
    return success_response("Cart updated")

# ---------------- Remove from Cart ----------------
def remove_from_cart(cart_id):
    db = current_app.db

    cart_obj_id = to_object_id(cart_id)
    if not cart_obj_id:
        return error_response("Invalid cart_id format")

    db.cart.delete_one({"_id": cart_obj_id})
    return success_response("Item removed from cart")

# ---------------- Clear Cart ----------------
def clear_cart(user_id):
    db = current_app.db
    db.cart.delete_many({"user_id": user_id})
    return success_response("Cart cleared")
