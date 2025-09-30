import React, { useState } from "react";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function MobileNav({ open, onClose, categories, recipeItems, user }) {
  const [shopOpen, setShopOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  const { logout } = useAuth();

  if (!open) return null;

  const handleLinkClick = () => {
    onClose();
    setShopOpen(false);
    setRecipesOpen(false);
    setAboutOpen(false);
  };

  return (
    <div className="md:hidden bg-white border-t shadow-lg">
      {/* Mobile Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
          />
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Shop Accordion */}
      <div className="border-b">
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-900"
          onClick={() => setShopOpen(!shopOpen)}
        >
          Shop
          <ChevronDown className={`w-4 h-4 transition-transform ${shopOpen ? "rotate-180" : ""}`} />
        </button>
        
        {shopOpen && (
          <div className="pl-6 pb-3 space-y-2 bg-gray-50">
            {categories
              .filter(cat => cat.slug !== "recipes")
              .map((cat, catIndex) =>
                cat.subcategories?.map((sub, subIndex) =>
                  sub.items?.map((item, itemIndex) => {
                    const subSlug = sub.slug || sub._id || "";
                    const itemSlug = item.slug || item._id || "";
                    return (
                      <Link
                        key={itemSlug || itemIndex}
                        to={`/shop/${subSlug}/${itemSlug}`}
                        className="block text-sm py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded hover:bg-white"
                        onClick={handleLinkClick}
                      >
                        {item.name}
                      </Link>
                    );
                  })
                )
              )}
          </div>
        )}
      </div>

      {/* Deals */}
      <Link
        to="/deals"
        className="block px-4 py-3 border-b font-medium text-gray-900 hover:text-green-600 transition-colors duration-200"
        onClick={handleLinkClick}
      >
        Deals
      </Link>

      {/* Recipes Accordion */}
      <div className="border-b">
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-900"
          onClick={() => setRecipesOpen(!recipesOpen)}
        >
          Recipes
          <ChevronDown className={`w-4 h-4 transition-transform ${recipesOpen ? "rotate-180" : ""}`} />
        </button>
        
        {recipesOpen && (
          <div className="pl-6 pb-3 space-y-2 bg-gray-50">
            {recipeItems.map((sub) => (
              <Link
                key={sub._id}
                to={`/recipes/${sub.slug}`}
                className="block text-sm py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded hover:bg-white"
                onClick={handleLinkClick}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* About Accordion */}
      <div className="border-b">
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-900"
          onClick={() => setAboutOpen(!aboutOpen)}
        >
          About
          <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
        </button>
        
        {aboutOpen && (
          <div className="pl-6 pb-3 space-y-2 bg-gray-50">
            <Link to="/about/our-story" className="block text-sm py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded hover:bg-white" onClick={handleLinkClick}>
              Our Story
            </Link>
            <Link to="/about/contact" className="block text-sm py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded hover:bg-white" onClick={handleLinkClick}>
              Contact Us
            </Link>
            <Link to="/about/sustainability" className="block text-sm py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded hover:bg-white" onClick={handleLinkClick}>
              Sustainability
            </Link>
            <Link to="/about/careers" className="block text-sm py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded hover:bg-white" onClick={handleLinkClick}>
              Careers
            </Link>
            <Link to="/about/faq" className="block text-sm py-2 px-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded hover:bg-white" onClick={handleLinkClick}>
              FAQ & Support
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Auth Links */}
      <div className="p-4 border-t">
        {user ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-medium">{user.name}</p>
            <div className="flex gap-2 mt-3">
              <Link
                to="/account"
                className="flex-1 text-center py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                onClick={handleLinkClick}
              >
                Account
              </Link>
              <button
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="flex-1 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="flex-1 text-center py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
              onClick={handleLinkClick}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center py-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors duration-200"
              onClick={handleLinkClick}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}