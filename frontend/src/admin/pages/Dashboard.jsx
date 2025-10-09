import React, { useEffect, useState } from "react";
import { getDashboardStats, getLatestOrders } from "../api/dashboardService";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getLatestOrders()
        ]);
        setStats(statsData);
        setLatestOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-5">Loading Dashboard...</p>;
  if (!stats) return <p className="p-5 text-red-500">Failed to load dashboard.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Orders", value: stats.totalOrders },
          { label: "Revenue", value: `₹${Number(stats.revenue).toFixed(2)}` },
          { label: "Active Users", value: stats.activeUsers },
          { label: "Low Stock Items", value: stats.lowStockItems },
        ].map((card) => (
          <div key={card.label} className="bg-white shadow rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-500">{card.label}</h2>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
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
                  <td className="border px-3 py-2">{order.customer_name || "Unknown"}</td>
                  <td className="border px-3 py-2">
                    ₹{Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="border px-3 py-2">{order.status || "Pending"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
