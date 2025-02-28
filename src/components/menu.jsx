import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa useLocation
import { AuthContext } from '../context/AuthContext';
import '../styles/menu.css';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation(); // Obtén la ubicación actual
  const {isAuthenticated, userRole} = useContext(AuthContext)

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


 const menuItems = [
    { path: '/home', label: 'Home', roles: ['user', 'guest'] },
    { path: '/pesca', label: 'Pesca', roles: ['user','guest'] },
    { path: '/reservaciones', label: 'Reservaciones', roles: [ 'user','guest'] },
    { path: '/galerias', label: 'Galerías', roles: [ 'user','guest'] },
    { path: '/reseña', label: 'Reseñas', roles: ['user','guest'] },
    { path: '/reseña', label: 'Reseñas', roles: ['user','guest'] },
    { path: '/admin/reservaciones', label: 'Admin Panel', roles: ['admin'] }, // Solo para admin
    { path: '/login', label: 'Login', roles: ['guest'] }, // Solo para invitados
  ];

  // Filtra las opciones del menú según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => {
    if (!isAuthenticated) {
      return item.roles.includes('guest'); // Si no está autenticado, muestra solo las opciones para invitados
    }
    return item.roles.includes(userRole); // Filtra según el rol del usuario
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top w-100">
      <div className="container-fluid d-flex">
        <div className="d-flex align-items-center">
          <button
            className="navbar-toggler me-2"
            type="button"
            onClick={handleToggle}
            aria-expanded={menuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="ms-3">
          <Link className="navbar-brand" to="/home">Mi App de Reservaciones</Link>
        </div>

        <div
          className={`collapse navbar-collapse ${menuOpen ? 'show' : ''} ${isClosing ? 'closing' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {filteredMenuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <Link className="nav-link" to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;