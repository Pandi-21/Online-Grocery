import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/productService";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const BACKEND_URL = "http://127.0.0.1:5000";
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    loadProducts();
  }

  return (
    <>
      {/* Product Table */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <Link
            to="/admin/products/new"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            + Add Product
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SubCategory</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">CategoryItem</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Main Image</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800">{p.name}</td>
                  <td className="px-6 py-4 text-gray-800">{p.subcategory?.name || "—"}</td>
                  <td className="px-6 py-4 text-gray-800">{p.item?.name || "—"}</td>
                  <td className="px-6 py-4 text-gray-800">₹{p.price}</td>
                  <td className="px-6 py-4">
                    {p.images?.[0] ? (
                      <img
                        src={`${BACKEND_URL}/uploads/${p.images[0]}`}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/admin/products/${p._id}`}
                      className="inline-block px-3 py-1 text-sm rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="inline-block px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500 text-sm">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this product?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={async () => {
                  await handleDelete(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
