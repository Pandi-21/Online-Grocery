import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
const BASE_URL = "http://localhost:5000/user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const signup = async (name, email, password) => {
    const res = await axios.post(`${BASE_URL}/signup`, { name, email, password });
    const newUser = res.data.user;
    const token = res.data.token;
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("userId", newUser._id);
    localStorage.setItem("token", token);
    navigate("/account");
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${BASE_URL}/login`, { email, password });
    const loggedInUser = res.data.user;
    const token = res.data.token;
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("userId", loggedInUser._id);
    localStorage.setItem("token", token);
    navigate("/account");
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
