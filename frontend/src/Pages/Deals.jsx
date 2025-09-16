import React from "react";
import { useNavigate } from "react-router-dom";

const dealsData = {
  todays: [
    { id: 1, name: "Laptop", offerText: "Flat 20% Off", price: 999, image: "https://via.placeholder.com/150", description: "High performance laptop with 16GB RAM and 512GB SSD", specifications: ["16GB RAM", "512GB SSD", "Intel i7"], reviews: [{ id: 1, user: "Alice", text: "Amazing performance!", rating: 5 }] },
    { id: 2, name: "Shoes", offerText: "Save ₹500", price: 59, image: "https://via.placeholder.com/150", description: "Comfortable running shoes", specifications: ["Size 9-12", "Blue color", "Lightweight"], reviews: [{ id: 2, user: "Bob", text: "Very comfy!", rating: 4 }] },
  ],
  top: [
    { id: 3, name: "Mobile", offerText: "Exchange Offer", price: 499, image: "https://via.placeholder.com/150", description: "Latest smartphone", specifications: ["128GB Storage", "6GB RAM"], reviews: [] },
    { id: 4, name: "TV", offerText: "EMI Starting ₹999", price: 799, image: "https://via.placeholder.com/150", description: "55 inch Smart TV", specifications: ["4K HDR", "Smart OS"], reviews: [] },
  ],
  bogo: [
    { id: 5, name: "Chocolates", offerText: "Buy 1 Get 1 Free", price: 10, image: "https://via.placeholder.com/150", description: "Delicious chocolate pack", specifications: ["200g Pack"], reviews: [] },
  ],
  membership: [
    { id: 6, name: "Premium Bag", offerText: "Exclusive 30% Off", price: 120, image: "https://via.placeholder.com/150", description: "Premium leather bag", specifications: ["Leather", "Black color"], reviews: [] },
  ],
};

export default function DealsPage() {
  const navigate = useNavigate();

  const DealsSection = ({ title, products }) => (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-3 rounded-lg shadow hover:shadow-md">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded" />
            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.offerText}</p>
            <button
              className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
              onClick={() => navigate(`/deals/${p.id}`, { state: { product: p } })}
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
      <DealsSection title="Today's Deals" products={dealsData.todays} />
      <DealsSection title="Top Offers" products={dealsData.top} />
      <DealsSection title="Buy 1 Get 1" products={dealsData.bogo} />
      <DealsSection title="Membership & Loyalty Deals" products={dealsData.membership} />
    </div>
  );
}
