import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import SidebarFilters from "../SidebarFilters";
import toast from "react-hot-toast";
import api from "../../admin/api/api"; // your axios instance

export default function ProductList() {
 const { subcategorySlug, itemSlug } = useParams();


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/products?subcategory=${subcategorySlug}&item=${itemSlug}`
        );
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategorySlug, itemSlug]);

  const handleAdd = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast.success("Item added to your basket successfully", { id: "basket" });
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    toast.success("Item added to your basket successfully", { id: "basket" });
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const newQty = current - 1;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        toast("Item removed from your basket", { id: "basket" });
        return copy;
      }
      toast("Item removed from your basket", { id: "basket" });
      return { ...prev, [id]: newQty };
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Sidebar */}
      <div className="md:w-1/4">
        <SidebarFilters />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold capitalize mb-6">
          {subcategorySlug?.replace(/-/g, " ")}
          {itemSlug && ` / ${itemSlug?.replace(/-/g, " ")}`}
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const id = p._id || p.id;
              const qty = quantities[id] || 0;
              return (
                <div
                  key={id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition duration-300"
                >
                  {/* Image + title clickable to details */}
                 <Link
  to={`/shop/${p.category_slug || ""}/${p.subcategory_slug || ""}/${p.item_slug || ""}/${p.slug || p._id}`}
  className="block"
>

                    <img
                      src={p.img || p.images?.[0]}
                      alt={p.name}
                      className="w-full h-40 object-contain rounded-md"
                    />
                    <h2 className="mt-3 font-semibold text-lg">{p.name}</h2>
                  </Link>

                  <p className="text-gray-500 text-sm">
                    {p.categoryName || p.category?.name}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-medium">{p.rating}</span>
                    <span className="ml-1 text-gray-400">({p.reviews})</span>
                  </div>

                  {/* Price + Add/Qty */}
                  <div className="mt-4">
                    <p className="text-lg font-bold">
                      ${p.price}
                      {p.unit ? `/${p.unit}` : ""}
                    </p>

                    {qty === 0 ? (
                      <button
                        onClick={() => handleAdd(id)}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                      >
                        <FaShoppingCart />
                        Add
                      </button>
                    ) : (
                      <div className="mt-2 flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleDecrement(id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                        >
                          −
                        </button>
                        <span className="font-semibold">{qty}</span>
                        <button
                          onClick={() => handleIncrement(id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {!loading && products.length === 0 && (
              <p className="text-gray-500 col-span-full">
                No products found in this category.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
