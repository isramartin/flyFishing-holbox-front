import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Image1 from '../assets/image/logo.png';
import { ChevronDown, User, LogOut } from 'lucide-react';
import '../styles/menu.css';

const Menu = () => {
  const [menuOpen, setMenuOpen]             = useState(false);
  const [isClosing, setIsClosing]           = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoutLoading, setLogoutLoading]   = useState(false);

  const location  = useLocation();
  const navigate  = useNavigate();
  const { isAuthenticated, role, logout, loading: authLoading, user } =
    useContext(AuthContext);

  /* ── helpers ── */
  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => { setMenuOpen(false); setIsClosing(false); }, 300);
  };

  const handleToggle = () => (menuOpen ? closeMenu() : setMenuOpen(true));

  const toggleUserDropdown = () => setUserDropdownOpen((p) => !p);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      setUserDropdownOpen(false);
      if (role?.toUpperCase() === 'USER') navigate('/home');
    } catch (e) {
      console.error('Error en logout:', e);
    } finally {
      setLogoutLoading(false);
    }
  };

  /* ── redirección por rol ── */
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const path = location.pathname;
      const r    = role?.toUpperCase();
      if (r === 'ADMIN' && !path.startsWith('/admin'))        navigate('/admin/reservaciones');
      else if (r === 'USER' && path.startsWith('/admin'))     navigate('/home');
      else if (!isAuthenticated && path.startsWith('/admin')) navigate('/home');
    }
  }, [isAuthenticated, role, authLoading, navigate, location]);

  /* cierra el menú al cambiar de ruta */
  useEffect(() => { if (menuOpen) closeMenu(); }, [location]);

  /* ── items ── */
  const menuItems = [
    { path: '/home',                   label: 'Home',         roles: ['USER', 'GUEST'] },
    { path: '/pesca',                  label: 'Pesca',        roles: ['USER', 'GUEST'] },
    { path: '/reservaciones/steps/1',  label: 'Reservaciones',roles: ['USER', 'GUEST'] },
    { path: '/galerias',               label: 'Galerías',     roles: ['USER', 'GUEST'] },
    { path: '/reseña',                 label: 'Reseñas',      roles: ['USER', 'GUEST'] },
    { path: '/login',                  label: 'Login',        roles: ['GUEST'] },
    { path: '/register',               label: 'Registro',     roles: ['GUEST'] },
    { path: '/admin/reservaciones',    label: 'Admin Panel',  roles: ['ADMIN'] },
    { path: '/admin/imageUploadGallery', label: 'Upload Gallery', roles: ['ADMIN'] },
    { path: '/admin/uploadInfoPesca',  label: 'Upload Info',  roles: ['ADMIN'] },
  ];

  const filtered = menuItems.filter((item) =>
    !isAuthenticated
      ? item.roles.includes('GUEST')
      : item.roles.includes(role?.toUpperCase())
  );

  return (
    <nav className='navbar navbar-expand-lg fixed-top w-100'>
      <div className='container-fluid d-flex'>

        {/* Toggler móvil */}
        <button
          className='navbar-toggler me-3'
          type='button'
          onClick={handleToggle}
          aria-expanded={menuOpen}
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>

        {/* Logo */}
        <NavLink className='navbar-brand' to='/home'>
          <img className='logo' src={Image1} alt='Logo Tarpon Fighters' />
        </NavLink>

        {/* Links + dropdown */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? 'show' : ''} ${isClosing ? 'closing' : ''}`}
          id='navbarNav'
        >
          <ul className='navbar-nav me-auto'>
            {filtered.map((item, i) => {
              const isReserv = item.path.startsWith('/reservaciones/steps/');
              const isHome   = item.path === '/home';
              const active   = isHome
                ? location.pathname === '/' || location.pathname === '/home'
                : isReserv
                ? location.pathname.startsWith('/reservaciones/steps/')
                : location.pathname === item.path;

              return (
                <li className='nav-item' key={i}>
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
                    className={active ? 'nav-link active' : 'nav-link'}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Menú de usuario */}
          {isAuthenticated && (
            <div className='user-dropdown-container'>
              <button
                className='user-menu-toggle'
                onClick={toggleUserDropdown}
                aria-expanded={userDropdownOpen}
              >
                {/* foto de perfil o inicial */}
                {user?.userPhotoUrl ? (
                  <img
                    src={user.userPhotoUrl}
                    alt='Foto de perfil'
                    className='profile-pic'
                  />
                ) : (
                  <div className='profile-pic d-flex align-items-center justify-content-center'
                    style={{ background: 'rgba(239,159,39,.2)', border: '1px solid rgba(239,159,39,.4)', fontSize: 13, color: '#EF9F27', fontWeight: 500 }}>
                    {(user?.user?.nombre || user?.nombre || user?.email || 'U')[0].toUpperCase()}
                  </div>
                )}

                <span className='user-name'>
                  {user?.user?.nombre || user?.nombre || user?.email?.split('@')[0]}
                </span>

                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  className={`dropdown-icon ${userDropdownOpen ? 'rotate' : ''}`}
                />
              </button>

              {userDropdownOpen && (
                <div className='user-dropdown-menu'>
                  <Link
                    to={role?.toUpperCase() === 'ADMIN' ? '/admin/MiPerfil' : '/MiPerfil'}
                    className='dropdown-item'
                    onClick={() => { closeMenu(); setUserDropdownOpen(false); }}
                  >
                    <User size={15} />
                    Mi Perfil
                  </Link>

                  <button
                    className='dropdown-item logout'
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    <LogOut size={15} />
                    {logoutLoading ? 'Saliendo…' : 'Cerrar Sesión'}
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