# Empty to mark as a package
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.secret_key = 'super-secret-key'  # Needed for session

    CORS(app)

    # 🔁 Register your blueprints here
    from app.routes.products import product_bp
    app.register_blueprint(product_bp)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    from app.routes.order import order_bp
    app.register_blueprint(order_bp)  # ✅ Register order routes

    return app
