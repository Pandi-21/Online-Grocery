from flask_pymongo import PyMongo
from bson import ObjectId

mongo = PyMongo()

# Helper function to serialize MongoDB ObjectId
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc
