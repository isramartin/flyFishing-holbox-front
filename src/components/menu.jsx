import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Image1 from '../assets/image/logo.png';
import { ChevronDown, User, LogOut } from 'lucide-react';
import '../styles/menu.css';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const {
    isAuthenticated,
    role,
    logout,
    loading: authLoading,
    user,
  } = useContext(AuthContext);

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

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout(); // <-- Aquí se limpia la sesión
      setUserDropdownOpen(false);
      if (role?.toUpperCase() === 'USER') {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Redirección basada en el rol
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const currentPath = location.pathname;
      const normalizedRole = role?.toUpperCase();

      if (normalizedRole === 'ADMIN' && !currentPath.startsWith('/admin')) {
        navigate('/admin/reservaciones');
      } else if (
        normalizedRole === 'USER' &&
        currentPath.startsWith('/admin')
      ) {
        navigate('/home');
      } else if (!isAuthenticated && currentPath.startsWith('/admin')) {
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
    {
      path: '/reservaciones/steps/1',
      label: 'Reservaciones',
      roles: ['USER', 'GUEST'],
    },
    { path: '/galerias', label: 'Galerías', roles: ['USER', 'GUEST'] },
    { path: '/reseña', label: 'Reseñas', roles: ['USER', 'GUEST'] },
    { path: '/login', label: 'Login', roles: ['GUEST'] },
    { path: '/register', label: 'Registro', roles: ['GUEST'] },
    // { path: '/prueba', label: 'Prueba', roles: ['GUEST'] },
    { path: '/admin/reservaciones', label: 'Admin Panel', roles: ['ADMIN'] },
    {
      path: '/admin/imageUploadGallery',
      label: 'Upload Gallery',
      roles: ['ADMIN'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!isAuthenticated) {
      return item.roles.includes('GUEST');
    }
    return item.roles.includes(role?.toUpperCase());
  });

  return (
    <nav className='navbar navbar-expand-lg navbar-light fixed-top w-100'>
      <div className='container-fluid d-flex'>
        <div className='d-flex align-items-center'>
          <button
            className='navbar-toggler me-2'
            type='button'
            onClick={handleToggle}
            aria-expanded={menuOpen ? 'true' : 'false'}
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
        </div>

        <div className='ms-3'>
          <NavLink className='navbar-brand' to='/home'>
            <img className='logo' src={Image1} alt='Logo' />
          </NavLink>
        </div>

        <div
          className={`collapse navbar-collapse ${menuOpen ? 'show' : ''} ${
            isClosing ? 'closing' : ''
          }`}
          id='navbarNav'
        >
          <ul className='navbar-nav me-auto'>
            {filteredMenuItems.map((item, index) => {
              // Ajuste solo para "Reservaciones"
              const isReservaciones = item.path.startsWith(
                '/reservaciones/steps/'
              );
              const isHome = item.path === '/home';

              const isActiveCustom = isHome
                ? location.pathname === '/' || location.pathname === '/home'
                : isReservaciones
                ? location.pathname.startsWith('/reservaciones/steps/')
                : location.pathname === item.path;

              return (
                <li className='nav-item' key={index}>
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
                    className={isActiveCustom ? 'nav-link active' : 'nav-link'}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {isAuthenticated && (
            <div className='user-dropdown-container'>
              <button
                className='user-menu-toggle'
                onClick={toggleUserDropdown}
                aria-expanded={userDropdownOpen}
              >
                <ChevronDown
                  size={16}
                  strokeWidth={3}
                  className={`dropdown-icon ${
                    userDropdownOpen ? 'rotate' : ''
                  }`}
                />

                <span className='user-name'>
                  {user?.user?.nombre ||
                    user?.nombre ||
                    user?.email?.split('@')[0]}
                </span>

                {user?.userPhotoUrl && (
                  <img
                    src={user.userPhotoUrl}
                    alt='Foto de perfil'
                    className='profile-pic'
                  />
                )}
              </button>

              {userDropdownOpen && (
                <div className='user-dropdown-menu'>
                  <Link
                    to={
                      role?.toUpperCase() === 'ADMIN'
                        ? '/admin/MiPerfil'
                        : '/MiPerfil'
                    }
                    className='dropdown-item'
                    onClick={() => {
                      closeMenu();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <User size={16} className='me-2' />
                    Mi Perfil
                  </Link>

                  <button
                    className='dropdown-item'
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    <LogOut size={16} className='me-2' />
                    {logoutLoading ? 'Saliendo...' : 'Cerrar Sesión'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
