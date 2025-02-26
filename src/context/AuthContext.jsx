// context/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    console.log("Usuario autenticado"); // Debug: Verificar que se llama esta función
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("Usuario cerró sesión"); // Debug: Verificar que se llama esta función
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};