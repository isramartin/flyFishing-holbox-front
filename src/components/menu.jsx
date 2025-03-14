import React, { useState, useEffect, useContext } from 'react';
import { NavLink,Link, useLocation, useNavigate} from 'react-router-dom'; // Importa useLocation
import { AuthContext } from '../context/AuthContext';
import '../styles/menu.css';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation(); // Obtén la ubicación actual
  const navigate = useNavigate(); // Para redirigir
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);

  const handleToggle = () => {
    if (menuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setMenuOpen(true);
    }
  };

  const handleLogout = () => {
    console.log("Rol del usuario al cerrar sesión:", userRole);
    logout();

    setTimeout(() => {
      if (userRole === 'admin') {
        console.log("Redirigiendo a /login");
        navigate('/login');
      } else if (userRole === 'user') {
        console.log("Redirigiendo a /home");
        navigate('/home');
      } else {
        console.log("Redirigiendo a /home por defecto");
        navigate('/home');
      }
    }, 100);
  };

  useEffect(() => {
    if (menuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, 300);
    }
  }, [location]);

  const menuItems = [
    { path: '/home', label: 'Home', roles: ['user', 'guest'] },
    { path: '/pesca', label: 'Pesca', roles: ['user','guest'] },
    { path: '/reservaciones', label: 'Reservaciones', roles: [ 'user','guest'] },
    { path: '/galerias', label: 'Galerías', roles: [ 'user','guest'] },
    { path: '/reseña', label: 'Reseñas', roles: ['user','guest'] },
    { path: '/login', label: 'Login', roles: ['guest'] },
    { path: '/register', label: 'Registro', roles: ['guest'] },
    { path: '/prueba', label: 'Prueba', roles: ['guest'] },
    
    { path: '/admin/reservaciones', label: 'Admin Panel', roles: ['admin'] },
    { path: '/admin/imageUploadGallery', label: 'Upload Gallery', roles: ['admin'] },
  ];

  // Filtra las opciones del menú según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => {
    if (!isAuthenticated) {
      return item.roles.includes('guest') && item.path !== '/register';
    }
    return item.roles.includes(userRole);
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
          <NavLink className="navbar-brand" to="/home">
            Mi App de Reservaciones
          </NavLink>
        </div>

        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""} ${isClosing ? "closing" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {filteredMenuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="closse-session">
            {isAuthenticated && (
              <button
                className="nav-link btn btn-link"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;