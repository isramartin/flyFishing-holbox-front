import React, { useContext } from "react";
import '@fontsource/montserrat';
import '@fontsource/roboto';
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import ImageUploadPanel from "./components/admin/imageUploadGallery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import LoginForm from "./components/login";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import RegisterForm from "./components/registro";
import Review2 from "./components/review";
import {ReservationStep} from "./components/reservationStep.jsx";
import { AlertProvider } from './components/AlertManager';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QDrXnAH6Ull8Wzh7xQ9CtLmsYdgoFA4dTkRI7PBXp3YNwN3pKa3PY48GnPC4R69IsczthC8pqx4lMigEpdrtsi800YxxkWh8m');

stripePromise.then(stripe => {
  console.log('Stripe cargado correctamente:', !!stripe);
}).catch(error => {
  console.error('Error al cargar Stripe:', error);
});

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
      <Router>
        <AppContent />
      </Router>
      </AlertProvider>
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
      <Route path="/reseña" element={<Review2 />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pesca" element={<Articles />} />
        <Route path="/prueba" element={<Reservaciones />} />
        <Route path="/reservaciones/reservaForm" element={<ReservacionesForm />} />
        <Route path="/galerias" element={<Gallery />} />
        <Route 
          path="/reservaciones" 
          element={
            <Elements stripe={stripePromise}>
              <ReservationStep />
            </Elements>
          } 
        />
        <Route
          path="/admin/reservaciones"
          element={
            <ProtectedRoute requiredRole="ADMIN">
            <AdminReservations />
          </ProtectedRoute>
          }
        />

        <Route
          path="/admin/imageUploadGallery"
          element={
            <ProtectedRoute requiredRole="ADMIN">
            <ImageUploadPanel />
          </ProtectedRoute>
          }
        />\

        <Route path="*" element={<Navigate to="/" />} /> {/* Ruta por defecto */}
      </Routes>

      {showMenuAndFooter && <Footer />} {/* Mostrar el footer solo si el usuario está autenticado */}
    </div>
  );
};

export default App;