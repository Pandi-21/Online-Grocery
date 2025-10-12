from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo

mail = Mail()
jwt = JWTManager()
mongo = PyMongo()
