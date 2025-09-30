// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    const newUser = { 
      _id: Date.now().toString(), // 👈 dummy id
      name, 
      email 
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    navigate("/");
  };

  const login = (email, password) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.email === email) {
      if (!savedUser._id) {
        savedUser._id = Date.now().toString();
        localStorage.setItem("user", JSON.stringify(savedUser));
      }
      setUser(savedUser);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  // ✅ missing logout function
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
