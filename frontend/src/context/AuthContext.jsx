import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();
const BASE_URL = "http://localhost:5000/user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Restore user from localStorage on reload
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 🔹 Signup
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/signup`, { name, email, password });
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

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
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

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUser(null);
    toast("Logged out successfully 👋", { icon: "🚪" });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
