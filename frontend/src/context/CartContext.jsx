// import { createContext, useContext, useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const BASE_URL = "http://localhost:5000/cart";
// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// const cartAPI = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" } });

// export function CartProvider({ children }) {
//   const { user } = useAuth();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!user?._id) { setCartItems([]); setLoading(false); return; }
//       try {
//         const res = await cartAPI.get(`/${user._id}`);
//         setCartItems(res.data.data.cartItems || []);
//       } catch {
//         setCartItems([]);
//       } finally { setLoading(false); }
//     };
//     fetchCart();
//   }, [user]);

//   const addToCart = async (product, quantity = 1) => {
//     if (!user?._id) { toast.error("Login required"); navigate("/login"); return; }
//     if (!product?._id) { toast.error("Invalid product"); return; }
//     quantity = Math.max(1, quantity);

//     try {
//       const res = await cartAPI.post("/add", { user_id: user._id, product_id: product._id, quantity });
//       setCartItems(prev => {
//         const existing = prev.find(i => i._id === product._id);
//         if (existing) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
//         return [...prev, { _id: res.data.data.inserted_id, product_name: product.name, product_price: product.price, quantity, images: product.images }];
//       });
//       toast.success("Added to cart");
//     } catch {
//       toast.error("Could not add to cart");
//     }
//   };

//   const updateCartItem = async (cartId, quantity) => {
//     if (!cartId || quantity < 1) return;
//     try {
//       await cartAPI.post("/update", { cart_id: cartId, quantity });
//       setCartItems(prev => prev.map(item => item._id === cartId ? { ...item, quantity } : item));
//       toast.success("Cart updated");
//     } catch { toast.error("Could not update cart"); }
//   };

//   const removeCartItem = async cartId => {
//     if (!cartId) return;
//     try {
//       await cartAPI.post("/remove", { cart_id: cartId });
//       setCartItems(prev => prev.filter(item => item._id !== cartId));
//       toast.success("Item removed");
//     } catch { toast.error("Could not remove item"); }
//   };

//   const clearCart = async () => {
//     if (!user?._id) return;
//     try {
//       await cartAPI.post("/clear", { user_id: user._id });
//       setCartItems([]);
//       toast.success("Cart cleared");
//     } catch { setCartItems([]); toast.error("Could not clear cart"); }
//   };

//   const totalPrice = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity * (item.product_price || 0), 0), [cartItems]);

//   return (
//     <CartContext.Provider value={{ cartItems, loading, totalPrice, addToCart, updateCartItem, removeCartItem, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const BASE_URL = "http://localhost:5000/cart";
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const cartAPI = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" } });

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart on user change
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?._id) { setCartItems([]); setLoading(false); return; }
      try {
        const res = await cartAPI.get(`/${user._id}`);
        setCartItems(res.data.data.cartItems || []);
      } catch {
        setCartItems([]);
      } finally { setLoading(false); }
    };
    fetchCart();
  }, [user]);

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    if (!user?._id) { toast.error("Login required"); navigate("/login"); return; }
    if (!product?._id) { toast.error("Invalid product"); return; }
    quantity = Math.max(1, quantity);

    try {
      const res = await cartAPI.post("/add", { user_id: user._id, product_id: product._id, quantity });
      setCartItems(prev => {
        const existing = prev.find(i => i.product_id === product._id);
        if (existing) {
          return prev.map(i =>
            i.product_id === product._id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, {
          _id: res.data.data.inserted_id,
          product_id: product._id,
          product_name: product.name,
          product_price: product.price,
          quantity,
          images: product.images || []
        }];
      });
      toast.success("Added to cart");
    } catch {
      toast.error("Could not add to cart");
    }
  };

  // Update cart item quantity
  const updateCartItem = async (cartId, quantity) => {
    if (!cartId || quantity < 1) return;
    try {
      await cartAPI.post("/update", { cart_id: cartId, quantity }); // backend uses POST /update
      setCartItems(prev => prev.map(item => item._id === cartId ? { ...item, quantity } : item));
      toast.success("Cart updated");
    } catch {
      toast.error("Could not update cart");
    }
  };

  // Remove cart item
  const removeCartItem = async cartId => {
    if (!cartId) return;
    try {
      await cartAPI.post("/remove", { cart_id: cartId }); // backend uses POST /remove
      setCartItems(prev => prev.filter(item => item._id !== cartId));
      toast.success("Item removed");
    } catch {
      toast.error("Could not remove item");
    }
  };

  // Clear user cart
  const clearCart = async () => {
    if (!user?._id) return;
    try {
      await cartAPI.post("/clear", { user_id: user._id }); // backend uses POST /clear
      setCartItems([]);
      toast.success("Cart cleared");
    } catch {
      setCartItems([]);
      toast.error("Could not clear cart");
    }
  };

  const totalPrice = useMemo(() =>
    cartItems.reduce((acc, item) => acc + item.quantity * (item.product_price || 0), 0),
    [cartItems]
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      totalPrice,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
