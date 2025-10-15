import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useOrders } from "../../context/OrdersContext";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchOrder, changeOrderStatus } = useOrders();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      const data = await fetchOrder(id);
      setOrder(data);
    };
    loadOrder();
  }, [id]);

  if (!order) return <p className="p-5">Loading order details...</p>;

  const totalAmount = order.total ?? order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    const updated = await changeOrderStatus(id, status);
    setOrder((prev) => ({ ...prev, status: updated || prev.status }));
    setUpdating(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster />
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
        <p><strong>Phone:</strong> {order.delivery_address.phone}</p>
        <p><strong>Address:</strong> {`${order.delivery_address.address}, ${order.delivery_address.city}, ${order.delivery_address.state} - ${order.delivery_address.zip}`}</p>
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
        <div className="flex justify-between font-bold text-lg mt-4 border-t pt-3">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-lg font-bold mb-2">Update Status</h3>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {updating && <p className="text-sm text-gray-500 mt-1">Updating...</p>}
      </div>
    </div>
  );
}
