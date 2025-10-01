import React, { useEffect, useState } from "react";
import { getDashboardStats, getLatestOrders } from  "../api/dashboardService"

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getLatestOrders();
      setLatestOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <p className="p-5">Loading Dashboard...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold mt-2">₹{stats.revenue}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Active Users</h2>
          <p className="text-2xl font-bold mt-2">{stats.activeUsers}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Low Stock Items</h2>
          <p className="text-2xl font-bold mt-2">{stats.lowStockItems}</p>
        </div>
      </div>

      {/* Latest Orders */}
      <div className="bg-white shadow rounded-xl p-6">
  <h2 className="text-lg font-bold mb-4">Latest Orders</h2>
  <table className="w-full border">
    <thead className="bg-gray-50">
      <tr>
        <th className="border px-3 py-2 text-left">Order ID</th>
        <th className="border px-3 py-2 text-left">Customer</th>
        <th className="border px-3 py-2 text-left">Total</th>
        <th className="border px-3 py-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {latestOrders.length === 0 ? (
        <tr>
          <td colSpan="4" className="border px-3 py-4 text-center text-gray-500">
            No orders found
          </td>
        </tr>
      ) : (
        latestOrders.map((order) => (
          <tr key={order._id}>
            <td className="border px-3 py-2">#{order._id.slice(-5)}</td>
            <td className="border px-3 py-2">
              {order.customer_name || "Unknown"}
            </td>
            <td className="border px-3 py-2">
              ₹{order.total ? Number(order.total).toFixed(2) : "0.00"}
            </td>
            <td className="border px-3 py-2">
              {order.status || "Pending"}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
    </div>
  );
}
