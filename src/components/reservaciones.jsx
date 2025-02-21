import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/reserva.css';

const Reservaciones = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fechaReservada) {
      setReservations((prevReservations) => [...prevReservations, location.state.fechaReservada]);
    }
  }, [location.state]);

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (!reservations.includes(dateString)) {
      setSelectedDate(dateString);
      // Redirigir a la página del formulario con la fecha seleccionada
      navigate('/reservaciones/reservaForm', { state: { selectedDate: dateString } });
    }
  };

  // Función para formatear el encabezado del calendario
  const formatMonthYear = (date, locale = 'es-ES') => {
    const nombreMes = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    const mesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
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
    </div>
  );
};

export default Reservaciones;