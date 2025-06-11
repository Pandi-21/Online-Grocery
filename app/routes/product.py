import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from werkzeug.utils import secure_filename
from app.models import (
    get_products, add_product, delete_product_by_id,
    get_product_by_id, update_product
)

product_bp = Blueprint('products', __name__)

# --- Configuration for Image Upload ---
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Routes ---

@product_bp.route('/')
def home():
    return render_template('index.html')

@product_bp.route('/products')
def products():
    products = get_products()
    return render_template('products.html', products=products)

@product_bp.route('/products/add', methods=['GET', 'POST'])
def add_product_page():
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        price = request.form['price']
        stock = request.form['stock']
        image_file = request.files.get('image')
        image_url = ''

        if not name or not price or not stock:
            flash("Product Name, Price and Stock are required!", "danger")
            return redirect(url_for('products.add_product_page'))

        try:
            price = float(price)
            stock = int(stock)
        except ValueError:
            flash("Invalid price or stock value!", "danger")
            return redirect(url_for('products.add_product_page'))

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(current_app.root_path, 'static/images', filename)
            image_file.save(image_path)
            image_url = f"/static/images/{filename}"

        # Save product with image_url
        add_product(name, description, price, image_url, stock)
        flash("✅ Product added successfully!", "success")
        return redirect(url_for('products.products'))

    return render_template('add_products.html')


@product_bp.route('/products/edit/<int:product_id>', methods=['GET', 'POST'])
def edit_product(product_id):
    product = get_product_by_id(product_id)

    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        price = request.form['price']
        image_url = request.form['image_url']
        stock = request.form['stock']

        try:
            price = float(price)
            stock = int(stock)
        except ValueError:
            flash("Invalid price or stock value!", "danger")
            return redirect(url_for('products.edit_product', product_id=product_id))

        update_product(product_id, name, description, price, image_url, stock)
        flash("✅ Product updated successfully!", "success")
        return redirect(url_for('products.products'))

    return render_template('edit_product.html', product=product)

@product_bp.route('/products/delete/<int:product_id>', methods=['POST'])
def delete_product(product_id):
    delete_product_by_id(product_id)
    flash("🗑️ Product deleted successfully!", "info")
    return redirect(url_for('products.products'))


