from flask import Flask, render_template
from app.routes.auth import auth_bp
from app.routes.product import product_bp
from app.routes.order import order_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = "grocery123"  # 👉 Consider loading from environment variables in production

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(order_bp)

    # Home route
    @app.route('/')
    def home():
        return render_template('index.html')

    return app
