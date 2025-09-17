# utils.py
import re
import unicodedata

def slugify(text: str) -> str:
    """
    Converts a string into a URL-friendly slug.
    Example: "Fresh Apples" -> "fresh-apples"
    """
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")  # remove accents
    text = re.sub(r"[^\w\s-]", "", text.lower())  # remove special chars
    text = re.sub(r"[\s_-]+", "-", text).strip("-")  # replace spaces/underscores with -
    return text
