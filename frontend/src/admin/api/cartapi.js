// 📁 src/api/cartapi.js
import axios from "axios";

// ✅ Load base URL from .env (with fallback if needed)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

// ✅ Cart API base
const API_URL = `${BACKEND_URL}/cart`;

// 🛒 Add to Cart
export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const res = await axios.post(`${API_URL}/add`, {
      user_id: userId,
      product_id: productId,
      quantity,
    });
    return res.data;
  } catch (err) {
    console.error("Add to cart error:", err);
    return { error: err.response?.data?.error || "Add to cart failed" };
  }
};

// 🧾 Get Cart Items
export const getCartItems = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/${userId}`);
    return res.data?.cartItems || [];
  } catch (err) {
    console.error("Fetch cart error:", err);
    return [];
  }
};

// ✏️ Update Cart Item Quantity
export const updateCartItem = async (cartId, quantity) => {
  try {
    const res = await axios.put(`${API_URL}/update/${cartId}`, { quantity });
    return res.data;
  } catch (err) {
    console.error("Update error:", err);
    return { error: "Update failed" };
  }
};

// ❌ Remove Cart Item
export const removeCartItem = async (cartId) => {
  try {
    const res = await axios.delete(`${API_URL}/remove/${cartId}`);
    return res.data;
  } catch (err) {
    console.error("Remove error:", err);
    return { error: "Remove failed" };
  }
};

// 🧹 Clear Cart
export const clearCart = async (userId) => {
  try {
    const res = await axios.delete(`${API_URL}/clear/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Clear cart error:", err);
    return { error: "Clear cart failed" };
  }
};
