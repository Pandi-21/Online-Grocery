import React, { useState } from "react";
import { ShoppingCart, Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [shopOpen, setShopOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="relative flex justify-between items-center px-6 py-10 bg-white shadow">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-green-500 rounded"></div>
        <Link to="/" className="text-xl font-bold">FreshMart</Link>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-6 font-medium relative">
        {/* Shop */}
        <div className="relative">
          <button
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
            className="flex items-center space-x-1 hover:text-green-600"
          >
            <span>Shop</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {shopOpen && (
           <div
  onMouseEnter={() => setShopOpen(true)}
  onMouseLeave={() => setShopOpen(false)}
  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[900px] bg-white shadow-lg border rounded p-4 grid grid-cols-4 gap-8 z-50"
>

              <div>
                <h3 className="font-semibold text-green-600 mb-2">Fruits & Vegetables</h3>
                <Link to="/shop/fresh-fruits" className="block py-1 hover:text-green-600">Fresh Fruits</Link>
                <Link to="/shop/fresh-vegetables" className="block py-1 hover:text-green-600">Fresh Vegetables</Link>
                <Link to="/shop/organic-produce" className="block py-1 hover:text-green-600">Organic Produce</Link>
                <Link to="/shop/exotic-fruits" className="block py-1 hover:text-green-600">Exotic Fruits</Link>
                <Link to="/shop/seasonal-picks" className="block py-1 hover:text-green-600">Seasonal Picks</Link>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Dairy & Bakery</h3>
                <Link to="/shop/milk" className="block py-1 hover:text-green-600">Milk, Curd & Paneer</Link>
                <Link to="/shop/cheese" className="block py-1 hover:text-green-600">Cheese & Butter</Link>
                <Link to="/shop/bread" className="block py-1 hover:text-green-600">Breads & Buns</Link>
                <Link to="/shop/cakes" className="block py-1 hover:text-green-600">Cakes & Pastries</Link>
                <Link to="/shop/eggs" className="block py-1 hover:text-green-600">Eggs</Link>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Grocery & Staples</h3>
                <Link to="/shop/atta-rice" className="block py-1 hover:text-green-600">Atta, Rice & Dal</Link>
                <Link to="/shop/oils-ghee" className="block py-1 hover:text-green-600">Edible Oils & Ghee</Link>
                <Link to="/shop/spices" className="block py-1 hover:text-green-600">Masala & Spices</Link>
                <Link to="/shop/sugar" className="block py-1 hover:text-green-600">Sugar, Salt & Jaggery</Link>
                <Link to="/shop/dry-fruits" className="block py-1 hover:text-green-600">Dry Fruits & Nuts</Link>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Snacks & Beverages</h3>
                <Link to="/shop/chips" className="block py-1 hover:text-green-600">Chips & Namkeen</Link>
                <Link to="/shop/biscuits" className="block py-1 hover:text-green-600">Biscuits & Cookies</Link>
                <Link to="/shop/juices" className="block py-1 hover:text-green-600">Juices & Soft Drinks</Link>
                <Link to="/shop/tea-coffee" className="block py-1 hover:text-green-600">Tea & Coffee</Link>
                <Link to="/shop/instant-foods" className="block py-1 hover:text-green-600">Instant Foods</Link>
              </div>
            </div>
          )}
        </div>

        {/* Deals */}
        <div className="relative">
          <button
            onMouseEnter={() => setDealsOpen(true)}
            onMouseLeave={() => setDealsOpen(false)}
            className="flex items-center space-x-1 hover:text-green-600"
          >
            <span>Deals</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {dealsOpen && (
            <div
              onMouseEnter={() => setDealsOpen(true)}
              onMouseLeave={() => setDealsOpen(false)}
              className="absolute top-full left-0 mt-2 w-60 bg-white shadow-lg border rounded p-4 z-50"
            >
              <Link to="/deals/today" className="block py-1 hover:text-green-600">Today's Deals</Link>
              <Link to="/deals/top-offers" className="block py-1 hover:text-green-600">Top Offers</Link>
              <Link to="/deals/b1g1" className="block py-1 hover:text-green-600">Buy 1 Get 1</Link>
              <Link to="/deals/seasonal-sales" className="block py-1 hover:text-green-600">Seasonal Sales</Link>
              <Link to="/deals/membership" className="block py-1 hover:text-green-600">Membership / Loyalty Deals</Link>
            </div>
          )}
        </div>

        {/* Recipes */}
        <div className="relative">
          <button
            onMouseEnter={() => setRecipesOpen(true)}
            onMouseLeave={() => setRecipesOpen(false)}
            className="flex items-center space-x-1 hover:text-green-600"
          >
            <span>Recipes</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {recipesOpen && (
            <div
              onMouseEnter={() => setRecipesOpen(true)}
              onMouseLeave={() => setRecipesOpen(false)}
              className="absolute top-full left-0 mt-2 w-60 bg-white shadow-lg border rounded p-4 z-50"
            >
              <Link to="/recipes/quick-easy" className="block py-1 hover:text-green-600">Quick & Easy</Link>
              <Link to="/recipes/healthy" className="block py-1 hover:text-green-600">Healthy Choices</Link>
              <Link to="/recipes/breakfast" className="block py-1 hover:text-green-600">Breakfast Ideas</Link>
              <Link to="/recipes/lunch-dinner" className="block py-1 hover:text-green-600">Lunch & Dinner</Link>
              <Link to="/recipes/desserts-drinks" className="block py-1 hover:text-green-600">Desserts & Drinks</Link>
            </div>
          )}
        </div>

        {/* About */}
        <div className="relative">
          <button
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
            className="flex items-center space-x-1 hover:text-green-600"
          >
            <span>About</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {aboutOpen && (
            <div
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
              className="absolute top-full left-0 mt-2 w-60 bg-white shadow-lg border rounded p-4 z-50"
            >
              <Link to="/about/our-story" className="block py-1 hover:text-green-600">Our Story</Link>
              <Link to="/about/contact" className="block py-1 hover:text-green-600">Contact Us</Link>
              <Link to="/about/sustainability" className="block py-1 hover:text-green-600">Sustainability / Eco-Friendly</Link>
              <Link to="/about/careers" className="block py-1 hover:text-green-600">Careers</Link>
              <Link to="/about/faq" className="block py-1 hover:text-green-600">FAQ & Support</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Search & Cart */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full pl-8 pr-4 py-1 text-sm focus:outline-none"
          />
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
        </div>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </header>
  );
}
