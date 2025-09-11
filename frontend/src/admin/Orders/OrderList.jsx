import React from "react";
import { Link } from "react-router-dom";

export default function OrderList() {
  // Dummy data — replace with your API call
  const orders = [
    {
      id: "ORD-1001",
      customer: "John Doe",
      total: 499,
      status: "Pending",
      date: "2025-09-10",
    },
    {
      id: "ORD-1002",
      customer: "Jane Smith",
      total: 1299,
      status: "Shipped",
      date: "2025-09-09",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">Order ID</th>
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-left">Total</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Date</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="border px-3 py-2">{o.id}</td>
                <td className="border px-3 py-2">{o.customer}</td>
                <td className="border px-3 py-2">₹{o.total}</td>
                <td className="border px-3 py-2">{o.status}</td>
                <td className="border px-3 py-2">{o.date}</td>
                <td className="border px-3 py-2">
                  <Link
                    to={`/admin/orders/${o.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
