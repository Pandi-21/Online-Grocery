// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 added loading
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // 👈 done checking
  }, []);

  const signup = (name, email, password) => {
    const newUser = { name, email };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    navigate("/");
  };

  const login = (email, password) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.email === email) {
      setUser(savedUser);
      navigate("/"); // 👉 later we can improve this to redirect back
    } else {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
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
