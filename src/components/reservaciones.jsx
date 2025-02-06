import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/reserva.css';

const Reservaciones = ({ onReserve }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (!reservations.includes(dateString)) {
      setSelectedDate(dateString);
      setIsFormOpen(true);
    }
  };

  const handleReserve = (name) => {
    setReservations([...reservations, selectedDate]);
    setIsFormOpen(false);
    if (onReserve) onReserve(name, selectedDate);  // Llamada a una función de callback (opcional)
  };

  return (
    <div className="reservation-container">
      <h2>Reserva tu día</h2>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) =>
          reservations.includes(date.toISOString().split('T')[0])
            ? 'reserved'
            : ''
        }
      />
      {isFormOpen && (
        <>
          <div className="modal-overlay"></div>
          <div className="reservation-form">
            <h3>Reservar para {selectedDate}</h3>
            <input type="text" placeholder="Tu nombre" id="name" />
            <button onClick={() => handleReserve(document.getElementById('name').value)}>
              Confirmar Reserva
            </button>
            <button onClick={() => setIsFormOpen(false)}>Cancelar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reservaciones;
