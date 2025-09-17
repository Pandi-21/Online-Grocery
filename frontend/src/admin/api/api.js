// src/api/api.js
import axios from "axios";

// Vite exposes env vars via import.meta.env
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add interceptors here
export default api;
