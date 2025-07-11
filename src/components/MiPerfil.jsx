import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUsuarioById } from '../service/User.service';
import { obtenerMisReservas } from '../service/Reserva.service';
import {
  FileDown,
  ScrollText,
  ListCheck,
  CalendarDays,
  Clock3,
  Users,
  Package,
  User,
  Mail,
  PhoneCall,
  CreditCard,
  Users2,
} from 'lucide-react';
import '../styles/MiPerfil.css';

export const PerfilUsuario = () => {
  const [tabActiva, setTabActiva] = useState('perfil');
  const [editando, setEditando] = useState(false);
  const authContext = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const { isAuthenticated, token } = useContext(AuthContext);
  const [localToken, setLocalToken] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [totalReservas, setTotalReservas] = useState(0);

  const [datosUsuario, setDatosUsuario] = useState({
    id: '',
    provider: '',
    nombre: '',
    email: '',
    sexo: '',
    edad: '',
    userPhotoUrl: '',
  });

  useEffect(() => {
    console.log('Estado de autenticación panel userr:', isAuthenticated);
    console.log(
      'Token disponible:',
      token ? '***' + token.slice(-4) : 'No hay token'
    );

    if (!isAuthenticated || !token) {
      console.error('Usuario no autenticado o token faltante');
      // Redirigir al login o mostrar error
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('authToken');
    setLocalToken(tokenFromStorage || '');
  }, []);

  useEffect(() => {
    const tokenSources = [
      localStorage.getItem('authToken'),
      authContext?.token,
      JSON.parse(localStorage.getItem('auth'))?.token,
    ].filter(Boolean);

    const token = tokenSources[0];
    console.log(
      '🔑 Token seleccionado:',
      token ? `***${token.slice(-4)}` : 'NO TOKEN'
    );

    if (!token) {
      const errorMsg =
        'No se encontró token de autenticación. Por favor inicie sesión nuevamente.';
      console.error(errorMsg);
      setError(errorMsg);
      setCargando(false);
      return;
    }

    const cargarMisReservas = async () => {
      try {
        const data = await obtenerMisReservas(token);
        console.log('Reservas personales desde backend:', data);

        const reservasFormateadas = data.reservas.map((res) => ({
          id: res.id,
          name: res.nombreCompleto,
          email: res.email,
          phone: res.numeroTelefono,
          people: res.numeroPersonas,
          date: res.fechaReserva,
          time: res.hora,
          status: res.paymentStatus,
          notes: res.alquilar ? 'Alquiler de equipo' : 'Sin equipo',
          total: res.totalPagar,
          payment: res.payment,
          equipoPrecio: res.equipo_precio,
          metodoPago: res.paymentMethod,
          pdf: res.pdfUrl,
          paymentDate: res.paymentDate?.seconds
            ? new Date(res.paymentDate.seconds * 1000).toLocaleString()
            : null,
        }));

        setReservas(reservasFormateadas);
        setTotalReservas(data.total);
      } catch (err) {
        console.error('Error al obtener reservas del usuario:', err.message);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarMisReservas();
  }, [authContext?.token]);

  useEffect(() => {
    const tokenSources = [
      localStorage.getItem('authToken'),
      authContext?.token,
      JSON.parse(localStorage.getItem('auth'))?.token,
    ].filter(Boolean);

    const authSources = [
      JSON.parse(localStorage.getItem('auth')),
      authContext,
    ].filter(Boolean);

    const token = tokenSources[0];
    const userId = authSources[0]?.user.id;

    console.log(
      '🔑 Token seleccionado:',
      token ? `***${token.slice(-4)}` : 'NO TOKEN'
    );
    console.log('🆔 UserID seleccionado:', userId || 'NO USER ID');

    if (!token || !userId) {
      const errorMsg =
        'No se encontró token o userId. Inicie sesión nuevamente.';
      console.error(errorMsg);
      setError(errorMsg);
      setCargandoUsuario(false);
      return;
    }

    const cargarUsuario = async () => {
      try {
        const data = await getUsuarioById(userId, token);
        console.log('✅ Usuario recibido:', data);
        setDatosUsuario({
          id: data.id,
          provider: data.provider || '',
          nombre: data.nombre || '',
          email: data.email || '',
          sexo: data.sexo || '',
          edad: data.fechaN ? calcularEdad(data.fechaN) : '',
          userPhotoUrl: data.userPhotoUrl || '',
        });
      } catch (err) {
        console.error('❌ Error al obtener usuario:', err.message);
        setError(err.message);
      } finally {
        setCargandoUsuario(false);
      }
    };

    cargarUsuario();
  }, []);

  const renderContenido = () => {
    switch (tabActiva) {
      case 'perfil':
        return (
          <div className='perfil-form'>
            <div className='perfil-form-header'>
              <div>
                <h3>Información Personal</h3>
                <p>Actualiza tu información personal y de cuenta</p>
              </div>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className='btn-editar'
                >
                  Editar
                </button>
              )}
            </div>

            <div className='input-group'>
              <div>
                {/* ID */}
                <label>ID de Usuario</label>
                {editando ? (
                  <input type='text' value={datosUsuario.id} readOnly />
                ) : (
                  <p>{datosUsuario.id}</p>
                )}
              </div>

              <div>
                <label>Proveedor</label>
                {editando ? (
                  <input type='text' value={datosUsuario.provider} readOnly />
                ) : (
                  <p>{datosUsuario.provider}</p>
                )}
              </div>
            </div>
            {/* Nombre */}
            <label>Nombre completo</label>
            {editando ? (
              <input
                type='text'
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
                type='email'
                value={datosUsuario.email}
                onChange={(e) =>
                  setDatosUsuario({ ...datosUsuario, email: e.target.value })
                }
              />
            ) : (
              <p>{datosUsuario.email}</p>
            )}

            <div className='input-group'>
              <div>
                <label>Sexo</label>
                {editando ? (
                  <select
                    value={datosUsuario.sexo}
                    onChange={(e) =>
                      setDatosUsuario({ ...datosUsuario, sexo: e.target.value })
                    }
                  >
                    <option value='masculino'>Masculino</option>
                    <option value='femenino'>Femenino</option>
                    <option value='otro'>Otro</option>
                  </select>
                ) : (
                  <p>{datosUsuario.sexo}</p>
                )}
              </div>

              <div>
                <label>Edad</label>
                {editando ? (
                  <input
                    type='number'
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
              <div className='form-buttons'>
                <button
                  className='btn-guardar'
                  onClick={() => setEditando(false)}
                >
                  Guardar
                </button>
                <button
                  className='btn-cancelar'
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
          <div className='perfil-form'>
            <h3>Seguridad</h3>
            <p>Cambia tu contraseña o activa verificación</p>

            <label>Nueva Contraseña</label>
            <input type='password' placeholder='••••••' />

            <label>Confirmar Nueva Contraseña</label>
            <input type='password' placeholder='••••••' />
          </div>
        );

      case 'reservas':
        return (
          <div className='perfil-form'>
            <div className='reservas-header'>
              <h3>
                <ScrollText size={35} /> Mis Reservas
              </h3>
              <p className='subtitulo'>
                Consulta y gestiona tus reservas activas
              </p>
              <hr className='reserva-separador' />
            </div>

            {cargando ? (
              <p className='reserva-mensaje'>⏳ Cargando tus reservas...</p>
            ) : error ? (
              <p className='reserva-error'>❌ {error}</p>
            ) : reservas.length === 0 ? (
              <p className='reserva-mensaje'>
                📭 No tienes reservas registradas.
              </p>
            ) : (
              <>
                <p className='reserva-total'>
                  <ListCheck /> <strong>{totalReservas}</strong> reserva(s)
                  encontradas
                </p>

                <div className='reservas-grid'>
                  {reservas.map((reserva) => (
                    <div key={reserva.id} className='reserva-card'>
                      <span className={`reserva-status ${reserva.status}`}>
                        {reserva.status === 'paid'
                          ? 'Pagado'
                          : reserva.status === 'pending'
                          ? 'Pendiente'
                          : 'Fallido'}
                      </span>

                      <div className='reserva-body'>
                        <div className='reserva-info'>
                          <p>
                            <strong>
                              <CalendarDays size={15} /> Fecha:
                            </strong>{' '}
                            {reserva.date}
                          </p>
                          <p>
                            <strong>
                              <Clock3 /> Hora:
                            </strong>{' '}
                            {reserva.time}
                          </p>
                          <p>
                            <strong>
                              <Users2 /> Personas:
                            </strong>{' '}
                            {reserva.people}
                          </p>
                          <p>
                            <strong>
                              <Package /> Equipo:
                            </strong>{' '}
                            {reserva.notes}
                          </p>
                          <p>
                            <strong>
                              <User /> Nombre:
                            </strong>{' '}
                            {reserva.name}
                          </p>
                          <p>
                            <strong>
                              <Mail /> Correo:
                            </strong>{' '}
                            {reserva.email}
                          </p>
                          <p>
                            <strong>
                              <PhoneCall /> Teléfono:
                            </strong>{' '}
                            {reserva.phone}
                          </p>
                          <p>
                            <strong>
                              <CreditCard /> Total:
                            </strong>{' '}
                            ${reserva.total}
                          </p>
                        </div>
                      </div>

                      {reserva.pdf && (
                        <div className='reserva-footer'>
                          <a
                            className='reserva-comprobante'
                            href={reserva.pdf}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <FileDown /> Descargar comprobante
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='perfil-wrapper'>
      {/* Encabezado */}
      <div className='perfil-header'>
        <div className='foto-perfil'>
          {datosUsuario.userPhotoUrl ? (
            <img
              src={datosUsuario.userPhotoUrl}
              alt='Foto de perfil'
              className='avatar-image'
            />
          ) : (
            <div className='avatar-placeholder'>
              {datosUsuario.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className='cambiar-foto' title='Cambiar foto'>
            📷
          </div>
        </div>

        <div className='perfil-info-texto'>
          <h2>{datosUsuario.nombre}</h2>
          <p>{datosUsuario.email}</p>
        </div>
      </div>

      <div className='perfil-tabs'>
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
