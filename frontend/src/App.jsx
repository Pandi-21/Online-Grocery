// // App.jsx or AppWrapper.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

// import Home from "./Pages/Home";
// import Shop from "./Pages/Shop";
// import About from "./Pages/About";
// import UserLayout from "./layout/UserLayout";
// import ProductList from "./Components/Product/ProductList";
// import ProductDetails from "./Components/Product/ProductDetails";
// import CheckoutPage from "./Pages/CheckoutPage";
// import CartPage from "./Pages/CartPage";
// import Signup from "./Pages/Signup";
// import Login from "./Pages/Login";
// import AccountPage from "./Components/AccountPage";
// import AdminRoutes from "./admin/AdminRoutes";
// import DealsProduct from "./Components/DealsProduct";
// import DealsSection from "./Components/DealsSection";
// import DealsPage from "./Pages/Deals";
// import RecipeDetail from "./Components/Receipes/RecipeDetail";
// import RecipesPage from "./Components/Receipes/RecipesPage";
// import OurStory from "./Components/About/OurStory";
// import ContactUs from "./Components/About/ContactUs";
// import Sustainability from "./Components/About/Sustainability";
// import Careers from "./Components/About/Careers";
// import FAQSupport from "./Components/About/FAQSupport";
// import OrdersPage from "./Components/OrdersPage";

// import ProtectedRoute from "./Components/ProtectedRoute";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import { CartProvider } from "./context/CartContext";
// import { OrdersProvider } from "./context/OrdersContext";

// // ---------------- AppInner ----------------
// function AppInner() {
//   const { user } = useAuth(); // safe inside AuthProvider

//   return (
//     <CartProvider>
//       <OrdersProvider>
//         <Routes>
//           <Route element={<UserLayout />}>
//             {/* Home & Shop */}
//             <Route path="/" element={<Home />} />
//             <Route path="/shop" element={<Shop />} />
//             <Route path="/shop/:subcategory/:item" element={<ProductList />} />
//             <Route path="/shop/:subcategory/:item/:productSlug" element={<ProductDetails />} />

//             {/* Deals */}
//             <Route path="/deals" element={<DealsPage />} />
//             <Route path="/deals/:sectionName" element={<DealsSection />} />
//             <Route path="/deals/product/:id" element={<DealsProduct />} />

//             {/* Recipes */}
//             <Route path="/recipes/:categorySlug" element={<RecipesPage />} />
//             <Route path="/recipes/:categorySlug/:recipeSlug" element={<RecipeDetail />} />

//             {/* About */}
//             <Route path="/about" element={<About />} />
//             <Route path="/about/our-story" element={<OurStory />} />
//             <Route path="/about/contact" element={<ContactUs />} />
//             <Route path="/about/sustainability" element={<Sustainability />} />
//             <Route path="/about/careers" element={<Careers />} />
//             <Route path="/about/faq" element={<FAQSupport />} />

//             {/* Protected pages */}
//             <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
//             <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
//             <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
//             <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

//             {/* Auth */}
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />

//             {/* Fallback */}
//             <Route path="*" element={<h1>Page Not Found</h1>} />
//           </Route>

//           {/* Admin */}
//           <Route path="/admin/*" element={<AdminRoutes />} />
//           <Route path="/dashboard" element={<AdminRoutes />} />
//         </Routes>
//       </OrdersProvider>
//       <Toaster position="bottom-center" />
//     </CartProvider>
//   );
// }

// // ---------------- AppWrapper ----------------
// export default function AppWrapper() {
//   return (
//     <AuthProvider>
//       <AppInner />
//     </AuthProvider>
//   );
// }
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
import OrdersPage from "./Components/OrdersPage";

import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";

// 🆕 Admin
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import { AdminAuthProvider } from "./context/AdminAuthContext";

function AppInner() {
  const { user } = useAuth(); // normal user auth

  return (
    <CartProvider>
      <OrdersProvider>
        <Routes>
          {/* ==================== USER SIDE ==================== */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:subcategory/:item" element={<ProductList />} />
            <Route path="/shop/:subcategory/:item/:productSlug" element={<ProductDetails />} />

            <Route path="/deals" element={<DealsPage />} />
            <Route path="/deals/:sectionName" element={<DealsSection />} />
            <Route path="/deals/product/:id" element={<DealsProduct />} />

            <Route path="/recipes/:categorySlug" element={<RecipesPage />} />
            <Route path="/recipes/:categorySlug/:recipeSlug" element={<RecipeDetail />} />

            <Route path="/about" element={<About />} />
            <Route path="/about/our-story" element={<OurStory />} />
            <Route path="/about/contact" element={<ContactUs />} />
            <Route path="/about/sustainability" element={<Sustainability />} />
            <Route path="/about/careers" element={<Careers />} />
            <Route path="/about/faq" element={<FAQSupport />} />

            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Route>

          {/* ==================== ADMIN SIDE ==================== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminRoutes />
              </AdminProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="bottom-center" />
      </OrdersProvider>
    </CartProvider>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <AppInner />
      </AdminAuthProvider>
    </AuthProvider>
  );
}
