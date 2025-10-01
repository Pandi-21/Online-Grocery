// services/dashboardService.js
import axios from "axios";

const API_URL = "http://localhost:5000/admin";

export const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/dashboard-stats`);
    return res.data;
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    throw err;
  }
};

export const getLatestOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/latest-orders`);
    return res.data;
  } catch (err) {
    console.error("Error fetching latest orders:", err);
    throw err;
  }
};
