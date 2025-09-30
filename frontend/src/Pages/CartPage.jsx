// pages/CartPage.jsx
import React from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, loading, updateCartItem, removeCartItem } = useCart();

  // Calculate total
  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce(
        (acc, item) => acc + item.quantity * (item.product_price || 0),
        0
      )
    : 0;

  if (loading) return <p>Loading cart...</p>;
  if (!Array.isArray(cartItems) || cartItems.length === 0)
    return <p>Your cart is empty.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 My Cart</h1>
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>Product</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Subtotal (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item._id}>
              <td>{item.product_name || "Product"}</td>
              <td>{item.product_price || 0}</td>
              <td>
                <button
                  onClick={() =>
                    updateCartItem(item._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartItem(item._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </td>
              <td>{(item.product_price || 0) * item.quantity}</td>
              <td>
                <button onClick={() => removeCartItem(item._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "20px" }}>Total: ₹{totalPrice}</h2>
      <button
        style={{ marginTop: "10px", padding: "10px 20px" }}
        onClick={() => alert("Proceeding to checkout...")}
      >
        Checkout
      </button>
    </div>
  );
};

export default CartPage;
