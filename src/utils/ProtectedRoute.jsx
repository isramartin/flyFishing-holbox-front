import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Cargando...</div>; // Muestra un loader mientras verifica
  }

  if (!isAuthenticated) {
    // Guarda la ubicación a la que intentaban acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Usuario autenticado pero sin permisos
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;