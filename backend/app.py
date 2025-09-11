from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # import blueprints
    from routes.products import products_bp
    from routes.users import users_bp
    # from routes.categories import categories_bp
    # from routes.orders import orders_bp
    # from routes.coupons import coupons_bp

    # register blueprints
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    # app.register_blueprint(categories_bp, url_prefix="/api/categories")
    # app.register_blueprint(orders_bp, url_prefix="/api/orders")
    # app.register_blueprint(coupons_bp, url_prefix="/api/coupons")

    return app

# only run the app if this file is executed directly
if __name__ == "__main__":
    # disable reloader to prevent WinError 10038
    app = create_app()
    app.run(debug=True, use_reloader=False)
