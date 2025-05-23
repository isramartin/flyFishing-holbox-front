import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Image1 from '../assets/image/logo.png';
import '../styles/menu.css';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role, logout, loading: authLoading } = useContext(AuthContext);

  const handleToggle = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
    }
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Redirección basada en el rol
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const currentPath = location.pathname;
      const normalizedRole = role?.toUpperCase();
      
      // Si es ADMIN y no está en una ruta de admin, redirigir a /admin/reservaciones
      if (normalizedRole === 'ADMIN' && !currentPath.startsWith('/admin')) {
        navigate('/admin/reservaciones');
      }
      // Si es USER y está en una ruta de admin, redirigir a /home
      else if (normalizedRole === 'USER' && currentPath.startsWith('/admin')) {
        navigate('/home');
      }
      // Si no está autenticado y está en una ruta de admin, redirigir a /home
      else if (!isAuthenticated && currentPath.startsWith('/admin')) {
        navigate('/home');
      }
    }
  }, [isAuthenticated, role, authLoading, navigate, location]);

  useEffect(() => {
    if (menuOpen) {
      closeMenu();
    }
  }, [location]);

  const menuItems = [
    { path: '/home', label: 'Home', roles: ['USER', 'GUEST'] },
    { path: '/pesca', label: 'Pesca', roles: ['USER', 'GUEST'] },
    { path: '/reservaciones', label: 'Reservaciones', roles: ['USER', 'GUEST'] },
    { path: '/galerias', label: 'Galerías', roles: ['USER', 'GUEST'] },
    { path: '/reseña', label: 'Reseñas', roles: ['USER', 'GUEST'] },
    { path: '/login', label: 'Login', roles: ['GUEST'] },
    { path: '/register', label: 'Registro', roles: ['GUEST'] },
    { path: '/prueba', label: 'Prueba', roles: ['GUEST'] },

    
    { path: '/admin/reservaciones', label: 'Admin Panel', roles: ['ADMIN'] },
    { path: '/admin/imageUploadGallery', label: 'Upload Gallery', roles: ['ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!isAuthenticated) {
      return item.roles.includes('GUEST');
    }
    return item.roles.includes(role?.toUpperCase());
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
            <img className='logo' src={Image1} alt="Logo" />
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
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  end
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          
          {isAuthenticated && (
            <ul className="closse-session">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                  disabled={authLoading}
                >
                  {authLoading ? 'Saliendo...' : 'Cerrar Sesión'}
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;