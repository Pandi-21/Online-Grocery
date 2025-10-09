import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { orders, loading, fetchUserOrders, changeOrderStatus } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchUserOrders(user._id);
    }
  }, [user?._id]);

  const handleReorder = (order) => {
    if (!order?.items) return;
    order.items.forEach((item) => {
      addToCart(
        {
          _id: item.product_id,
          name: item.product_name,
          price: item.price,
          images: item.images || [],
        },
        item.quantity
      );
    });
    toast.success("Items added to cart!");
  };

  const handleCancelOrder = async (order) => {
    if (!order?._id) return;
    try {
      await changeOrderStatus(order._id, "cancelled");
      toast.success("Order cancelled!");
      await fetchUserOrders(user._id);
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (!orders?.length) return <p className="p-6">You have no orders yet.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  order.status === "pending"
                    ? "text-yellow-600"
                    : order.status === "delivered"
                    ? "text-green-600"
                    : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p><strong>Total:</strong> ₹{order.total}</p>

            <div className="mt-3">
              <strong>Products:</strong>
              <ul className="list-none mt-2">
                {order.items.map((item) => (
                  <li
                    key={item.product_id}
                    className="flex items-center gap-2 mb-2 border-b pb-2"
                  >
                    {item.images?.[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/shop/${item.subcategory}/${item.itemSlug}/${item.productSlug}`
                          )
                        }
                      >
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} • ₹{item.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {order.status === "pending" && (
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={() => handleCancelOrder(order)}
                >
                  Cancel
                </button>
              )}
              {(order.status === "delivered" ||
                order.status === "cancelled") && (
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => handleReorder(order)}
                >
                  Reorder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
