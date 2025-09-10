import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="font-bold text-white">FreshMart</span>
          </div>
          <p className="text-sm">Your daily dose of fresh.</p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">Shop</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Categories</a></li>
            <li><a href="#">Top Deals</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">About</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-8">
        © 2023 FreshMart. All rights reserved.
      </p>
    </footer>
  );
}
