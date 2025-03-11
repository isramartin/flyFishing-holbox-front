import React, {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input'; 
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Calendar1, CalendarCheck, ChevronLeft, ChevronRight, Clock, Mail, MapPin, Phone, UserRound, UsersRound } from 'lucide-react';
import Flags from 'country-flag-icons/react/3x2'; // Importa las banderas
import 'react-calendar/dist/Calendar.css';
import '../styles/ReservationStep.css'; // Importamos el archivo CSS

const steps = ["Fecha y Hora", "Datos Personales", "Adicionales", "Confirmación"];

const ReservationStep = () => {
    const [step, setStep] = useState(1);
    const [localPhoneNumber, setLocalPhoneNumber] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [countryCode, setCountryCode] = useState("MX");

    const [data, setData] = useState({
      date: "",
      time: "",
      guests: "",
      name: "",
      email: "",
      phone: "",
      extras: [],
    });
  
    const updateData = (field, value) => {
      setData((prev) => ({ ...prev, [field]: value }));
    };
  
    const nextStep = () => step < 4 && setStep(step + 1);
    const prevStep = () => step > 1 && setStep(step - 1);
  
    const handleDateChange = (date) => {
        setSelectedDate(date);
        updateData("date", date.toLocaleDateString());
      };

      const handlePhoneChange = (value) => {
        // Convertir `null` o `undefined` en una cadena vacía para evitar errores
        const safeValue = value || "";
        setPhoneNumber(value);
        validatePhone(value);
        setPhoneNumber(safeValue);
        setIsValid(safeValue.length === 0 || isValidPhoneNumber(safeValue)); // Validar si hay un número
        
      };

      const handleLocalPhoneChange = (e) => {
        const value = e.target.value;
        setLocalPhoneNumber(value);
        validatePhone(value);
      };

      const validatePhone = (value) => {
        // Expresión regular para validar un número de teléfono (ajusta según tus necesidades)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Validación básica para números internacionales
        setIsValid(phoneRegex.test(value));
      };


      const handleCountryChange = (value) => {
        if (value) {
          const country = value.split(" ")[0]; // Extrae el código del país
          setCountryCode(country.toUpperCase()); // Guarda el país en mayúsculas (ej: "US")
        }
      };
    
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
          alert(`Número de teléfono válido: ${phoneNumber}`);
        } else {
          alert('Número de teléfono no válido');
        }
      };
      
    return (
      <div className="reserva-container">
        <h1 className="title-container">Reservación de Tour</h1>
        <p className="subtitle-container">
          Reserve su experiencia en pocos pasos
        </p>

        <div className="steps-container">
          <div className="steps">
            {steps.map((label, index) => (
              <div key={index} className="step">
                <span
                  className={
                    step === index + 1
                      ? "active"
                      : step > index + 1
                      ? "completed"
                      : ""
                  }
                >
                  <div className="step-number">
                    {step === index + 1
                      ? index + 1
                      : step > index + 1
                      ? "✔"
                      : index + 1}
                  </div>
                  <div className="step-title">{label}</div>
                </span>
              </div>
            ))}
          </div>
          <div className="step-lines">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`step-line ${step >= index + 1 ? "active" : ""}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="reservation-tour">
          <div className="tour-details">
            {step === 1 && (
              <div>
                {/* Encabezado con título */}
                <h2>
                  {" "}
                  <Calendar1 /> Seleccione fecha y hora del tour
                </h2>

                {/* Información del tour */}
                <div className="tour-option">
                  <h3>
                    {" "}
                    <MapPin /> Fly Fishing Holbox
                  </h3>
                  <p>Precio: 1000.00 pesos</p>
                </div>

                {/* Contenedor principal con columnas */}
                <div className="tour-content">
                  {/* Calendario a la izquierda */}
                  <div className="calendar-container">
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate}
                      locale="es-ES"
                      minDate={new Date()}
                    />
                  </div>

                  {/* Formulario a la derecha */}
                  <div className="tour-info">
                    <div className="selected-details">
                      <div className="form-group">
                        <label>
                          <CalendarCheck className="icon-style" />
                          Fecha seleccionada
                        </label>
                        <input
                          type="text"
                          value={data.date || "Seleccione una fecha"}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <Clock className="icon-style" />
                          Hora
                        </label>
                        <select
                          value={data.time}
                          onChange={(e) => updateData("time", e.target.value)}
                        >
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>
                          <UsersRound className="icon-style" />
                          Número de personas
                        </label>
                        <select
                          value={data.guests}
                          onChange={(e) => updateData("guests", e.target.value)}
                        >
                          <option value="1">1 persona</option>
                          <option value="2">2 personas</option>
                          <option value="3">3 personas</option>
                          <option value="4">4 personas</option>
                          <option value="5">5 personas</option>
                          <option value="6">6 personas</option>
                          <option value="7">7 personas</option>
                        </select>
                        <p className="price-info">
                          Precio por persona:{" "}
                          {data.guests
                            ? (1000 / data.guests).toFixed(2)
                            : "0.00"}{" "}
                          pesos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2>Datos Personales</h2>
                <div className="form-group">
                  <label>
                    <UserRound className="icon-style" /> Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateData("name", e.target.value)}
                    placeholder="Nombre Completo"
                  />
                </div>
                <div className="form-group">
                  <label>
                    {" "}
                    <Mail className="icon-style" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData("email", e.target.value)}
                    placeholder="Correo Electronico"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <Phone className="icon-style" />
                    Teléfono
                  </label>
                  <div className="phone-container">
                    {/* ÚNICO INPUT QUE MANEJA TODO (banderas, código de país y número) */}
                    <PhoneInput
                      defaultCountry={countryCode} // País inicial
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      international
                      countryCallingCodeEditable={false} // Bloquea edición del código de país
                      className="phone-input no-focus-style"
                    />
                    <input
                      type="numbr"
                      value={localPhoneNumber}
                      onChange={handleLocalPhoneChange}
                      placeholder="Número de teléfono"
                      className="phone-number-input"
                    />
                  </div>

                  <p>Código de país seleccionado: {phoneNumber}</p>

                  {/* Mensaje de error si el número es inválido */}
                  {!isValid && localPhoneNumber.length > 0 && (
                    <p className="error-message">
                      Número de teléfono no válido
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2>Selecciona Adicionales</h2>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      onChange={() =>
                        updateData("extras", [...data.extras, "Champagne"])
                      }
                    />{" "}
                    Champagne
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() =>
                        updateData("extras", [...data.extras, "Comida"])
                      }
                    />{" "}
                    Comida
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2>Resumen de Reservación</h2>
                <p>
                  <strong>Fecha:</strong> {data.date}
                </p>
                <p>
                  <strong>Hora:</strong> {data.time}
                </p>
                <p>
                  <strong>Personas:</strong> {data.guests}
                </p>
                <p>
                  <strong>Nombre:</strong> {data.name}
                </p>
                <p>
                  <strong>Email:</strong> {data.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {data.phone}
                </p>
                <p>
                  <strong>Extras:</strong> {data.extras.join(", ") || "Ninguno"}
                </p>
              </div>
            )}
          </div>

          <div className="step-buttons">
            {step > 1 && (
              <button className="prev-button" onClick={prevStep}>
                <ChevronLeft /> Anterior
              </button>
            )}
            {step < 4 && (
              <button className="next-button" onClick={nextStep}>
                {" "}
                Siguiente <ChevronRight />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
export default ReservationStep;