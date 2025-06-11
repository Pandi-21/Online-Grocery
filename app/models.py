import mysql.connector
from app.config import MYSQL_CONFIG

def get_connection():
    return mysql.connector.connect(**MYSQL_CONFIG)

# ------------------ Product-related ------------------ #

def get_products():
    try:
        with get_connection() as conn:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT * FROM products")
                return cursor.fetchall()
    except Exception as e:
        print("❌ Error fetching products:", e)
        return []

def add_product(name, description, price, image_url, stock):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO products (name, description, price, image_url, stock) VALUES (%s, %s, %s, %s, %s)",
                    (name, description, price, image_url, stock)
                )
                conn.commit()
                print("✅ Product added.")
    except Exception as e:
        print("❌ Error adding product:", e)

def get_product_by_id(product_id):
    try:
        with get_connection() as conn:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
                return cursor.fetchone()
    except Exception as e:
        print("❌ Error fetching product by ID:", e)
        return None

def update_product(product_id, name, description, price, image_url, stock):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "UPDATE products SET name=%s, description=%s, price=%s, image_url=%s, stock=%s WHERE id=%s",
                    (name, description, price, image_url, stock, product_id)
                )
                conn.commit()
                print("✅ Product updated.")
    except Exception as e:
        print("❌ Error updating product:", e)

def delete_product_by_id(product_id):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
                conn.commit()
                print("✅ Product deleted.")
    except Exception as e:
        print("❌ Error deleting product:", e)

        
        
def add_to_cart(user_id, product_id, quantity):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)", (user_id, product_id, quantity))
    conn.commit()
    cursor.close()
    conn.close()

def get_cart_items(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.id as cart_id, p.name, p.price, p.image_url, c.quantity, p.id as product_id
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = %s
    """, (user_id,))
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return items

def remove_cart_item(cart_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cart WHERE id = %s", (cart_id,))
    conn.commit()
    cursor.close()
    conn.close()

def place_order(user_id, payment_method):
    items = get_cart_items(user_id)
    if not items:
        return False

    total = sum(item['price'] * item['quantity'] for item in items)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO orders (user_id, total_amount, payment_method) VALUES (%s, %s, %s)",
                   (user_id, total, payment_method))
    order_id = cursor.lastrowid

    for item in items:
        cursor.execute("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)",
                       (order_id, item['product_id'], item['quantity'], item['price']))

    cursor.execute("DELETE FROM cart WHERE user_id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return True

