import React from "react";

export default function ReportPage() {
  // Dummy stats — replace with API calls later
  const stats = [
    { label: "Total Orders", value: 320 },
    { label: "Total Revenue", value: "₹2,45,000" },
    { label: "Active Users", value: 1200 },
    { label: "Coupons Used", value: 75 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports & Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white shadow rounded-xl p-6 text-center"
          >
            <div className="text-gray-500">{item.label}</div>
            <div className="text-2xl font-bold mt-2">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
        {/* Replace with a chart library like recharts later */}
        <div className="h-40 flex items-center justify-center text-gray-400">
          [Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
