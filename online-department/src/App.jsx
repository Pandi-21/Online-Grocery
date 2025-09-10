import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Deals from "./Pages/Deals";
import Recipes from "./Pages/Recipes";
import About from "./Pages/About";
import UserLayout from "./layout/UserLayout";
import ShopPage from "./Pages/ShopPage";
import ProductDetails from "./Pages/ProductDetails";
 

export default function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path="/" element={<Home />} />
         <Route path="/shop/:category" element={<ShopPage />} />
         <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
