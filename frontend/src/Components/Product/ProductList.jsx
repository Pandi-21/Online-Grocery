import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { API as api } from "../../admin/api/api";
import { useCart } from "../../context/CartContext"; // Adjust path

const BACKEND_URL = "http://127.0.0.1:5000";

// Sidebar filters component
function SidebarFilters({ products, onFilter }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [price, setPrice] = useState(10);
  const [rating, setRating] = useState(0);
  const categories = ["All", "Fruits", "Vegetables", "Organic"];

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category?.name === selectedCategory);
    }

    filtered = filtered.filter((p) => Number(p.price) <= price);

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
          <label key={cat} className="flex items-center gap-2 mb-2 cursor-pointer">
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

      {/* Price */}
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
        <button className="text-sm text-gray-700 underline" onClick={() => setRating(0)}>
          Clear Rating
        </button>
      </div>
    </div>
  );
}

// Main ProductList component
export default function ProductList() {
  const { subcategory: subcategorySlug, item: itemSlug } = useParams();
  const { cartItems, addToCart, updateCartItem } = useCart();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itemSlug) {
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/products/${subcategorySlug}/${itemSlug}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategorySlug, itemSlug]);

  // Helper to get current quantity in cart
  const getQty = (productId) => {
    const item = cartItems.find((i) => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  if (!itemSlug) {
    return (
      <div className="text-center py-10 text-gray-600">
        Please select a category item.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Sidebar */}
      <div className="md:w-1/4">
        <SidebarFilters products={products} onFilter={setFilteredProducts} />
      </div>

      {/* Products Grid */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold capitalize mb-6">
          {subcategorySlug?.replace(/-/g, " ")}
          {itemSlug && ` / ${itemSlug?.replace(/-/g, " ")}`}
        </h1>

        {error && <p className="text-red-500 text-center py-6">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const id = p._id || p.id;
              const qty = getQty(id);

              return (
                <div
                  key={id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition duration-300"
                >
                  <Link
                    to={`/shop/${p.subcategory_slug || "unknown-subcategory"}/${p.item_slug || "unknown-item"}/${p.slug || id}`}
                  >
                    {p.images?.length > 0 && (
                      <img
                        src={`${BACKEND_URL}/uploads/${p.images[0]}`}
                        alt={p.name}
                        className="w-full h-40 object-cover rounded-md border"
                      />
                    )}
                    <h2 className="mt-3 font-semibold text-lg">{p.name}</h2>
                  </Link>

                  <p className="text-gray-500 text-sm">{p.categoryName || p.category?.name}</p>

                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-medium">{p.rating || 4.5}</span>
                    <span className="ml-1 text-gray-400">({p.reviews?.length || 10})</span>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg font-bold">
                      ₹{p.price} {p.unit ? `/${p.unit}` : ""}
                    </p>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                      >
                        <FaShoppingCart />
                        Add
                      </button>
                    ) : (
                      <div className="mt-2 flex items-center justify-center gap-3">
                        <button
                          onClick={() => updateCartItem(cartItems.find(i => i.product_id === id)._id, qty - 1)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                        >
                          −
                        </button>
                        <span className="font-semibold">{qty}</span>
                        <button
                          onClick={() => updateCartItem(cartItems.find(i => i.product_id === id)._id, qty + 1)}
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
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No products found.</p>
        )}
      </div>
    </div>
  );
}
