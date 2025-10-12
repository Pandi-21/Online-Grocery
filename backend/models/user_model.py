from werkzeug.security import generate_password_hash, check_password_hash

def create_user(data):
    from extensions import mongo
    data["password"] = generate_password_hash(data["password"])
    mongo.db.users.insert_one(data)

def find_user_by_email(email):
    from extensions import mongo
    return mongo.db.users.find_one({"email": email})

def check_user_password(user, password):
    return check_password_hash(user["password"], password)
