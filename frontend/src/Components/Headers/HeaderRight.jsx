import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { API as api } from "../../admin/api/api";

export default function HeaderRight({ user, mobileNavOpen, setMobileNavOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Close profile menu or search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results with debounce
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await api.get(`/products/search?q=${searchQuery}`);
        setSearchResults(res.data || []);
        setSearchOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSelect = (slug, subSlug, itemSlug) => {
    setSearchQuery("");
    setSearchOpen(false);
    navigate(`/shop/${subSlug}/${itemSlug}/${slug}`);
  };

  return (
    <div className="flex items-center gap-4 relative" ref={wrapperRef}>
      {/* Search */}
      <div className="relative hidden md:block w-64">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-full pl-8 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
          onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
        />
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />

        {/* Dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-50">
            {searchResults.map((p) => (
              <button
                key={p._id}
                onClick={() =>
                  handleSearchSelect(p.slug || p._id, p.subcategory_slug, p.item_slug)
                }
                className="w-full text-left px-4 py-2 hover:bg-green-100 flex justify-between items-center"
              >
                <span>{p.name}</span>
                <span className="text-gray-500 text-sm">₹{p.price}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
      <Link
        to="/cart"
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </Link>

      {/* Profile Menu */}
      <ProfileMenu user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}
