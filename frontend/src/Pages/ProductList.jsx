import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import SidebarFilters from "../Components/SidebarFilters";
import toast from "react-hot-toast";

const dummyData = {
  "fresh-fruits": [
    { id: 1, name: "Apples", price: 2.99, rating: 4.8, reviews: 124, img: "/apple.jpeg", category: "Fresh Fruits" },
    { id: 2, name: "Bananas", price: 0.59, rating: 4.5, reviews: 98, img: "/banana.jpeg", category: "Fresh Fruits" },
    { id: 3, name: "Oranges", price: 1.29, rating: 4.6, reviews: 85, img: "/orange.jpeg", category: "Fresh Fruits" },
    { id: 4, name: "Grapes", price: 3.49, rating: 4.7, reviews: 67, img: "/grapes.jpeg", category: "Fresh Fruits" },
  ],
};

export default function ProductList() {
  const { category } = useParams();
  const products = dummyData[category] || [];

  // Track quantities in state
  const [quantities, setQuantities] = useState({});

  const handleAdd = (id) => {
    setQuantities((prev) => {
      const newQty = (prev[id] || 0) + 1;
      return { ...prev, [id]: newQty };
    });

    toast.success("Item added to your basket successfully", {
      id: "basket", // same toast reused
    });
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));

    toast.success("Item added to your basket successfully", {
      id: "basket",
    });
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const newQty = current - 1;

      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: newQty };
    });

    toast("Item removed from your basket", {
      id: "basket",
       
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
          {category.replace("-", " ")}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => {
            const qty = quantities[item.id] || 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition duration-300"
              >
                {/* Image and title are clickable to go to details */}
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-contain rounded-md"
                  />
                </Link>

                <Link to={`/product/${item.id}`}>
                  <h2 className="mt-3 font-semibold text-lg">{item.name}</h2>
                </Link>

                <p className="text-gray-500 text-sm">{item.category}</p>

                {/* Rating */}
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{item.rating}</span>
                  <span className="ml-1 text-gray-400">({item.reviews})</span>
                </div>

                {/* Price + Add/Qty */}
                <div className="mt-4">
                  <p className="text-lg font-bold">${item.price}/lb</p>

                  {qty === 0 ? (
                    <button
                      onClick={() => handleAdd(item.id)}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                    >
                      <FaShoppingCart />
                      Add
                    </button>
                  ) : (
                    <div className="mt-2 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                      >
                        −
                      </button>
                      <span className="font-semibold">{qty}</span>
                      <button
                        onClick={() => handleIncrement(item.id)}
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

          {products.length === 0 && (
            <p className="text-gray-500 col-span-full">
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
