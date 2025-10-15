// 📁 src/api/productApi.js
import axios from "axios";

// ✅ Get base URL from .env (with fallback)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

// ✅ Use this for all product routes
const API_URL = `${BACKEND_URL}/products`;

// 🆕 Create Product
export async function createProduct(product) {
  try {
    const res = await axios.post(API_URL, product);
    return res.data;
  } catch (err) {
    console.error("Error creating product", err);
    throw err;
  }
}

// 📦 Get All Products
export async function getProducts() {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching products", err);
    throw err;
  }
}

// 🧾 Get Single Product by ID
export async function getProductById(id) {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product", err);
    throw err;
  }
}

// ✏️ Update Product
export async function updateProduct(id, product) {
  try {
    const res = await axios.put(`${API_URL}/${id}`, product);
    return res.data;
  } catch (err) {
    console.error("Error updating product", err);
    throw err;
  }
}

// ❌ Delete Product
export async function deleteProduct(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting product", err);
    throw err;
  }
}
