import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./Products/ProductList";
import ProductForm from "./Products/ProductForm";
 
 
 
  
import RecipesList from "./Receipes/RecipesList";
import RecipeForm from "./Receipes/RecipeForm";
import AdminOrders from "./Orders/AdminOrders";
import AdminOrderDetails from "./Orders/AdminOrderDetails";
import { OrdersProvider } from "../context/OrdersContext";
 

export default function AdminRoutes() {
  return (
     <OrdersProvider> 
      <Routes>
        <Route element={<AdminLayout />}> 
        <Route index element={<Dashboard />} />
         <Route path="products" element={<ProductList />} />
         <Route path="products/new" element={<ProductForm />} />
         <Route path="products/:id" element={<ProductForm />} />

         <Route path="recipes" element={<RecipesList />} />
        <Route path="recipes/new" element={<RecipeForm />} />
        <Route path="recipes/edit/:id" element={<RecipeForm />} />

        
        
          <Route path="orders" element={<AdminOrders />} />
      <Route path="orders/:id" element={<AdminOrderDetails />} />
          {/* Coupons */}
      
        
      
      {/* 
      <Route path="reports" element={<ReportPage />} /> */}
              
              </Route>
            </Routes>
            </OrdersProvider>
        
        );
      }



 