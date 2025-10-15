// 📁 src/api/adminApi.js
import axios from "axios";

// ✅ Get base URL from .env (with fallback)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

// ✅ Admin API base URL
const API_URL = `${BACKEND_URL}/admin`;

// ✅ Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 📊 Get Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const res = await api.get("/dashboard-stats");
    if (res.data.success) return res.data.data;
    throw new Error(res.data.message || "Failed to fetch stats");
  } catch (err) {
    console.error("Dashboard stats error:", err);
    throw err;
  }
};

// 🧾 Get Latest Orders
export const getLatestOrders = async () => {
  try {
    const res = await api.get("/latest-orders");
    if (res.data.success) return res.data.data.orders;
    throw new Error(res.data.message || "Failed to fetch orders");
  } catch (err) {
    console.error("Latest orders error:", err);
    throw err;
  }
};
