import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const signup = (name, email, password) => {
    // Normally API call to backend here
    const newUser = { name, email };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    navigate("/"); // redirect after signup
  };

  const login = (email, password) => {
    // Check saved user (dummy for now)
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.email === email) {
      setUser(savedUser);
      navigate("/");
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
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
