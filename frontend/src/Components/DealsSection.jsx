import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:5000";

export default function DealsPage() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState({
    todays: [],
    top: [],
    bogo: [],
    membership: []
  });

  useEffect(() => {
    const sections = ["todays", "top", "bogo", "membership"];
    sections.forEach(section => {
      fetch(`${BACKEND_URL}/products/section/${section}`)
        .then(res => res.json())
        .then(data => setDeals(prev => ({ ...prev, [section]: data })))
        .catch(err => console.error(err));
    });
  }, []);

  const DealsSection = ({ title, products }) => (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <div key={p._id} className="border p-3 rounded-lg shadow hover:shadow-md">
            {p.images && p.images[0] ? (
              <img
                src={`${BACKEND_URL}/${p.images[0]}`}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                No Image
              </div>
            )}
            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.offerText || ""}</p>
            <button
              className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
              onClick={() => navigate(`/deals/${p._id}`, { state: { product: p } })}
            >
              View Offer
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-12">
      <DealsSection title="Today's Deals" products={deals.todays} />
      <DealsSection title="Top Offers" products={deals.top} />
      <DealsSection title="Buy 1 Get 1" products={deals.bogo} />
      <DealsSection title="Membership & Loyalty Deals" products={deals.membership} />
    </div>
  );
}
