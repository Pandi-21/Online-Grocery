import re
from bson.objectid import ObjectId

def slugify(text: str) -> str:
    """Convert text to an SEO-friendly slug."""
    # Lowercase, strip, replace spaces with hyphens, remove non-alphanumeric except hyphens
    text = text.strip().lower()
    text = re.sub(r"\s+", "-", text)                 # Replace spaces with hyphens
    text = re.sub(r"[^a-z0-9-]", "", text)          # Remove special characters
    return text

def safe_float(value, default=0.0):
    """Convert value to float, return default if conversion fails."""
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_int(value, default=1):
    """Convert value to int, return default if conversion fails."""
    try:
        return int(value)
    except (ValueError, TypeError):
        return default

def object_id(value):
    """
    Convert a 24-character string to a BSON ObjectId.
    If it's already an ObjectId or invalid, return the value as is.
    """
    try:
        if isinstance(value, str) and len(value) == 24:
            return ObjectId(value)
        return value
    except Exception:
        return value

import unicodedata, re, os
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from bson.errors import InvalidId

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def slugify(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def save_images(files, existing_images=None):
    images = existing_images[:] if existing_images else []
    for i in range(3):
        file = files.get(f"image_{i}")
        if file:
            if not allowed_file(file.filename):
                raise ValueError("Only image files allowed")
            file.seek(0, os.SEEK_END)
            if file.tell() > MAX_FILE_SIZE:
                raise ValueError("Each image must be ≤5MB")
            file.seek(0)
            filename = secure_filename(file.filename)
            path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(path)
            images.append(filename)
    return images

def to_object_id(val):
    try:
        return ObjectId(val)
    except (InvalidId, TypeError):
        return None

def object_id_str(obj):
    return str(obj["_id"]) if "_id" in obj else None
def parse_list(data, key):
    """Convert textarea string (with newlines) or comma-separated string into a list"""
    val = data.get(key)
    if not val:
        return []
    if isinstance(val, list):
        return val
    return [x.strip() for x in val.splitlines() if x.strip()]

