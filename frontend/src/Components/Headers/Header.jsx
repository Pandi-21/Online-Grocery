import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API as api } from "../../admin/api/api";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import HeaderRight from "./HeaderRight";
import { Link } from "react-router-dom";


export default function Header() {
  const [categories, setCategories] = useState([]);
  const [recipeItems, setRecipeItems] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const { user } = useAuth();

  // Fetch categories
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err));
  }, []);

  // Fetch Recipes subcategories
  useEffect(() => {
    api
      .get("/subcategories?category=recipes")
      .then((res) => setRecipeItems(res.data))
      .catch((err) => console.error("Error fetching recipe subcategories", err));
  }, []);

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  return (
    <header className="border-b bg-white shadow sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
  <img
    src="/fresh.jpg"      // replace with your logo path
    alt="FreshMart Logo"
    className="w-20 h-26 object-contain"
  />
  <span className="text-xl font-bold">FreshMart</span>
</Link>


        {/* Desktop Navigation */}
        <DesktopNav 
          categories={categories} 
          recipeItems={recipeItems} 
        />

        {/* Right Section: Search, Cart, Profile */}
        <HeaderRight 
          user={user}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        open={mobileNavOpen}
        onClose={closeMobileNav}
        categories={categories}
        recipeItems={recipeItems}
        user={user}
      />
    </header>
  );
}