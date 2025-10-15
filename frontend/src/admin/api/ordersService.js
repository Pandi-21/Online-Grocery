// import axios from "axios";

// const API_URL = "http://localhost:5000/orders";

// export const getAllOrders = async () => {
//   try {
//     const res = await axios.get(`${API_URL}/all`);
//     return res.data.data?.orders || res.data || [];
//   } catch (err) {
//     console.error("Error fetching all orders:", err);
//     throw err;
//   }
// };

// export const getOrderById = async (orderId) => {
//   try {
//     const res = await axios.get(`${API_URL}/${orderId}`);
//     return res.data.data?.order || res.data || null;
//   } catch (err) {
//     console.error(`Error fetching order ${orderId}:`, err);
//     throw err;
//   }
// };

// export const updateOrderStatus = async (orderId, status) => {
//   try {
//     const res = await axios.put(`${API_URL}/${orderId}/status`, { status });
//     return res.data.data?.status || status;
//   } catch (err) {
//     console.error(`Error updating status for order ${orderId}:`, err);
//     throw err;
//   }
// };
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

// ✅ Admin API base URL
const API_URL = `${BACKEND_URL}/orders`;

// Get all orders (admin)
export const getAllOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/all`);
    return res.data.data?.orders || [];
  } catch (err) {
    console.error("Error fetching all orders:", err);
    throw err;
  }
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  try {
    const res = await axios.get(`${API_URL}/${orderId}`);
    return res.data.data?.order || null;
  } catch (err) {
    console.error(`Error fetching order ${orderId}:`, err);
    throw err;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axios.put(`${API_URL}/${orderId}/status`, { status });
    return res.data.data?.status || status;
  } catch (err) {
    console.error(`Error updating status for order ${orderId}:`, err);
    throw err;
  }
};

// Get user orders
export const getUserOrders = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data.data?.orders || [];
  } catch (err) {
    console.error(`Error fetching orders for user ${userId}:`, err);
    throw err;
  }
};
