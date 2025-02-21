import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Ship, MapPin, Clock, Phone, LifeBuoy, Smile,  GlassWater, Bus,BusFront,Contact,PhoneCall,  User, Mail,  Users} from 'lucide-react';

import '../styles/reservaForm.css';

const ReservacionesForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDate = location.state?.selectedDate; // Obtener la fecha seleccionada


  const formatDate = (dateString) => {
    const date = new Date(dateString + "T12:00:00"); // Asegura que la hora no cause desfase
    console.log("Fecha original:", dateString);
  console.log("Fecha interpretada por JavaScript:", date);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  
  

  

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    telefono: '',
    numeroPersonas: '',
    informacionAdicional: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario (por ejemplo, enviar a una API)
    console.log('Datos del formulario:', { ...formData, fecha: selectedDate });
  
    // Redirigir a la página de reservaciones con la fecha reservada
    navigate('/reservaciones', { state: { reservaExitosa: true, fechaReservada: selectedDate } });
  };

  return (
    <div className='rf-container'>
      <div className="rf-form">
        <h2 className="rf-title">Reserva para <br/>{formatDate(selectedDate)}</h2>
        <form onSubmit={handleSubmit}>
          <div className="rf-form-group">
            <label className="rf-label"> <User className='icon-style'/> Nombre completo:</label>
            <input
              type="text"
              name="nombreCompleto"
              placeholder='Nombre Completo'
              value={formData.nombreCompleto}
              onChange={handleChange}
              className="rf-input"
              required
            />
          </div>

          <div className="rf-form-group">
            <label className="rf-label"><Mail className='icon-style'/> Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              placeholder='Correo'
              value={formData.correo}
              onChange={handleChange}
              className="rf-input"
              required
            />
          </div>

          <div className="rf-form-group">
            <label className="rf-label"><Phone className='icon-style'/> Teléfono:</label>
            <input
              type="tel"
              name="telefono"
              placeholder='Telefono'
              value={formData.telefono}
              onChange={handleChange}
              className="rf-input"
              required
            />
          </div>

          <div className="rf-form-group">
            <label className="rf-label"> <Users className='icon-style'/> Número de personas:</label>
            <select
              name="numeroPersonas"
              placeholder='numeroPersonas'
              value={formData.numeroPersonas}
              onChange={handleChange}
              className="rf-input"
              required
            >
              <option value="">Seleccione</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6+</option>
            </select>
          </div>

          <button type="submit" className="rf-button rf-button-submit">
            Confirmar Reserva
          </button>
          <button
            type="button"
            className="rf-button rf-button-cancel"
            onClick={() => navigate('/reservaciones')}
          >
            Cancelar
          </button>
        </form>
      </div>

      <div className="rf-info">
        <h3>Información del Tour</h3>
        <ul >
        <li>
        <Clock className="icon-style" />
      <strong>Duración del Tour:</strong> 3 horas
    </li>

    {/* Punto de Partida */}
    <li>
    <MapPin className='icon-style'/>
      <strong>Punto de Partida:</strong> Muelle Principal, Puerto Aventura
    </li>

    {/* Tipo de Embarcación */}
    <li>
       <Ship className='icon-style'/>
      <strong>Tipo de Embarcación:</strong> Lancha rápida
    </li>

    {/* Teléfono */}
    <li>
      <Phone className='icon-style'/>
      <strong>Teléfono:</strong> (123) 456-7890
    </li>

    {/* Incluye */}
    <li>
    <Smile className="icon-style" />
      <strong>Incluye:</strong>
      <ul className="nested-list">
        <li> <LifeBuoy className='icon-style'/> Chalecos Salvavidas</li>
        <li> < GlassWater className='icon-style'/> Refrescos</li>
      </ul>
    </li>
        </ul>
        
      </div>

      <div className="rf-transporte">
      <h3>Información de Transporte</h3>
      <ul>
        <li><BusFront className="icon-style" /> <strong>Transporte incluido:</strong> no</li>
        <li><Contact className="icon-style" /><strong>Nombre:</strong>  </li>
        <li><PhoneCall className='icon-style'/> <strong>Numero d etelefono:</strong>  </li>
        <li><Clock className='icon-style'/><strong>Hora de recogida:</strong> 8:00 AM</li>
      </ul>
      
    </div>
    </div>
  );
};

export default ReservacionesForm;