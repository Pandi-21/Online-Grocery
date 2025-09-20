import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export async function getCategories() {
  try {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data;
  } catch (err) {
    console.error("Error fetching categories", err);
    throw err;
  }
}
