import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProtectedRoute({ children }) {
  const { admin } = useAdminAuth();
  return admin ? children : <Navigate to="/admin/login" />;
}
