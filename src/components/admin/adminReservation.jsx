import React, { useState, useContext, useEffect } from 'react';
import { Eye } from 'lucide-react';
import '../../styles/admin/adminReservation.css';
import { AuthContext } from '../../context/AuthContext';
import { obtenerTodasLasReservas } from '../../service/Reserva.service';

const AdminReservations = () => {
  const [filter, setFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const authContext = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const { isAuthenticated, token } = useContext(AuthContext);
  // const { token: contextToken } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [localToken, setLocalToken] = useState('');
  const [searchId, setSearchId] = useState('');

  // const reservations = [
  //   {
  //     id: 'R001',
  //     name: 'Juan Pérez',
  //     email: 'juan@ejemplo.com',
  //     phone: '555-123-4567',
  //     people: 2,
  //     date: '2023-10-15',
  //     time: '19:00',
  //     status: 'confirmada',
  //     notes: 'Celebración de aniversario',
  //   },
  //   {
  //     id: 'R002',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'confirmada',
  //     notes: 'Cumpleaños',
  //   },
  //   {
  //     id: 'R003',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'pendiente',
  //     notes: 'Cumpleaños',
  //   },
  //   {
  //     id: 'R004',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'cancelada',
  //     notes: 'Cumpleaños',
  //   },
  //   {
  //     id: 'R005',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'cancelada',
  //     notes: 'Cumpleaños',
  //   },
  //   {
  //     id: 'R006',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'cancelada',
  //     notes: 'Cumpleaños',
  //   },
  //   {
  //     id: 'R007',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'pendiente',
  //     notes: 'Cumpleaños',
  //   },
  //   {
  //     id: 'R008',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'pendiente',
  //     notes: 'Cumpleaños',
  //   },
  //   {
  //     id: 'R009',
  //     name: 'María García',
  //     email: 'maria@ejemplo.com',
  //     phone: '555-987-6543',
  //     people: 4,
  //     date: '2023-10-16',
  //     time: '20:30',
  //     status: 'pendiente',
  //     notes: 'Cumpleaños',
  //   },
  // ];

  // Verificar autenticación al inicio

  useEffect(() => {
    console.log(
      'Estado de autenticación reserva PANEL ADMIN:',
      isAuthenticated
    );
    console.log(
      'Token disponible:',
      token ? '***' + token.slice(-4) : 'No hay token'
    );

    if (!isAuthenticated || !token) {
      console.error('Usuario no autenticado o token faltante');
      // Redirigir al login o mostrar error
    }
  }, [isAuthenticated, token]);

  // useEffect(() => {
  //   console.log('AuthContext:', authContext);

  //   // Intentar obtener el token de varias fuentes
  //   const token =
  //     localStorage.getItem('authToken') || // 1. LocalStorage
  //     '';

  //   console.log(
  //     'Token obtenido:',
  //     token ? '***' + token.slice(-4) : 'NO TOKEN'
  //   );

  //   if (!token) {
  //     console.error('No se encontró token en ninguna fuente');
  //     // Redirigir al login o mostrar error
  //   } else {
  //     setAuthToken(token);
  //   }
  // }, [authContext]);

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
      throw new Error(errorMsg);
    }

    const cargarReservas = async () => {
      try {
        const data = await obtenerTodasLasReservas(token);
        console.log('Datos de reservas desde backend:', data); // 👈 ¿Se imprime esto?

        const reservasFormateadas = data.map((res) => ({
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
        }));

        setReservas(reservasFormateadas); // 👈 Aquí se guarda para usar en filteredReservations
      } catch (err) {
        console.error('Error al obtener reservas:', err.message);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'confirmada';
      case 'pending':
        return 'pendiente';
      case 'failed':
        return 'cancelada';
      default:
        return '';
    }
  };

  //  const filteredReservations =
  //   filter === 'all'
  //     ? reservas
  //     : reservas.filter((res) => res.status === filter);

  const filteredReservations = reservas.filter((res) => {
    const matchEstado = filter === 'all' || res.status === filter;
    const matchId = searchId.trim() === '' || res.id.includes(searchId.trim());
    return matchEstado && matchId;
  });

  return (
    <div className="admin-reservations-container">
      <div className="admin-reservations">
        <h2>Panel de Administrador - Reservaciones</h2>
       <div className="filters">
  <div className="filter-group-horizontal">
    <label htmlFor="estado">Filtrar por estado:</label>
    <select id="estado" onChange={(e) => setFilter(e.target.value)}>
      <option value="all">Todos</option>
      <option value="pending">Pendiente</option>
      <option value="paid">Confirmada</option>
      <option value="failed">Cancelada</option>
    </select>
  </div>

  <div className="filter-group-horizontal-id">
  <label htmlFor="searchId">Buscar por ID:</label>
  <div className="input-wrapper">
    <input
      id="searchId"
      type="text"
      placeholder="ID de reserva"
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
    />
    {searchId && (
      <button
        type="button"
        className="clear-btn"
        onClick={() => setSearchId('')}
        title="Limpiar búsqueda"
      >
        ×
      </button>
    )}
  </div>
</div>

</div>

        <table className="reservation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Personas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.name}</td>
                <td>{res.date}</td>
                <td>{res.time}</td>
                <td>{res.people}</td>
                <td>
                  <span className={res.status}>{res.status}</span>
                </td>
                <td>
                  <button onClick={() => setSelectedReservation(res)}>
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedReservation && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h3>Detalles de la Reservación</h3>
                <button
                  className="close-button-admin"
                  onClick={() => setSelectedReservation(null)}
                >
                  ✖
                </button>
              </div>
              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID de Reservación</span>
                    <span className="detail-value">
                      {selectedReservation.id}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estado</span>
                    <span
                      className={`status-badge ${getStatusColor(
                        selectedReservation.status
                      )}`}
                    >
                      {selectedReservation.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nombre</span>
                    <span className="detail-value">
                      {selectedReservation.name}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">
                      {selectedReservation.email}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Teléfono</span>
                    <span className="detail-value">
                      {selectedReservation.phone}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha</span>
                    <span className="detail-value">
                      {selectedReservation.date}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hora</span>
                    <span className="detail-value">
                      {selectedReservation.time}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Personas</span>
                    <span className="detail-value">
                      {selectedReservation.people}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Renta</span>
                    <span className="detail-value">
                      {selectedReservation.notes || 'Sin notas adicionales'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
