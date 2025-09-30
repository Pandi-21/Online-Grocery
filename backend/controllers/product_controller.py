# from flask import Blueprint, request, jsonify
# from services import product_service

# product_bp = Blueprint('product_bp', __name__)

# @product_bp.route('/products', methods=['POST'])
# def create_product():
#     data = request.get_json()
#     product_id = product_service.create_product(data)
#     return jsonify({"message": "Product created", "id": str(product_id)}), 201

# @product_bp.route('/products', methods=['GET'])
# def get_products():
#     products = product_service.get_all_products()
#     # convert ObjectId to string for JSON
#     for p in products:
#         p["_id"] = str(p["_id"])
#     return jsonify(products)

# @product_bp.route('/products/<product_id>', methods=['GET'])
# def get_product(product_id):
#     product = product_service.get_product_by_id(product_id)
#     if not product:
#         return jsonify({"message": "Not found"}), 404
#     product["_id"] = str(product["_id"])
#     return jsonify(product)

# @product_bp.route('/products/<product_id>', methods=['PUT'])
# def update_product(product_id):
#     data = request.get_json()
#     product_service.update_product(product_id, data)
#     return jsonify({"message": "Product updated"})

# @product_bp.route('/products/<product_id>', methods=['DELETE'])
# def delete_product(product_id):
#     product_service.delete_product(product_id)
#     return jsonify({"message": "Product deleted"})
