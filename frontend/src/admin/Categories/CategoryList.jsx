import React from "react";
import { Link } from "react-router-dom";

export default function CategoryList() {
  // Dummy data — replace with your API
  const categories = [
    { id: 1, name: "Fruits", slug: "fruits" },
    { id: 2, name: "Vegetables", slug: "vegetables" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link
          to="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Slug</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="border px-3 py-2">{c.id}</td>
                <td className="border px-3 py-2">{c.name}</td>
                <td className="border px-3 py-2">{c.slug}</td>
                <td className="border px-3 py-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/categories/edit/${c.id}`}
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
