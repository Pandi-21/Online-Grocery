// 📁 src/api/categoryApi.js
import axios from "axios";

// ✅ Get base URL from .env (with fallback)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

// ✅ Categories API URL
const API_URL = `${BACKEND_URL}/categories`;

// 📦 Get all categories
export async function getCategories() {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching categories", err);
    throw err;
  }
}
