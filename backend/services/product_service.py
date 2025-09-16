from bson import ObjectId
from config import mongo

def create_product(data):
    return mongo.db.products.insert_one(data).inserted_id

def get_all_products():
    return list(mongo.db.products.find())

def get_product_by_id(product_id):
    return mongo.db.products.find_one({"_id": ObjectId(product_id)})

def update_product(product_id, data):
    return mongo.db.products.update_one({"_id": ObjectId(product_id)}, {"$set": data})

def delete_product(product_id):
    return mongo.db.products.delete_one({"_id": ObjectId(product_id)})
