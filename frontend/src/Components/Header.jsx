import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../admin/api/api"; // axios instance

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [shopOpen, setShopOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <header className="border-b bg-white shadow">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span className="text-xl font-bold">FreshMart</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 relative font-medium">
          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-green-600">
              Shop <ChevronDown className="w-4 h-4" />
            </button>

            {shopOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-xl p-6 grid grid-cols-3 gap-8 min-w-[800px] z-50">
                {categories.length > 0 ? (
                  categories.map((cat, catIndex) => (
                    <div key={cat.slug || cat._id || catIndex}>
                      {cat.subcategories?.map((sub, subIndex) => (
                        <div
                          key={sub.slug || sub._id || subIndex}
                          className="mb-3"
                        >
                          <h4 className="text-gray-700 font-medium">
                            {sub.name}
                          </h4>
                          <ul className="mt-1 space-y-1">
                            {sub.items?.map((item, itemIndex) => {
                              const catSlug = cat.slug || cat._id || "";
                              const subSlug = sub.slug || sub._id || "";
                              const itemSlug = item.slug || item._id || "";

                              return (
                                <li key={itemSlug || itemIndex}>
                                 <Link
  // This matches your route:
  // /shop/:subcategorySlug/:itemSlug
  to={`/shop/${subSlug}/${itemSlug}`}
  className="text-sm text-gray-500 hover:text-green-600"
>
  {item.name}
</Link>

                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p>Loading categories…</p>
                )}
              </div>
            )}
          </div>

          {/* Deals */}
          <Link to="/deals" className="hover:text-green-600">
            Deals
          </Link>

          {/* Recipes Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setRecipesOpen(true)}
            onMouseLeave={() => setRecipesOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-green-600">
              Recipes <ChevronDown className="w-4 h-4" />
            </button>
            {recipesOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-white shadow-lg border rounded p-4 z-50">
                <Link
                  to="/recipes/quick-easy"
                  className="block py-1 hover:text-green-600"
                >
                  Quick & Easy
                </Link>
                <Link
                  to="/recipes/healthy"
                  className="block py-1 hover:text-green-600"
                >
                  Healthy Choices
                </Link>
                <Link
                  to="/recipes/breakfast"
                  className="block py-1 hover:text-green-600"
                >
                  Breakfast Ideas
                </Link>
                <Link
                  to="/recipes/lunch-dinner"
                  className="block py-1 hover:text-green-600"
                >
                  Lunch & Dinner
                </Link>
                <Link
                  to="/recipes/desserts-drinks"
                  className="block py-1 hover:text-green-600"
                >
                  Desserts & Drinks
                </Link>
              </div>
            )}
          </div>

          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-green-600">
              About <ChevronDown className="w-4 h-4" />
            </button>
            {aboutOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-white shadow-lg border rounded p-4 z-50">
                <Link
                  to="/about/our-story"
                  className="block py-1 hover:text-green-600"
                >
                  Our Story
                </Link>
                <Link
                  to="/about/contact"
                  className="block py-1 hover:text-green-600"
                >
                  Contact Us
                </Link>
                <Link
                  to="/about/sustainability"
                  className="block py-1 hover:text-green-600"
                >
                  Sustainability
                </Link>
                <Link
                  to="/about/careers"
                  className="block py-1 hover:text-green-600"
                >
                  Careers
                </Link>
                <Link
                  to="/about/faq"
                  className="block py-1 hover:text-green-600"
                >
                  FAQ & Support
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Search, Cart, Profile */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full pl-8 pr-4 py-1 text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
          </div>

          {/* Cart */}
          <Link to="/cart">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
          </Link>

          {/* Profile */}
          <div className="relative">
            <button
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              👤
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-4 z-50">
                {user ? (
                  <>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <hr className="my-2" />
                    <Link
                      to="/account"
                      className="block py-2 text-sm text-gray-700 hover:text-green-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 text-sm text-gray-700 hover:text-green-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block py-2 text-sm text-gray-700 hover:text-green-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
