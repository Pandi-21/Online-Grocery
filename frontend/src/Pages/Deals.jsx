import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export default function DealsPage() {
  const [dealsData, setDealsData] = useState({});
  const navigate = useNavigate();

  const sections = ["todays", "top", "bogo", "membership"];

  useEffect(() => {
    async function fetchDeals() {
      try {
        const dataObj = {};
        for (const section of sections) {
          const res = await fetch(`${BACKEND_URL}/products/section/${section}`);
          if (!res.ok) throw new Error(`Failed to fetch ${section}`);
          const data = await res.json();
          dataObj[section] = Array.isArray(data) ? data : [];
        }
        setDealsData(dataObj);
      } catch (err) {
        console.error("Error fetching deals", err);
        toast.error("Failed to load deals");
      }
    }
    fetchDeals();
  }, []);

  const DealsSection = ({ title, products }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id}
              className="border p-3 rounded-lg shadow hover:shadow-md transition"
            >
              {p.images && p.images[0] ? (
                <img
  src={`${BACKEND_URL}/uploads/${p.images[0]}`}
  alt={p.name}
  className="w-full h-40 object-cover rounded"
/>

              ) : (
                <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                  No Image
                </div>
              )}
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.offerText || `$${p.price}`}</p>
              <button
                className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                onClick={() =>
                  navigate(`/deals/product/${p._id}`, { state: { product: p } })
                }
              >
                View Offer
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No products found</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-12">
      {Object.keys(dealsData).length === 0 ? (
        <p className="text-center text-gray-500">Loading deals…</p>
      ) : (
        Object.entries(dealsData).map(([sectionName, products]) => (
          <DealsSection
            key={sectionName}
            title={sectionName.replace("_", " ").toUpperCase()}
            products={products}
          />
        ))
      )}
    </div>
  );
}
