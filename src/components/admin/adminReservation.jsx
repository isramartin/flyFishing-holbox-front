import React, { useState } from "react";
import { Eye } from "lucide-react";
import '../../styles/admin/adminReservation.css'

const AdminReservations = () => {
    const [filter, setFilter] = useState("all");
    const [selectedReservation, setSelectedReservation] = useState(null);
    
    const reservations = [
      {
        id: "R001",
        name: "Juan Pérez",
        email: "juan@ejemplo.com",
        phone: "555-123-4567",
        people: 2,
        date: "2023-10-15",
        time: "19:00",
        status: "confirmada",
        notes: "Celebración de aniversario",
      },
      {
        id: "R002",
        name: "María García",
        email: "maria@ejemplo.com",
        phone: "555-987-6543",
        people: 4,
        date: "2023-10-16",
        time: "20:30",
        status: "pendiente",
        notes: "Cumpleaños",
      },
      {
        id: "R002",
        name: "María García",
        email: "maria@ejemplo.com",
        phone: "555-987-6543",
        people: 4,
        date: "2023-10-16",
        time: "20:30",
        status: "cancelada",
        notes: "Cumpleaños",
      },
      {
        id: "R002",
        name: "María García",
        email: "maria@ejemplo.com",
        phone: "555-987-6543",
        people: 4,
        date: "2023-10-16",
        time: "20:30",
        status: "cancelada",
        notes: "Cumpleaños",
      },
      {
        id: "R002",
        name: "María García",
        email: "maria@ejemplo.com",
        phone: "555-987-6543",
        people: 4,
        date: "2023-10-16",
        time: "20:30",
        status: "cancelada",
        notes: "Cumpleaños",
      },
      {
        id: "R002",
        name: "María García",
        email: "maria@ejemplo.com",
        phone: "555-987-6543",
        people: 4,
        date: "2023-10-16",
        time: "20:30",
        status: "cancelada",
        notes: "Cumpleaños",
      },
      {
        id: "R002",
        name: "María García",
        email: "maria@ejemplo.com",
        phone: "555-987-6543",
        people: 4,
        date: "2023-10-16",
        time: "20:30",
        status: "cancelada",
        notes: "Cumpleaños",
      },
      
    ];

    const getStatusColor = (status) => {
        switch (status) {
          case 'confirmada':
            return 'confirmada';
          case 'pendiente':
            return 'pendiente';
          case 'cancelada':
            return 'cancelada';
          default:
            return '';
        }
      };
  
    const filteredReservations =
      filter === "all" ? reservations : reservations.filter((res) => res.status === filter);
  
    return (
        <div className="admin-reservations-container" >
      <div className="admin-reservations">
        <h2>Panel de Administrador - Reservaciones</h2>
        <div className="filters">
          <label>Filtrar por estado:</label>
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
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
                {/* <td className={res.status}>{res.status}</td> */}
                <td>
                      <span className={res.status}>{res.status}</span>
                    </td>
                <td>
                  <button onClick={() => setSelectedReservation(res)}> <Eye size={18} />  </button>
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
        <button className="close-button" onClick={() => setSelectedReservation(null)}>✖</button>
      </div>
      <div className="modal-body">
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">ID de Reservación</span>
            <span className="detail-value">{selectedReservation.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Estado</span>
            <span className={`status-badge ${getStatusColor(selectedReservation.status)}`}>
              {selectedReservation.status}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Nombre</span>
            <span className="detail-value">{selectedReservation.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{selectedReservation.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Teléfono</span>
            <span className="detail-value">{selectedReservation.phone}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Fecha</span>
            <span className="detail-value">{selectedReservation.date}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Hora</span>
            <span className="detail-value">{selectedReservation.time}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Personas</span>
            <span className="detail-value">{selectedReservation.people}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Notas</span>
            <span className="detail-value">{selectedReservation.notes || "Sin notas adicionales"}</span>
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
  