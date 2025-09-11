import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold mt-2">245</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold mt-2">₹1,23,400</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Active Users</h2>
          <p className="text-2xl font-bold mt-2">1,024</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-500">Low Stock Items</h2>
          <p className="text-2xl font-bold mt-2">18</p>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          {/* You can drop in a chart library here, e.g. recharts */}
          (Chart goes here)
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
            <tr>
              <td className="border px-3 py-2">#1234</td>
              <td className="border px-3 py-2">John Doe</td>
              <td className="border px-3 py-2">₹499</td>
              <td className="border px-3 py-2">Pending</td>
            </tr>
            <tr>
              <td className="border px-3 py-2">#1235</td>
              <td className="border px-3 py-2">Jane Smith</td>
              <td className="border px-3 py-2">₹899</td>
              <td className="border px-3 py-2">Shipped</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
