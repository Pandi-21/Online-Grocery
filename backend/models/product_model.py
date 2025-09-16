# product_schema = {
#     "main_image": str,          # main image URL
#     "sub_images": list,         # list of 3 sub image URLs
#     "name": str,
#     "price": float,
#     "description": str,
#     "sizes": list,              # ["S","M","L"] dropdown options
#     "colors": list,             # ["Red","Blue"] dropdown options
#     "quantity_options": list,   # [1,2,3,4]
#     "specifications": dict,     # {"material":"cotton","weight":"500g"}
#     "reviews": list             # [{"user":"pandi","comment":"nice","rating":5}]
# }

from bson.objectid import ObjectId

def product_serializer(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product.get("name", ""),
        "category_id": str(product.get("category_id", "")),
        "subcategory_id": str(product.get("subcategory_id", "")),
        "item_id": str(product.get("item_id", "")),
        "price": product.get("price", ""),
        "description": product.get("description", ""),
        "images": product.get("images", []),
        "sizes": product.get("sizes", []),
        "colors": product.get("colors", []),
        "quantity_options": product.get("quantity_options", []),
        "specifications": product.get("specifications", {}),
        "reviews": product.get("reviews", []),
    }

