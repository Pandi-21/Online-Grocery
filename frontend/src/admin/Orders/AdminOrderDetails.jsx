import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      await axios.put(`http://localhost:5000/orders/${id}/status`, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      setUpdating(false);
      alert("Status updated!");
    } catch (err) {
      console.error("Error updating status:", err);
      setUpdating(false);
      alert("Failed to update.");
    }
  };

  if (!order) return <p className="p-5">Loading order details...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        ⬅ Back
      </button>

      {/* Order Info */}
      <div className="bg-white shadow rounded-lg p-5 space-y-2">
        <h2 className="text-xl font-bold mb-2">Order Details - {order._id}</h2>
        <p><strong>Name:</strong> {order.delivery_address.name}</p>
        <p><strong>Email:</strong> {order.delivery_address.email || "N/A"}</p>
        <p><strong>Phone:</strong> {order.delivery_address.phone}</p>
        <p>
          <strong>Address:</strong>{" "}
          {`${order.delivery_address.address}, ${order.delivery_address.city}, ${order.delivery_address.state} - ${order.delivery_address.zip}`}
        </p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> {order.payment_method}</p>
      </div>

      {/* Items */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-lg font-bold mb-2">Items</h3>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between py-2">
              <span>{item.product_name} × {item.quantity}</span>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Status Update */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-lg font-bold mb-2">Update Status</h3>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={updating}
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {updating && <p className="text-sm text-gray-500 mt-1">Updating...</p>}
      </div>
    </div>
  );
}
