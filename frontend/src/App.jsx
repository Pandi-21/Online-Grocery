import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Deals from "./Pages/Deals";
import Recipes from "./Pages/Recipes";
import About from "./Pages/About";
import UserLayout from "./layout/UserLayout";
import ProductList from "./Pages/ProductList"; 
import ProductDetails from "./Pages/ProductDetails";
import CheckoutPage from "./Pages/CheckoutPage";
import CartPage from "./Pages/CartPage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";

import OfferList from './Components/OfferList';

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AccountPage from "./Components/AccountPage";
import AdminRoutes from "./admin/AdminRoutes";
import OfferDetail from "./Components/OfferDetail";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Customer side routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/productlist/:category" element={<ProductList />} />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          {/* Deals routes */}
        <Route path="/deals/today" element={<OfferList type="todaysDeals" />} />
<Route path="/deals/top" element={<OfferList type="topOffers" />} />
<Route path="/deals/buy1get1" element={<OfferList type="buy1get1" />} />
<Route path="/deals/seasonal" element={<OfferList type="seasonalSales" />} />
<Route path="/deals/membership" element={<OfferList type="membership" />} />
          <Route path="/deals" element={<Deals />} /> 
<Route path="/offer/:type/:id" element={<OfferDetail />} />



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

        {/* Admin panel routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/dashboard" element={<AdminRoutes />} />
      </Routes>

      {/* Toaster notifications */}
      <Toaster position="bottom-center" />
    </AuthProvider>
  );
}
