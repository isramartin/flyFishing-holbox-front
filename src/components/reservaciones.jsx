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
    if (onReserve) onReserve(name, selectedDate);
  };

  // Función para formatear el encabezado del calendario
  const formatMonthYear = (date, locale = 'es-ES') => {
    // Obtener el nombre del mes usando Intl.DateTimeFormat
    const nombreMes = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    // Capitalizar la primera letra del mes (opcional, dependiendo del locale)
    const mesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
    // Devolver el formato "Mes Año"
    console.log(mesCapitalizado);
    
    return `${mesCapitalizado} ${date.getFullYear()}`;
  };
  

  return (
    <div className="reservation-container">
      <h2>Reserva tu día</h2>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) =>
          reservations.includes(date.toISOString().split('T')[0]) ? 'reserved' : ''
        }
        formatMonthYear={(locale, date) => formatMonthYear(date)}
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
