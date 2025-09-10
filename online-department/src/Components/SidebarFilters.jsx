import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function SidebarFilters() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [price, setPrice] = useState(5);
  const [rating, setRating] = useState(4);

  const categories = ["All", "Fruits", "Vegetables", "Organic"];

  return (
    <div className="w-64 bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category</h3>
        {categories.map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategory === cat}
              onChange={() => setSelectedCategory(cat)}
              className="accent-green-500 w-4 h-4"
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>$0</span>
          <span>${price}</span>
          <span>$10</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-2">Rating</h3>
        <div className="flex items-center gap-2 text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="text-gray-700 text-sm">& {rating} & up</span>
        </div>
      </div>
    </div>
  );
}
