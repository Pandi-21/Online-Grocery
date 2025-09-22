from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from bson.errors import InvalidId
import os, json, re, unicodedata, datetime

recipes_bp = Blueprint("recipes", __name__, url_prefix="/recipes")

# ---------- Config ----------
UPLOAD_DIR = "uploads/recipes"
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "webp"}
MAX_FILE_SIZE = 6 * 1024 * 1024  # 6 MB

# ---------- Helpers ----------
def slugify(text):
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    text = re.sub(r"[-\s]+", "-", text)
    return text

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

def parse_list(data, key):
    if not data.get(key):
        return []
    try:
        return json.loads(data.get(key))
    except:
        return [s.strip() for s in data.get(key).split("\n") if s.strip()]

# ---------- Serve Images ----------
@recipes_bp.route("/uploads/<filename>")
def serve_recipe_image(filename):
    return send_from_directory(UPLOAD_DIR, filename)

# ---------- Create Recipe ----------
@recipes_bp.route("", methods=["POST"])
def create_recipe():
    db = current_app.db
    data = request.form if request.form else request.json

    title = (data.get("title") or "").strip()
    subcategory_id = data.get("subcategory_id")
    if not title or not subcategory_id:
        return jsonify({"error": "title and subcategory required"}), 400

    parent_sub = db.subcategories.find_one({"_id": ObjectId(subcategory_id)})
    if not parent_sub:
        return jsonify({"error": "invalid subcategory"}), 400

    # Parse lists
    def parse_list(key):
        if not data.get(key):
            return []
        try:
            return json.loads(data.get(key))
        except:
            return [s.strip() for s in data.get(key).split("\n") if s.strip()]

    recipe = {
        "title": title,
        "slug": slugify(title),
        "category": "Recipes",
        "category_id": parent_sub["category_id"],
        "subcategory": parent_sub["name"],
        "subcategory_id": parent_sub["_id"],
        "ingredients": parse_list("ingredients"),
        "steps": parse_list("steps"),
        "tags": parse_list("tags"),
        "images": [],
        "created_at": datetime.datetime.utcnow(),
        "updated_at": datetime.datetime.utcnow()
    }

    # Handle images (image_0..image_4)
    if request.files:
        for i in range(5):
            f = request.files.get(f"image_{i}")
            if f and allowed_file(f.filename):
                filename = secure_filename(f.filename)
                base, ext = os.path.splitext(filename)
                filename = f"{base}_{int(datetime.datetime.utcnow().timestamp())}{ext}"
                f.save(os.path.join(UPLOAD_DIR, filename))
                recipe["images"].append(filename)

    res = db.recipes.insert_one(recipe)
    recipe["_id"] = str(res.inserted_id)
    return jsonify({"message": "created", "recipe": recipe}), 201

# ---------- List / Filter ----------
@recipes_bp.route("", methods=["GET"])
def list_recipes():
    db = current_app.db
    query = {"category": "Recipes"}

    qtext = request.args.get("q")
    if qtext:
        query["$or"] = [
            {"title": {"$regex": qtext, "$options": "i"}},
            {"tags": {"$regex": qtext, "$options": "i"}}
        ]

    recipes = list(db.recipes.find(query).sort("created_at", -1))
    for r in recipes:
        r["_id"] = str(r["_id"])
    return jsonify(recipes)



# ---------- Get by ID ----------
@recipes_bp.route("/<id>", methods=["GET"])
def get_recipe_by_id(id):
    db = current_app.db
    try:
        r = db.recipes.find_one({"_id": ObjectId(id)})
    except InvalidId:
        return jsonify({"error": "invalid id"}), 400
    if not r:
        return jsonify({"error": "not found"}), 404
    r["_id"] = str(r["_id"])
    return jsonify(r)

# ---------- Get by Slug ----------
@recipes_bp.route("/slug/<slug>", methods=["GET"])
def get_recipe_by_slug(slug):
    db = current_app.db
    r = db.recipes.find_one({"slug": slug})
    if not r:
        return jsonify({"error": "not found"}), 404
    r["_id"] = str(r["_id"])
    return jsonify(r)

# ---------- Update Recipe ----------
@recipes_bp.route("/<id>", methods=["PUT"])
def update_recipe(id):
    db = current_app.db
    try:
        recipe = db.recipes.find_one({"_id": ObjectId(id)})
    except InvalidId:
        return jsonify({"error": "invalid id"}), 400
    if not recipe:
        return jsonify({"error": "not found"}), 404

    data = request.form if request.form else request.json
    update = {}

    if data.get("title"):
        update["title"] = data.get("title")
        update["slug"] = slugify(data.get("title"))

    # Update subcategory if provided
    if data.get("subcategory_id"):
        parent_sub = db.subcategories.find_one({"_id": ObjectId(data.get("subcategory_id"))})
        if parent_sub:
            update["subcategory"] = parent_sub["name"]
            update["subcategory_id"] = parent_sub["_id"]
            update["category_id"] = parent_sub["category_id"]

    # Lists
    def parse_list(key):
        if not data.get(key):
            return None
        try:
            return json.loads(data.get(key))
        except:
            return [s.strip() for s in data.get(key).split("\n") if s.strip()]

    for key in ["ingredients", "steps", "tags"]:
        val = parse_list(key)
        if val is not None:
            update[key] = val

    # Existing images
    existing = data.get("existingImages")
    if existing:
        try:
            update["images"] = json.loads(existing)
        except:
            update["images"] = existing.split(",")
    else:
        update["images"] = recipe.get("images", [])

    # Add new images
    if request.files:
        for i in range(5):
            f = request.files.get(f"image_{i}")
            if f and allowed_file(f.filename):
                filename = secure_filename(f.filename)
                base, ext = os.path.splitext(filename)
                filename = f"{base}_{int(datetime.datetime.utcnow().timestamp())}{ext}"
                f.save(os.path.join(UPLOAD_DIR, filename))
                update["images"].append(filename)

    update["updated_at"] = datetime.datetime.utcnow()
    db.recipes.update_one({"_id": ObjectId(id)}, {"$set": update})
    return jsonify({"message": "updated"})

# ---------- Delete Recipe ----------
@recipes_bp.route("/<id>", methods=["DELETE"])
def delete_recipe(id):
    db = current_app.db
    try:
        db.recipes.delete_one({"_id": ObjectId(id)})
    except InvalidId:
        return jsonify({"error": "invalid id"}), 400
    return jsonify({"message": "deleted"})
