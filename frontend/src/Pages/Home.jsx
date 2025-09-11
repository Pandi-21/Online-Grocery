import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Fruits", img: "https://via.placeholder.com/150x150" },
  { name: "Vegetables", img: "https://via.placeholder.com/150x150" },
  { name: "Dairy", img: "https://via.placeholder.com/150x150" },
  { name: "Snacks", img: "https://via.placeholder.com/150x150" },
  { name: "Beverages", img: "https://via.placeholder.com/150x150" },
  { name: "Bakery", img: "https://via.placeholder.com/150x150" },
];

const deals = [
  { name: "Fresh Apples", price: "$2.99/lb" },
  { name: "Organic Carrots", price: "$1.49/lb" },
  { name: "Whole Milk", price: "$3.49/gallon" },
  { name: "Potato Chips", price: "$2.79/bag" },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1606788075761-9b008e826b97"
          alt="Groceries"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative max-w-4xl mx-auto text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fresh Groceries, Delivered.
          </h1>
          <p className="mb-6">
            Get the freshest produce, dairy, and pantry staples delivered straight to your door.
          </p>
          <button
      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full"
      onClick={() => navigate("/shop")}
    >
      Shop Now
    </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="text-center">
              <div className="rounded-lg overflow-hidden">
                <img src={cat.img} alt={cat.name} className="w-full h-32 object-cover" />
              </div>
              <p className="mt-2 font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="bg-gray-50 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Top Deals</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {deals.map((deal) => (
            <div key={deal.name} className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="font-semibold">{deal.name}</h3>
              <p className="text-gray-600">{deal.price}</p>
            </div>
          ))}
        </div>
      </section>

       
       
    </>
  );
}
