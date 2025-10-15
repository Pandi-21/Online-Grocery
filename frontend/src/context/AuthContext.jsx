import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Use .env variable
const USER_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Restore user/admin from localStorage on reload
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const userToken = localStorage.getItem("token");
    if (savedUser && userToken) setUser(JSON.parse(savedUser));

    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));

    setLoading(false);
  }, []);

  // 🔹 User Signup
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${USER_BASE_URL}/signup`, { name, email, password });
      const { user: newUser, token } = res.data;

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("userId", newUser._id);
      localStorage.setItem("token", token);

      toast.success("Signup successful 🎉");
      navigate("/account");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Try again.");
      throw err;
    }
  };

  // 🔹 User Login
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${USER_BASE_URL}/login`, { email, password });
      const { user: loggedInUser, token } = res.data;

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("userId", loggedInUser._id);
      localStorage.setItem("token", token);

      toast.success(`Welcome back, ${loggedInUser.name || "User"} 👋`);
      navigate("/account");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
      throw err;
    }
  };

  // 🔹 Admin Login
  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
    toast.success(`Admin logged in 👮`);
    navigate("/admin/dashboard");
  };

  // 🔹 Logout (for both user and admin)
  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    toast("Logged out successfully 👋", { icon: "🚪" });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        signup,
        loginUser,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
