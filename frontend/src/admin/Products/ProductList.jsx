import React from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  // Dummy data — replace with your API data
  const products = [
    { id: 1, name: "Organic Apple", price: 2.99, stock: 50 },
    { id: 2, name: "Fresh Milk", price: 1.5, stock: 120 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Price</th>
              <th className="border px-3 py-2 text-left">Stock</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="border px-3 py-2">{p.id}</td>
                <td className="border px-3 py-2">{p.name}</td>
                <td className="border px-3 py-2">₹{p.price}</td>
                <td className="border px-3 py-2">{p.stock}</td>
                <td className="border px-3 py-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/edit/${p.id}`}
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
