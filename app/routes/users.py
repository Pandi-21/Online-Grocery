from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import save_user, get_user_by_email

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash("Passwords do not match", "error")
            return redirect(url_for('users.register'))

        hashed_password = generate_password_hash(password)
        success = save_user(username, email, hashed_password)

        if success:
            flash("Registered successfully! Please login.", "success")
            return redirect(url_for('users.login'))
        else:
            flash("User already exists or error occurred.", "error")
            return redirect(url_for('users.register'))

    return render_template("register.html")
