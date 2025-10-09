  // src/Pages/CheckoutPage.jsx
  import React, { useState } from "react";
  import axios from "axios";
  import { useCart } from "../context/CartContext";
  import { useAuth } from "../context/AuthContext";

  export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      paymentMethod: "online",
    });

    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (cartItems.length === 0) {
        alert("Your cart is empty");
        return;
      }
  if (!user || !user._id) {
    alert("Invalid user. Make sure you are logged in.");
    return;
  }

  const orderData = {
    user_id: user._id,   // backend now accepts both 24-char ObjectId or string
    items: cartItems.map((item) => ({
      product_id: item._id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.product_price,
    })),
    delivery_address: {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      phone: formData.phone,
    },
    payment_method: formData.paymentMethod,
  };


      try {
        const res = await axios.post(
          "http://localhost:5000/orders/create",
          orderData
        );
        console.log("Order placed successfully! Order ID:", res.data.order_id);
        setShowModal(true);
        clearCart();
      } catch (err) {
        console.error("Failed to place order:", err);
        alert(err.response?.data?.error || "Failed to place order.");
      }
    };

    return (
      <div className="bg-gray-50 min-h-screen relative">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Delivery Address */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                {["name","address","city","state","zip","phone"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                {["online","cod"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer ${
                      formData.paymentMethod === method ? "border-green-500" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">{method==="online"?"Online Payment":"Cash on Delivery"}</p>
                      <p className="text-sm text-gray-500">
                        {method==="online"?"Pay with your credit or debit card.":"Pay with cash when your order arrives."}
                      </p>
                    </div>
                  </label>
                ))}
                <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 mt-4">
                  Place Order
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 Your Order Has Been Placed!</h2>
              <p className="text-gray-600 mb-6">Thank you for shopping with us. We’ll notify you when your order is on the way.</p>
              <button onClick={() => setShowModal(false)} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
