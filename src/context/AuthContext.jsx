// context/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null)

  const login = (role) => {
    console.log("Usuario autenticado :: role", role); // Debug: Verificar que se llama esta función
    setIsAuthenticated(true);
    setUserRole(role)
  };

  const logout = () => {
    console.log("Usuario cerró sesión"); // Debug: Verificar que se llama esta función
    setIsAuthenticated(false);
    setUserRole(null)
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};