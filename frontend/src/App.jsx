import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import About from "./Pages/About";
import UserLayout from "./layout/UserLayout";
import ProductList from "./Components/Product/ProductList";
import ProductDetails from "./Components/Product/ProductDetails"; 
import CheckoutPage from "./Pages/CheckoutPage";
import CartPage from "./Pages/CartPage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import AccountPage from "./Components/AccountPage";
import AdminRoutes from "./admin/AdminRoutes";
import DealsProduct from "./Components/DealsProduct";
import DealsSection from "./Components/DealsSection";
import DealsPage from "./Pages/Deals";
import RecipeDetail from "./Components/Receipes/RecipeDetail";
import RecipesPage from "./Components/Receipes/RecipesPage";
import OurStory from "./Components/About/OurStory";
import ContactUs from "./Components/About/ContactUs";
import Sustainability from "./Components/About/Sustainability";
import Careers from "./Components/About/Careers";
import FAQSupport from "./Components/About/FAQSupport";

import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// App inner component to use useAuth safely
function AppInner() {
  const { currentUser } = useAuth(); // ✅ safe here, inside AuthProvider

  return (
    <CartProvider userId={currentUser?._id}>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:subcategory/:item" element={<ProductList />} />
          <Route path="/shop/:subcategory/:item/:productSlug" element={<ProductDetails />} />

          {/* Deals */}
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/deals/:sectionName" element={<DealsSection />} />
          <Route path="/deals/product/:id" element={<DealsProduct />} />

          {/* Recipes */}
          <Route path="/recipes/:categorySlug" element={<RecipesPage />} />
          <Route path="/recipes/:categorySlug/:recipeSlug" element={<RecipeDetail />} />

          {/* About */}
          <Route path="/about" element={<About />} />
          <Route path="/about/our-story" element={<OurStory />} />
          <Route path="/about/contact" element={<ContactUs />} />
          <Route path="/about/sustainability" element={<Sustainability />} />
          <Route path="/about/careers" element={<Careers />} />
          <Route path="/about/faq" element={<FAQSupport />} />

          {/* Protected pages */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/dashboard" element={<AdminRoutes />} />
      </Routes>

      <Toaster position="bottom-center" />
    </CartProvider>
  );
}

// Wrapper to ensure AuthProvider wraps everything
export default function AppWrapper() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
