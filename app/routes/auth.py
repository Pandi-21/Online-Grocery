from flask import Blueprint, render_template, request, redirect, session
import mysql.connector
from app.config import MYSQL_CONFIG

auth_bp = Blueprint('auth', __name__)

def get_connection():
    return mysql.connector.connect(**MYSQL_CONFIG)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            return redirect('/products')
        else:
            return render_template('login.html', error="Invalid credentials")
    return render_template('login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        conn = get_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                    (username, email, password))
        conn.commit()
        cur.close()
        conn.close()

        return redirect('/login')
    return render_template('register.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect('/login')
