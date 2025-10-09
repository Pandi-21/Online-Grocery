// import axios from "axios";

// const API_URL = "http://127.0.0.1:5000/cart";

// // Add to cart
// export const addToCart = async (userId, productId, quantity = 1) => {
//   try {
//     const res = await axios.post(`${API_URL}/add`, {
//       user_id: userId,
//       product_id: productId,
//       quantity,
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Add to cart error:", err);
//     return { error: err.response?.data?.error || "Add to cart failed" };
//   }
// };

// // Get cart items
// // Get cart items
// export const getCartItems = async (userId) => {
//   try {
//     const res = await axios.get(`${API_URL}/${userId}`);

//     // ✅ adjust according to backend response
//     if (Array.isArray(res.data)) {
//       return res.data;
//     } else if (res.data?.cartItems) {
//       return res.data.cartItems;  // 👈 fix here
//     }
//     return [];
//   } catch (err) {
//     console.error("Fetch cart error:", err);
//     return [];
//   }
// };


// // Update cart item quantity
// export const updateCartItem = async (cartId, quantity) => {
//   try {
//     const res = await axios.post(`${API_URL}/update`, {
//       cart_id: cartId,
//       quantity,
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Update error:", err);
//     return { error: "Update failed" };
//   }
// };

// // Remove item from cart
// export const removeCartItem = async (cartId) => {
//   try {
//     const res = await axios.post(`${API_URL}/remove`, { cart_id: cartId });
//     return res.data;
//   } catch (err) {
//     console.error("Remove error:", err);
//     return { error: "Remove failed" };
//   }
// };
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/cart";

// Add to cart
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

// Get cart items
export const getCartItems = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/${userId}`);
    return res.data?.cartItems || []; // ✅ backend returns { cartItems: [...] }
  } catch (err) {
    console.error("Fetch cart error:", err);
    return [];
  }
};

// Update cart item quantity
export const updateCartItem = async (cartId, quantity) => {
  try {
    const res = await axios.put(`${API_URL}/update/${cartId}`, { quantity });
    return res.data;
  } catch (err) {
    console.error("Update error:", err);
    return { error: "Update failed" };
  }
};

// Remove item from cart
export const removeCartItem = async (cartId) => {
  try {
    const res = await axios.delete(`${API_URL}/remove/${cartId}`);
    return res.data;
  } catch (err) {
    console.error("Remove error:", err);
    return { error: "Remove failed" };
  }
};

// Clear cart
export const clearCart = async (userId) => {
  try {
    const res = await axios.delete(`${API_URL}/clear/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Clear cart error:", err);
    return { error: "Clear cart failed" };
  }
};
