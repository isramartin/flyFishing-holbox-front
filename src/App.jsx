import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx"; // Importa el contexto
import Menu from "./components/menu"; // Importamos el menú
import Home from "./views/home"; // Ya tienes este componente de Home
import Reservaciones from "./views/reservaciones";
import ReservacionesForm from "./components/reservacionesForm";
import Review from "./views/reviewBox";
import Gallery from "./views/galeria";
import Articles from "./views/articules";
import Footer from "./components/footer";
import AdminReservations from "./components/admin/adminReservation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import LoginForm from "./components/login";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import RegisterForm from "./components/registro.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext); // Estado de autenticación
  const location = useLocation(); // Obtiene la ruta actual

  // Ocultar el menú solo en la página de login
  const showMenuAndFooter = location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <div className="App">
      {showMenuAndFooter && <Menu />} {/* Mostrar el menú solo si no estamos en /login */}

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pesca" element={<Articles />} />
        <Route path="/reservaciones" element={<Reservaciones />} />
        <Route path="/reservaciones/reservaForm" element={<ReservacionesForm />} />
        <Route path="/galerias" element={<Gallery />} />
        <Route path="/reseña" element={<Review />} />
        <Route
          path="/admin/reservaciones"
          element={
            <ProtectedRoute requiredRole="admin">
            <AdminReservations />
          </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} /> {/* Ruta por defecto */}
      </Routes>

      {showMenuAndFooter && <Footer />} {/* Mostrar el footer solo si el usuario está autenticado */}
    </div>
  );
};

export default App;