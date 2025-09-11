import React from "react";
import { Link } from "react-router-dom";

export default function CouponList() {
  // Dummy data — replace with API call
  const coupons = [
    {
      id: 1,
      code: "WELCOME10",
      discount: "10%",
      expiry: "2025-12-31",
    },
    {
      id: 2,
      code: "FREESHIP",
      discount: "Free Shipping",
      expiry: "2025-11-30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Link
          to="/admin/coupons/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Coupon
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Discount</th>
              <th className="border px-3 py-2 text-left">Expiry</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="border px-3 py-2">{c.id}</td>
                <td className="border px-3 py-2">{c.code}</td>
                <td className="border px-3 py-2">{c.discount}</td>
                <td className="border px-3 py-2">{c.expiry}</td>
                <td className="border px-3 py-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/coupons/edit/${c.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
