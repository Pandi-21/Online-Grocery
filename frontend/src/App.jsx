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
// import OfferDetail from "./Components/Deals/OfferDetail";
// import OfferList from "./Components/Deals/OfferList";

 

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AccountPage from "./Components/AccountPage";
import AdminRoutes from "./admin/AdminRoutes";
 
import OurStory from "./Components/About/OurStory";
import ContactUs from "./Components/About/ContactUs";
import Sustainability from "./Components/About/Sustainability";
import Careers from "./Components/About/Careers";
import FAQSupport from "./Components/About/FAQSupport";
import DealsProduct from "./Components/DealsProduct";
import DealsSection from "./Components/DealsSection";
import DealsPage from "./Pages/Deals";
 
 
import RecipeDetail from "./Components/Receipes/RecipeDetail";
 
import RecipesPage from "./Components/Receipes/RecipesPage";
 



export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Customer side routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
         <Route path="/shop/:subcategorySlug/:itemSlug" element={<ProductList />} />
<Route path="/shop/:subcategory/:item?/:productSlug" element={<ProductDetails />} />

 

          {/* Deals routes */}
          {/* <Route path="/deals/today" element={<OfferList type="todaysDeals" />} />
          <Route path="/deals/top" element={<OfferList type="topOffers" />} />
          <Route path="/deals/buy1get1" element={<OfferList type="buy1get1" />} />
          <Route path="/deals/seasonal" element={<OfferList type="seasonalSales" />} />
          <Route path="/deals/membership" element={<OfferList type="membership" />} />
          <Route path="/deals" element={<Deals />} /> 
          <Route path="/offer/:type/:id" element={<OfferDetail />} /> */}
          <Route path= "/deals" element={<DealsPage />} />
          <Route path="/deals/:sectionName" element={<DealsSection />} />
          <Route path="/deals/product/:id" element={<DealsProduct />} />


{/* 
           <Route path="/recipes" element={<RecipesPage />} />
<Route path="/recipes/category/:slug" element={<RecipesPage />} />
<Route path="/recipes/detail/:slug" element={<RecipeDetailPage />} /> */}
<Route path="/recipes/:categorySlug" element={<RecipesPage />} />
        
        {/* Recipe detail */}
        <Route path="/recipes/:categorySlug/:recipeSlug" element={<RecipeDetail />} />



          <Route path="/about" element={<About />} />
          <Route path="/about/our-story" element={<OurStory />} />
          <Route path="/about/contact" element={<ContactUs />} />
          <Route path="/about/sustainability" element={<Sustainability />} />
          <Route path="/about/careers" element={<Careers />} />
          <Route path="/about/faq" element={<FAQSupport />} />


          <Route path="/checkout" element={ <ProtectedRoute><CheckoutPage /></ProtectedRoute>}/>
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>}/>
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
