from flask import Blueprint, render_template, request, session, redirect
import mysql.connector
from app.config import MYSQL_CONFIG

order_bp = Blueprint('order', __name__)

def get_connection():
    return mysql.connector.connect(**MYSQL_CONFIG)

# 🛒 View Cart
@order_bp.route('/cart')
def cart_page():
    user_id = session.get('user_id')
    if not user_id:
        return redirect('/login')

    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT c.id AS cart_id, p.name, p.price, c.quantity, (p.price * c.quantity) AS total
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = %s
    """, (user_id,))
    items = cur.fetchall()
    cur.close()
    conn.close()

    return render_template('cart.html', items=items)


# ➖ Remove Item from Cart
@order_bp.route('/cart/remove/<int:cart_id>', methods=['POST'])
def remove_from_cart(cart_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM cart WHERE id = %s", (cart_id,))
    conn.commit()
    cur.close()
    conn.close()
    return redirect('/cart')


# ✅ Add to Cart (Single Product)
@order_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    product_id = request.form['product_id']
    quantity = int(request.form['quantity'])
    user_id = session.get('user_id')

    if not user_id:
        return redirect('/login')

    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT quantity FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    existing = cur.fetchone()
    if existing:
        cur.execute("UPDATE cart SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s",
                    (quantity, user_id, product_id))
    else:
        cur.execute("""
            INSERT INTO cart (user_id, product_id, quantity)
            VALUES (%s, %s, %s)
        """, (user_id, product_id, quantity))
    
    conn.commit()
    cur.close()
    conn.close()
    return redirect('/cart')


# ✅ Add Multiple Products to Cart (From products.html)
@order_bp.route('/cart/add-multiple', methods=['POST'])
def add_multiple_to_cart():
    product_id = request.form['product_id']
    quantity = int(request.form['quantity'])
    user_id = session.get('user_id')
    if not user_id:
        return redirect('/login')

    selected_products = request.form.getlist('selected_products[]')  # no need for [] in name

    if not selected_products:
        return redirect('/products')

    conn = get_connection()
    cur = conn.cursor()

    for product_id in selected_products:
        qty_field = f'quantities_{product_id}'
        try:
            quantity = int(request.form.get(qty_field, 1))
        except (TypeError, ValueError):
            quantity = 1

        cur.execute("SELECT quantity FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
        existing = cur.fetchone()

        if existing:
            cur.execute("UPDATE cart SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s",
                        (quantity, user_id, product_id))
        else:
            cur.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",
                        (user_id, product_id, quantity))

    conn.commit()
    cur.close()
    conn.close()

    return redirect('/cart')


# 💳 Checkout
@order_bp.route('/checkout', methods=['POST'])
def checkout():
    user_id = session.get('user_id')
    if not user_id:
        return redirect('/login')

    payment_method = request.form.get('payment_method')

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT product_id, quantity FROM cart WHERE user_id = %s", (user_id,))
    cart_items = cur.fetchall()

    if not cart_items:
        cur.close()
        conn.close()
        return redirect('/cart')

    total = 0
    for item in cart_items:
        cur.execute("SELECT price FROM products WHERE id = %s", (item[0],))
        price = cur.fetchone()[0]
        total += price * item[1]

    cur.execute("""
        INSERT INTO orders (user_id, total_amount, payment_method)
        VALUES (%s, %s, %s)
    """, (user_id, total, payment_method))
    order_id = cur.lastrowid

    for item in cart_items:
        cur.execute("SELECT price FROM products WHERE id = %s", (item[0],))
        price = cur.fetchone()[0]
        cur.execute("""
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (%s, %s, %s, %s)
        """, (order_id, item[0], item[1], price))

    cur.execute("DELETE FROM cart WHERE user_id = %s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()
    return redirect('/orders')


# 📜 Order History
@order_bp.route('/orders')
def order_history():
    user_id = session.get('user_id')
    if not user_id:
        return redirect('/login')

    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT o.id AS order_id, o.order_date, o.total_amount, o.payment_method,
               p.name AS product_name, oi.quantity, oi.price,
               (oi.quantity * oi.price) AS item_total
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = %s
        ORDER BY o.order_date DESC
    """, (user_id,))
    orders = cur.fetchall()

    cur.close()
    conn.close()
    return render_template('orders.html', orders=orders)
