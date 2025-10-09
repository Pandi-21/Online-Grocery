import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

export default function SidebarFilters({ products, onFilter }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [price, setPrice] = useState(10); // max price
  const [rating, setRating] = useState(0); // 0 means all ratings

  const categories = ["All", "Fruits", "Vegetables", "Organic"];

  // Whenever filters change, call onFilter with filtered products
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category?.name === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter((p) => Number(p.price) <= price);

    // Rating filter (average rating >= selected rating)
    if (rating > 0) {
      filtered = filtered.filter((p) => {
        const avgRating =
          p.reviews?.length
            ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
            : 0;
        return avgRating >= rating;
      });
    }

    onFilter(filtered);
  }, [selectedCategory, price, rating, products, onFilter]);

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
              type="radio"
              name="category"
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
          onChange={(e) => setPrice(Number(e.target.value))}
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
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= rating ? "text-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <button
          className="text-sm text-gray-700 underline"
          onClick={() => setRating(0)}
        >
          Clear Rating
        </button>
      </div>
    </div>
  );
}
