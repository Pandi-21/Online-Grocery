import axios from "axios";

const API_URL = "http://localhost:5000/admin";

const api = axios.create({ baseURL: API_URL, headers: { "Content-Type": "application/json" } });

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
