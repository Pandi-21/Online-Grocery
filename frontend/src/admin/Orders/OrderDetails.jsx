import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data – replace with API fetch using `id`
  const order = {
    id: id,
    customer: "John Doe",
    email: "john@example.com",
    address: "123 Main St, Chennai",
    date: "2025-09-10",
    total: 499,
    status: "Pending",
    items: [
      { name: "Organic Apple", quantity: 2, price: 100 },
      { name: "Fresh Milk", quantity: 1, price: 299 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order {order.id}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Customer Info</h2>
            <p>
              <span className="font-medium">Name:</span> {order.customer}
            </p>
            <p>
              <span className="font-medium">Email:</span> {order.email}
            </p>
            <p>
              <span className="font-medium">Address:</span> {order.address}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Order Info</h2>
            <p>
              <span className="font-medium">Date:</span> {order.date}
            </p>
            <p>
              <span className="font-medium">Status:</span> {order.status}
            </p>
            <p>
              <span className="font-medium">Total:</span> ₹{order.total}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Items</h2>
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2 text-left">Item</th>
                <th className="border px-3 py-2 text-left">Qty</th>
                <th className="border px-3 py-2 text-left">Price</th>
                <th className="border px-3 py-2 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-2">{item.name}</td>
                  <td className="border px-3 py-2">{item.quantity}</td>
                  <td className="border px-3 py-2">₹{item.price}</td>
                  <td className="border px-3 py-2">
                    ₹{item.quantity * item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
