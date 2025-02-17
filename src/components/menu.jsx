import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa useLocation
import '../styles/menu.css';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation(); // Obtén la ubicación actual

  const handleToggle = () => {
    if (menuOpen) {
      // Si el menú está abierto, iniciamos la animación de cierre
      setIsClosing(true);
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, 300); // Duración de la animación de salida (0.3s)
    } else {
      // Si el menú está cerrado, lo abrimos
      setMenuOpen(true);
    }
  };

  // Cierra el menú cuando la ruta cambia
  useEffect(() => {
    if (menuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, 300); // Duración de la animación de salida (0.3s)
    }
  }, [location]); // Se ejecuta cada vez que la ruta cambia

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top w-100">
      <div className="container-fluid d-flex">
        {/* Contenedor para el logo y el botón */}
        <div className="d-flex align-items-center">
          <button
            className="navbar-toggler me-2"
            type="button"
            onClick={handleToggle} // Llamada a la función de toggle
            aria-expanded={menuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="ms-3">
          <Link className="navbar-brand" to="/home">Mi App de Reservaciones</Link>
        </div>

        {/* Menú colapsable */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? 'show' : ''} ${isClosing ? 'closing' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pesca">Pesca</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reservaciones">Reservaciones</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/galerias">Galerías</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reseña">Reseñas</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;