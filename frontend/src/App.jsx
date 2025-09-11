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
import CheckoutPage from "./Pages/CheckoutPage";
import CartPage from "./Pages/CartPage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AccountPage from "./Components/AccountPage";
import AdminRoutes from "./admin/AdminRoutes";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 👇 Customer side routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<ShopPage />} />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/deals" element={<Deals />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/account" element={<AccountPage />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>

        {/* 👇 Admin panel routes OUTSIDE UserLayout */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path ="/dashboard" element={<AdminRoutes />} />
      </Routes>
    </AuthProvider>
  );
}
