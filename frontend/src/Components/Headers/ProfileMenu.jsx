import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown } from "lucide-react";

export default function ProfileMenu({ user }) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative profile-menu-container">
      {/* Profile Button */}
      <button
        className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {user ? (
          <span className="text-sm font-medium">
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase() ||
              "U"}
          </span>
        ) : (
          <span>👤</span>
        )}
      </button>

      {/* Dropdown (for both Desktop & Mobile) */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-4 z-50 sm:w-60 sm:right-0">
          {user ? (
            <>
              {/* User Info */}
              <div className="pb-2 border-b">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>

              {/* Links */}
              <div className="mt-2 space-y-1">
                <Link
                  to="/account"
                  className="block py-2 text-sm text-gray-700 hover:text-green-600 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="block py-2 text-sm text-gray-700 hover:text-green-600 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm text-red-600 hover:bg-red-50 rounded px-2 transition-colors duration-200 mt-2"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 text-sm text-gray-700 hover:text-green-600 transition-colors duration-200 rounded px-2 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block py-2 text-sm text-gray-700 hover:text-green-600 transition-colors duration-200 rounded px-2 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
