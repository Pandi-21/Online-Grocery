import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

// ✅ Create Product
export async function createProduct(product) {
  try {
    const res = await axios.post(`${API_URL}/products`, product);
    return res.data;
  } catch (err) {
    console.error("Error creating product", err);
    throw err;
  }
}

// ✅ Get All Products
export async function getProducts() {
  try {
    const res = await axios.get(`${API_URL}/products`);
    return res.data;
  } catch (err) {
    console.error("Error fetching products", err);
    throw err;
  }
}

// ✅ Get Single Product by ID
export async function getProductById(id) {
  try {
    const res = await axios.get(`${API_URL}/products/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product", err);
    throw err;
  }
}

// ✅ Update Product
export async function updateProduct(id, product) {
  try {
    const res = await axios.put(`${API_URL}/products/${id}`, product);
    return res.data;
  } catch (err) {
    console.error("Error updating product", err);
    throw err;
  }
}

// ✅ Delete Product
export async function deleteProduct(id) {
  try {
    const res = await axios.delete(`${API_URL}/products/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting product", err);
    throw err;
  }
}
 