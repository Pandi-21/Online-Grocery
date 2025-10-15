import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component
 * @param {ReactNode} children - the protected component(s)
 * @param {string} role - "user" | "admin" (default: "user")
 */
export default function ProtectedRoute({ children, role = "user" }) {
  const { user, admin, loading } = useAuth();

  // Show loading state while restoring user/admin from localStorage
  if (role === "user" && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // Check access based on role
  if (role === "user" && !user) return <Navigate to="/login" replace />;
  if (role === "admin" && !admin) return <Navigate to="/admin/login" replace />;

  return children;
}
