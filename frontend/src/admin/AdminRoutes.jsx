import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./Products/ProductList";
import ProductForm from "./Products/ProductForm";
 
import OrderList from "./Orders/OrderList";
import OrderDetail from "./Orders/OrderDetails";
import CouponForm from "./Coupons/CouponForm";
import CouponList from "./Coupons/CouponList";
 
 
import ReportPage from "./Reports/ReportPage";

export default function AdminRoutes() {
  return (
     
      <Routes>
        <Route element={<AdminLayout />}> 
        <Route index element={<Dashboard />} />
         <Route path="products" element={<ProductList />} />
         <Route path="products/new" element={<ProductForm />} />
         <Route path="products/edit/:id" element={<ProductForm />} />
        
       <Route path="orders" element={<OrderList />} />
    <Route path="orders/:id" element={<OrderDetail />} />
    {/* Coupons */}
    <Route path="coupons" element={<CouponList />} />
    <Route path="coupons/new" element={<CouponForm />} />
    <Route path="coupons/edit/:id" element={<CouponForm />} />
   
 

<Route path="reports" element={<ReportPage />} />
         
        </Route>
      </Routes>
   
  );
}



 