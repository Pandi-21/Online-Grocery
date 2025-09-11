import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./Products/ProductList";
import ProductForm from "./Products/ProductForm";
import CategoryForm from "./Categories/CategoryForm";
import CategoryList from "./Categories/CategoryList";
import OrderList from "./Orders/OrderList";
import OrderDetail from "./Orders/OrderDetails";
import CouponForm from "./Coupons/CouponForm";
import CouponList from "./Coupons/CouponList";
import UserList from "./Users/UserList";
import UserForm from "./Users/UserForm";
 
import ReportPage from "./Reports/ReportPage";

export default function AdminRoutes() {
  return (
     
      <Routes>
        <Route element={<AdminLayout />}> 
        <Route index element={<Dashboard />} />
         <Route path="products" element={<ProductList />} />
         <Route path="products/new" element={<ProductForm />} />
         <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="categories" element={<CategoryList />} />
    <Route path="categories/new" element={<CategoryForm />} />
    <Route path="categories/edit/:id" element={<CategoryForm />} />
       <Route path="orders" element={<OrderList />} />
    <Route path="orders/:id" element={<OrderDetail />} />
    {/* Coupons */}
    <Route path="coupons" element={<CouponList />} />
    <Route path="coupons/new" element={<CouponForm />} />
    <Route path="coupons/edit/:id" element={<CouponForm />} />
   
<Route path="users" element={<UserList />} />
<Route path="users/new" element={<UserForm />} />
<Route path="users/edit/:id" element={<UserForm />} />

<Route path="reports" element={<ReportPage />} />
         
        </Route>
      </Routes>
   
  );
}



 