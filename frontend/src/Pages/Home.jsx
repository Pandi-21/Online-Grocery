import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API as api } from "../admin/api/api";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [catRes, dealRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products/section/deals"),
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setDeals(Array.isArray(dealRes.data) ? dealRes.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <img
          src="/fresh.jpg"
          alt="Groceries"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative max-w-4xl mx-auto text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fresh Groceries, Delivered.
          </h1>
          <p className="mb-6">
            Get the freshest produce, dairy, and pantry staples delivered
            straight to your door.
          </p>
          <button
            className="bg-green-900 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-full"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id || cat.name}
                className="text-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() =>
                  navigate(`/${cat.slug || cat.name.toLowerCase()}`)
                }
              >
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={cat.img || "https://placehold.co/150x150?text=No+Image"}
                    alt={cat.name}
                    className="w-full h-32 object-cover"
                  />
                </div>
                <p className="mt-2 font-medium">{cat.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Deals */}
      <section className="bg-gray-50 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Top Deals</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading deals...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {deals.map((deal) => (
              <div
                key={deal._id || deal.name}
                className="bg-white rounded-lg shadow p-4 text-center"
              >
                <h3 className="font-semibold">{deal.name}</h3>
                <p className="text-gray-600">₹{deal.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
