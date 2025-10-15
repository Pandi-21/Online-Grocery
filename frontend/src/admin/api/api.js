// src/api/api.js
import axios from "axios";

// Common backend URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

// Axios instance
const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export both instance and URL (in case you need raw URL in components)
export { API, BACKEND_URL };
