import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
  const { isAuthenticated } = useContext(AuthContext); // Corregido: isAuthenticated (sin la "i" adicional)

  console.log("Estado de autenticación:", isAuthenticated); // Debug: Verificar el estado de autenticación

  return (
    <div className="App">
      {isAuthenticated && <Menu />} {/* Mostrar el menú solo si el usuario está autenticado */}

      <Routes>
        <Route path="/login" element={<LoginForm />} />
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
            isAuthenticated ? <AdminReservations /> : <Navigate to="/login" /> // Proteger la ruta
          }
        />
        <Route path="*" element={<Navigate to="/" />} /> {/* Ruta por defecto */}
      </Routes>

      {isAuthenticated && <Footer />}
    </div>
  );
};

export default App;