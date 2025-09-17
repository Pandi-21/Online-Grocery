import re

def slugify(text: str) -> str:
    """Convert text to SEO-friendly slug"""
    return re.sub(r"\s+", "-", text.strip().lower())
