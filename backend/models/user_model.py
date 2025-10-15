from werkzeug.security import generate_password_hash, check_password_hash
from extensions import mongo

# -------------------- USER --------------------

def create_user(data):
    """Create a new user in `users` collection."""
    hashed_pw = generate_password_hash(data["password"])
    data["password"] = hashed_pw
    mongo.db.users.insert_one(data)

def find_user_by_email(email):
    """Find a user document by email"""
    return mongo.db.users.find_one({"email": email})

def check_user_password(user, password):
    """Check if entered password matches hashed password"""
    return check_password_hash(user["password"], password)


# -------------------- ADMIN --------------------

def create_admin_user(email, password):
    """Create a new admin in `admin_users` collection"""
    # First, check if admin already exists
    if mongo.db.admin_users.find_one({"email": email}):
        return None  # admin exists, do nothing
    hashed_pw = generate_password_hash(password)
    mongo.db.admin_users.insert_one({"email": email, "password": hashed_pw})
    return True

def get_admin_by_email(email):
    """Find an admin document by email"""
    return mongo.db.admin_users.find_one({"email": email})

def verify_password(stored_password, entered_password):
    """Verify entered password against hashed password"""
    return check_password_hash(stored_password, entered_password)
