# import os
# from dotenv import load_dotenv

# load_dotenv()  # Load variables from .env

# class Config:
#     SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
#     MONGO_URI = "mongodb://localhost:27017/myshop"
    
#     # Flask-Mail
#     MAIL_SERVER = 'smtp.gmail.com'
#     MAIL_PORT = 587
#     MAIL_USE_TLS = True
#     MAIL_USERNAME = os.getenv("MAIL_USERNAME")
#     MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    
#     # JWT
#     JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_jwt_secret")
    
#     # Twilio
#     TWILIO_SID = os.getenv("TWILIO_SID")
#     TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
#     TWILIO_PHONE = os.getenv("TWILIO_PHONE")
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
    MONGO_URI = "mongodb://localhost:27017/myshop"

    # Flask-Mail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_jwt_secret")

    # Twilio
    TWILIO_SID = os.getenv("TWILIO_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE = os.getenv("TWILIO_PHONE")
