// context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const BASE_URL = "http://localhost:5000/cart";
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart on user change
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?._id) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/${user._id}`);
        setCartItems(res.data.cartItems || []);
      } catch (err) {
        console.error("Fetch cart error:", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // ---------------- Add to Cart ----------------
  const addToCart = async (product, quantity = 1) => {
    if (!user?._id) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/add`, {
        user_id: user._id,         // ✅ correct key
        product_id: product._id,   // ✅ correct key
        quantity,
      });

      // Refetch cart after add
      const res = await axios.get(`${BASE_URL}/${user._id}`);
      setCartItems(res.data.cartItems || []);
      toast.success("Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Could not add to cart");
    }
  };

  // ---------------- Update Cart Item ----------------
  const updateCartItem = async (cartId, quantity) => {
    if (!cartId || quantity < 1) return;

    try {
      await axios.post(`${BASE_URL}/update`, { cart_id: cartId, quantity });

      // Update cart locally
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartId ? { ...item, quantity } : item
        )
      );
      toast.success("Cart updated");
    } catch (err) {
      console.error("Update cart error:", err);
      toast.error("Could not update cart");
    }
  };

  // ---------------- Remove Cart Item ----------------
  const removeCartItem = async (cartId) => {
    if (!cartId) return;

    try {
      await axios.post(`${BASE_URL}/remove`, { cart_id: cartId });

      setCartItems((prev) => prev.filter((item) => item._id !== cartId));
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Remove cart error:", err);
      toast.error("Could not remove item");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
