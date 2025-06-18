import React, { useState } from 'react';
import '../styles/MiPerfil.css';

export const PerfilUsuario = () => {
  const [tabActiva, setTabActiva] = useState('perfil');
  const [editando, setEditando] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    id: 'cIOTl300rAYHBFog1agp',
    nombre: 'Juan Pérez',
    email: 'usuario@ejempl052.com',
    sexo: 'masculino',
    edad: 25,
    provider: 'email',
    fechaCreacion: '16 de mayo de 2025, 6:49:43 p. m. UTC-6',
  });

  const renderContenido = () => {
    switch (tabActiva) {
      case 'perfil':
        return (
          <div className="perfil-form">
            <div className="perfil-form-header">
              <div>
                <h3>Información Personal</h3>
                <p>Actualiza tu información personal y de cuenta</p>
              </div>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="btn-editar"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="input-group">
              <div>
                {/* ID */}
                <label>ID de Usuario</label>
                {editando ? (
                  <input type="text" value={datosUsuario.id} readOnly />
                ) : (
                  <p>{datosUsuario.id}</p>
                )}
              </div>

              <div>
                <label>Proveedor</label>
                {editando ? (
                  <input type="text" value={datosUsuario.provider} readOnly />
                ) : (
                  <p>{datosUsuario.provider}</p>
                )}
              </div>
            </div>
            {/* Nombre */}
            <label>Nombre completo</label>
            {editando ? (
              <input
                type="text"
                value={datosUsuario.nombre}
                onChange={(e) =>
                  setDatosUsuario({ ...datosUsuario, nombre: e.target.value })
                }
              />
            ) : (
              <p>{datosUsuario.nombre}</p>
            )}

            {/* Email */}
            <label>Correo Electrónico</label>
            {editando ? (
              <input
                type="email"
                value={datosUsuario.email}
                onChange={(e) =>
                  setDatosUsuario({ ...datosUsuario, email: e.target.value })
                }
              />
            ) : (
              <p>{datosUsuario.email}</p>
            )}

            <div className="input-group">
              <div>
                <label>Sexo</label>
                {editando ? (
                  <select
                    value={datosUsuario.sexo}
                    onChange={(e) =>
                      setDatosUsuario({ ...datosUsuario, sexo: e.target.value })
                    }
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                ) : (
                  <p>{datosUsuario.sexo}</p>
                )}
              </div>

              <div>
                <label>Edad</label>
                {editando ? (
                  <input
                    type="number"
                    value={datosUsuario.edad}
                    onChange={(e) =>
                      setDatosUsuario({ ...datosUsuario, edad: e.target.value })
                    }
                  />
                ) : (
                  <p>{datosUsuario.edad}</p>
                )}
              </div>
            </div>

            {/* <label>Fecha de creación</label>
      {editando ? (
        <input type="text" value={datosUsuario.fechaCreacion} readOnly />
      ) : (
        <p>{datosUsuario.fechaCreacion}</p>
      )} */}

            {/* Botones abajo */}
            {editando && (
              <div className="form-buttons">
                <button
                  className="btn-guardar"
                  onClick={() => setEditando(false)}
                >
                  Guardar
                </button>
                <button
                  className="btn-cancelar"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
              </div>
            )}
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
            <p style={{ color: '#888' }}>
              <em>No tienes reservas por el momento.</em>
            </p>
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
          <div className="cambiar-foto" title="Cambiar foto">
            📷
          </div>
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
