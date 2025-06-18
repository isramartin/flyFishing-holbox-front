import React, { useState } from 'react';
import '../styles/MiPerfil.css';

export const PerfilUsuario = () => {
  const [tabActiva, setTabActiva] = useState('perfil');

  const renderContenido = () => {
    switch (tabActiva) {
      case 'perfil':
        return (
          <div className="perfil-form">
            <h3>Información Personal</h3>
            <p>Actualiza tu información personal y de contacto</p>

            <div className="input-group">
              <div>
                <label>Nombre</label>
                <input type="text" placeholder="Nombre" />
              </div>
              <div>
                <label>Apellido</label>
                <input type="text" placeholder="Apellido" />
              </div>
            </div>

            <label>Correo Electrónico</label>
            <input type="email" placeholder="correo@ejemplo.com" />

            <label>Teléfono</label>
            <input type="tel" placeholder="+52 123 456 7890" />

            
          </div>
        );

    //   case 'cuenta':
    //     return (
    //       <div className="perfil-form">
    //         <h3>Configuración de Cuenta</h3>
    //         <p>Administra tus preferencias de cuenta</p>

    //         <label>Nombre de Usuario</label>
    //         <input type="text" placeholder="Usuario123" />

    //         <label>Idioma Preferido</label>
    //         <select>
    //           <option>Español</option>
    //           <option>Inglés</option>
    //         </select>
    //       </div>
    //     );

      case 'seguridad':
        return (
          <div className="perfil-form">
            <h3>Seguridad</h3>
            <p>Cambia tu contraseña o activa verificación</p>

            <label>Contraseña Actual</label>
            <input type="password" placeholder="••••••" />

            <label>Nueva Contraseña</label>
            <input type="password" placeholder="••••••" />

            <label>Confirmar Nueva Contraseña</label>
            <input type="password" placeholder="••••••" />
          </div>
        );

      case 'reservas':
        return (
          <div className="perfil-form">
            <h3>Mis Reservas</h3>
            <p>Aquí se mostrarán tus reservas.</p>
            <p style={{ color: '#888' }}><em>No tienes reservas por el momento.</em></p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="perfil-wrapper">
      {/* Encabezado */}
      <div className="perfil-header">
        <div className="foto-perfil">
          <div className="avatar-placeholder" />
          <div className="cambiar-foto" title="Cambiar foto">📷</div>
        </div>
        <div>
          <h2>Nombre Apellido</h2>
          <p>correo@ejemplo.com</p>
          <span className="ubicacion">📍 Ciudad, País</span>
        </div>
      </div>

      <div className="perfil-tabs">
        <button
          className={tabActiva === 'perfil' ? 'active' : ''}
          onClick={() => setTabActiva('perfil')}
        >
          Perfil
        </button>
        {/* <button
          className={tabActiva === 'cuenta' ? 'active' : ''}
          onClick={() => setTabActiva('cuenta')}
        >
          Cuenta
        </button> */}
        <button
          className={tabActiva === 'seguridad' ? 'active' : ''}
          onClick={() => setTabActiva('seguridad')}
        >
          Seguridad
        </button>
        <button
          className={tabActiva === 'reservas' ? 'active' : ''}
          onClick={() => setTabActiva('reservas')}
        >
          Reservas
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      {renderContenido()}
    </div>
  );
};
