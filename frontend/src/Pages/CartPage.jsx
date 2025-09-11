// src/pages/CartPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialItems = [
  {
    id: 1,
    name: "Organic Strawberries",
    desc: "Organic, 1 lb",
    price: 5.99,
    image: "/strawberries.jpg",
    qty: 2,
  },
  {
    id: 2,
    name: "Organic Bananas",
    desc: "Fresh, 1 bunch",
    price: 1.99,
    image: "/bananas.jpg",
    qty: 3,
  },
  {
    id: 3,
    name: "Organic Eggs",
    desc: "Free-Range, 1 dozen",
    price: 4.99,
    image: "/eggs.jpg",
    qty: 1,
  },
  {
    id: 4,
    name: "Organic Whole Milk",
    desc: "1 gallon",
    price: 3.99,
    image: "/milk.jpg",
    qty: 1,
  },
];

export default function CartPage() {
  const [items, setItems] = useState(initialItems);

  const handleQtyChange = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-500 text-sm">{item.desc}</p>
                <p className="text-green-600 font-semibold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQtyChange(item.id, -1)}
                  className="border rounded px-2 py-1"
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.id, 1)}
                  className="border rounded px-2 py-1"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-4">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block text-center bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
