import React from "react";
import { Link } from "react-router-dom";

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
            <li><Link to="/shop/fruits-vegetables/fresh-fruits">Fruits & Vegetables</Link></li>
            <li><a href="#">Diary & Bakery</a></li>
            <li><a href="#">Snacks & Beverages</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">About</h3>
          <ul className="space-y-1 text-sm">
            <li>  <Link to="/about/our-story">Our Story</Link></li>
            <li>  <Link to="/about/careers">Careers</Link></li>
            <li>  <Link to="/about/contact">Contact Us</Link></li>

            
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li>  <Link to="/about/faq">Privacy Policy</Link></li>
            <li>  <Link to="/about/faq">Terms of Service</Link></li>

            
          </ul>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-8">
        © 2023 FreshMart. All rights reserved.
      </p>
    </footer>
  );
}
