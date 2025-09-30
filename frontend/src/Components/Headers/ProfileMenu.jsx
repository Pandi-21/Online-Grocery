import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileMenu({ user, menuOpen, setMenuOpen }) {
  const { logout } = useAuth();

  if (!menuOpen) return null;

  return (
    <div className="relative profile-menu-container">
      <button
        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {user ? (
          <span className="text-sm font-medium">
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        ) : (
          <span>👤</span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-4 z-50">
        {user ? (
          <>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <hr className="my-3" />
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
    </div>
  );
}