// components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  // Verifica si el usuario está autenticado y tiene el rol requerido
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirige al login si no está autenticado
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" />; // Redirige a la página principal si no tiene el rol requerido
  }

  return children; // Renderiza el componente si el usuario está autenticado y tiene el rol correcto
};

export default ProtectedRoute;