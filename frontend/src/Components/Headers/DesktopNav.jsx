import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function DesktopNav({ categories, recipeItems }) {
  const [shopOpen, setShopOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  const [shopTimer, setShopTimer] = useState(null);
  const [recipesTimer, setRecipesTimer] = useState(null);
  const [aboutTimer, setAboutTimer] = useState(null);

  // Helper functions for desktop hover behavior
  const handleMouseEnter = (setter, timer, setTimer) => {
    if (timer) clearTimeout(timer);
    setter(true);
  };

  const handleMouseLeave = (setter, setTimer) => {
    const timer = setTimeout(() => setter(false), 300);
    setTimer(timer);
  };

  return (
    <nav className="hidden md:flex items-center gap-8 relative font-medium">
      {/* Shop Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter(setShopOpen, shopTimer, setShopTimer)}
        onMouseLeave={() => handleMouseLeave(setShopOpen, setShopTimer)}
      >
        <button className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200">
          Shop <ChevronDown className={`w-4 h-4 transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
        </button>

        {shopOpen && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-xl p-6 grid grid-cols-4 gap-8 min-w-[700px] z-50 border"
            onMouseEnter={() => handleMouseEnter(setShopOpen, shopTimer, setShopTimer)}
            onMouseLeave={() => handleMouseLeave(setShopOpen, setShopTimer)}
          >
            {categories.length > 0 ? (
              categories
                .filter(cat => cat.slug !== "recipes")
                .map((cat, catIndex) => (
                  <div key={cat.slug || cat._id || catIndex}>
                    {cat.subcategories?.map((sub, subIndex) => (
                      <div key={sub.slug || sub._id || subIndex} className="mb-3">
                        <h4 className="text-gray-700 font-medium mb-2">{sub.name}</h4>
                        <ul className="space-y-1">
                          {sub.items?.map((item, itemIndex) => {
                            const subSlug = sub.slug || sub._id || "";
                            const itemSlug = item.slug || item._id || "";
                            return (
                              <li key={itemSlug || itemIndex}>
                                <Link
                                  to={`/shop/${subSlug}/${itemSlug}`}
                                  className="text-sm text-gray-500 hover:text-green-600 transition-colors duration-200 block py-1"
                                  onClick={() => setShopOpen(false)}
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
              <p className="text-gray-500">Loading categories…</p>
            )}
          </div>
        )}
      </div>

      {/* Deals */}
      <Link to="/deals" className="hover:text-green-600 transition-colors duration-200">
        Deals
      </Link>

      {/* Recipes Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter(setRecipesOpen, recipesTimer, setRecipesTimer)}
        onMouseLeave={() => handleMouseLeave(setRecipesOpen, setRecipesTimer)}
      >
        <button className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200">
          Recipes <ChevronDown className={`w-4 h-4 transition-transform ${recipesOpen ? 'rotate-180' : ''}`} />
        </button>

        {recipesOpen && recipeItems.length > 0 && (
          <div 
            className="absolute top-full left-0 mt-2 w-60 bg-white shadow-lg border rounded-lg p-4 z-50"
            onMouseEnter={() => handleMouseEnter(setRecipesOpen, recipesTimer, setRecipesTimer)}
            onMouseLeave={() => handleMouseLeave(setRecipesOpen, setRecipesTimer)}
          >
            {recipeItems.map((sub) => (
              <Link
                key={sub._id}
                to={`/recipes/${sub.slug}`}
                className="block py-2 px-2 hover:text-green-600 transition-colors duration-200 rounded hover:bg-gray-50"
                onClick={() => setRecipesOpen(false)}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* About Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter(setAboutOpen, aboutTimer, setAboutTimer)}
        onMouseLeave={() => handleMouseLeave(setAboutOpen, setAboutTimer)}
      >
        <button className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200">
          About <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
        </button>

        {aboutOpen && (
          <div 
            className="absolute top-full left-0 mt-2 w-60 bg-white shadow-lg border rounded-lg p-4 z-50"
            onMouseEnter={() => handleMouseEnter(setAboutOpen, aboutTimer, setAboutTimer)}
            onMouseLeave={() => handleMouseLeave(setAboutOpen, setAboutTimer)}
          >
            <Link to="/about/our-story" className="block py-2 px-2 hover:text-green-600 transition-colors duration-200 rounded hover:bg-gray-50" onClick={() => setAboutOpen(false)}>
              Our Story
            </Link>
            <Link to="/about/contact" className="block py-2 px-2 hover:text-green-600 transition-colors duration-200 rounded hover:bg-gray-50" onClick={() => setAboutOpen(false)}>
              Contact Us
            </Link>
            <Link to="/about/sustainability" className="block py-2 px-2 hover:text-green-600 transition-colors duration-200 rounded hover:bg-gray-50" onClick={() => setAboutOpen(false)}>
              Sustainability
            </Link>
            <Link to="/about/careers" className="block py-2 px-2 hover:text-green-600 transition-colors duration-200 rounded hover:bg-gray-50" onClick={() => setAboutOpen(false)}>
              Careers
            </Link>
            <Link to="/about/faq" className="block py-2 px-2 hover:text-green-600 transition-colors duration-200 rounded hover:bg-gray-50" onClick={() => setAboutOpen(false)}>
              FAQ & Support
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}