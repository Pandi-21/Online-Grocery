import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [shopOpen, setShopOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <header className="relative flex justify-between items-center px-6 py-6 bg-white shadow">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-green-500 rounded"></div>
        <Link to="/" className="text-xl font-bold">
          FreshMart
        </Link>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-6 font-medium relative">
        {/* Shop */}
        <div
          className="relative"
          onMouseEnter={() => setShopOpen(true)}
          onMouseLeave={() => setShopOpen(false)}
        >
          <Link to="/shop" className="flex items-center space-x-1 hover:text-green-600">
            <span>Shop</span>
            <ChevronDown className="w-4 h-4" />
          </Link>

          {shopOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white shadow-lg border rounded p-4 grid grid-cols-4 gap-8 z-50">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Fruits & Vegetables</h3>
                <Link to="/productlist/fresh-fruits" className="block py-1 hover:text-green-600">Fresh Fruits</Link>
                <Link to="/productlist/fresh-vegetables" className="block py-1 hover:text-green-600">Fresh Vegetables</Link>
                <Link to="/productlist/organic-produce" className="block py-1 hover:text-green-600">Organic Produce</Link>
                <Link to="/productlist/exotic-fruits" className="block py-1 hover:text-green-600">Exotic Fruits</Link>
                <Link to="/productlist/seasonal-picks" className="block py-1 hover:text-green-600">Seasonal Picks</Link>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Dairy & Bakery</h3>
                <Link to="/productlist/milk" className="block py-1 hover:text-green-600">Milk, Curd & Paneer</Link>
                <Link to="/productlist/cheese" className="block py-1 hover:text-green-600">Cheese & Butter</Link>
                <Link to="/productlist/bread" className="block py-1 hover:text-green-600">Breads & Buns</Link>
                <Link to="/productlist/cakes" className="block py-1 hover:text-green-600">Cakes & Pastries</Link>
                <Link to="/productlist/eggs" className="block py-1 hover:text-green-600">Eggs</Link>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Grocery & Staples</h3>
                <Link to="/productlist/atta-rice" className="block py-1 hover:text-green-600">Atta, Rice & Dal</Link>
                <Link to="/productlist/oils-ghee" className="block py-1 hover:text-green-600">Edible Oils & Ghee</Link>
                <Link to="/productlist/spices" className="block py-1 hover:text-green-600">Masala & Spices</Link>
                <Link to="/productlist/sugar" className="block py-1 hover:text-green-600">Sugar, Salt & Jaggery</Link>
                <Link to="/productlist/dry-fruits" className="block py-1 hover:text-green-600">Dry Fruits & Nuts</Link>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Snacks & Beverages</h3>
                <Link to="/productlist/chips" className="block py-1 hover:text-green-600">Chips & Namkeen</Link>
                <Link to="/productlist/biscuits" className="block py-1 hover:text-green-600">Biscuits & Cookies</Link>
                <Link to="/productlist/juices" className="block py-1 hover:text-green-600">Juices & Soft Drinks</Link>
                <Link to="/productlist/tea-coffee" className="block py-1 hover:text-green-600">Tea & Coffee</Link>
                <Link to="/productlist/instant-foods" className="block py-1 hover:text-green-600">Instant Foods</Link>
              </div>
            </div>
          )}
        </div>

        {/* Deals */}
        <div
          className="relative"
          onMouseEnter={() => setDealsOpen(true)}
          onMouseLeave={() => setDealsOpen(false)}
        >
          <Link to="/deals" className="flex items-center space-x-1 hover:text-green-600">
            <span>Deals</span>
            <ChevronDown className="w-4 h-4" />
          </Link>
          {dealsOpen && (
            <div className="absolute top-full left-0 w-60 bg-white shadow-lg border rounded p-4 z-50">
              <Link to="/deals/today" className="block py-1 hover:text-green-600">Today's Deals</Link>
              <Link to="/deals/top" className="block py-1 hover:text-green-600">Top Offers</Link>
              <Link to="/deals/buy1get1" className="block py-1 hover:text-green-600">Buy 1 Get 1</Link>
              <Link to="/deals/seasonal" className="block py-1 hover:text-green-600">Seasonal Sales</Link>
              <Link to="/deals/membership" className="block py-1 hover:text-green-600">Membership / Loyalty Deals</Link>
            </div>
          )}
        </div>

        {/* Recipes */}
        <div
          className="relative"
          onMouseEnter={() => setRecipesOpen(true)}
          onMouseLeave={() => setRecipesOpen(false)}
        >
          <Link to="/recipes" className="flex items-center space-x-1 hover:text-green-600">
            <span>Recipes</span>
            <ChevronDown className="w-4 h-4" />
          </Link>
          {recipesOpen && (
            <div className="absolute top-full left-0 w-60 bg-white shadow-lg border rounded p-4 z-50">
              <Link to="/recipes/quick-easy" className="block py-1 hover:text-green-600">Quick & Easy</Link>
              <Link to="/recipes/healthy" className="block py-1 hover:text-green-600">Healthy Choices</Link>
              <Link to="/recipes/breakfast" className="block py-1 hover:text-green-600">Breakfast Ideas</Link>
              <Link to="/recipes/lunch-dinner" className="block py-1 hover:text-green-600">Lunch & Dinner</Link>
              <Link to="/recipes/desserts-drinks" className="block py-1 hover:text-green-600">Desserts & Drinks</Link>
            </div>
          )}
        </div>

        {/* About */}
        <div
          className="relative"
          onMouseEnter={() => setAboutOpen(true)}
          onMouseLeave={() => setAboutOpen(false)}
        >
          <Link to="/about" className="flex items-center space-x-1 hover:text-green-600">
            <span>About</span>
            <ChevronDown className="w-4 h-4" />
          </Link>
          {aboutOpen && (
            <div className="absolute top-full left-0 w-60 bg-white shadow-lg border rounded p-4 z-50">
              <Link to="/about/our-story" className="block py-1 hover:text-green-600">Our Story</Link>
              <Link to="/about/contact" className="block py-1 hover:text-green-600">Contact Us</Link>
              <Link to="/about/sustainability" className="block py-1 hover:text-green-600">Sustainability / Eco-Friendly</Link>
              <Link to="/about/careers" className="block py-1 hover:text-green-600">Careers</Link>
              <Link to="/about/faq" className="block py-1 hover:text-green-600">FAQ & Support</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Search, Cart & Profile */}
      <div className="flex items-center space-x-4">
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

        {/* Profile Icon + Dropdown */}
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
    </header>
  );
}
