import React, {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input'; 
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Calendar1, CalendarCheck, Check, ChevronLeft, ChevronRight, CircleAlert, CircleHelp, Clock,  FileCheck,  FileText, Mail, MapPin, Phone, Ship, ShoppingBag, Smile, User, UserRound, Users, UsersRound, CheckCircle } from 'lucide-react';
import Flags from 'country-flag-icons/react/3x2'; // Importa las banderas
import 'react-calendar/dist/Calendar.css';
import '../styles/ReservationStep.css'; // Importamos el archivo CSS
import iamgen1 from '../assets/image/image1.png'

const steps = ["Fecha y Hora", "Datos Personales", "Adicionales", "Confirmación", "Pago"];

const ReservationStep = () => {
    const [step, setStep] = useState(1);
    const [localPhoneNumber, setLocalPhoneNumber] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [countryCode, setCountryCode] = useState("MX");
    const [activeCategory, setActiveCategory] = useState("Todos los artículos");
    const [quantities, setQuantities]= useState({});

    const [data, setData] = useState({
      date: "",
      time: "",
      guests: "",
      name: "",
      email: "",
      phone: "",
      extras: [],
    });

    const items = [
      {
        name: "Caña de pescar",
        price: 150,
        max: 5,
        category: "Equipo",
        img: iamgen1,
      },
      {
        name: "Cámara acuática",
        price: 200,
        max: 3,
        category: "Equipo",
        img: "/images/camara-acuatica.png",
      },
      {
        name: "Equipo de snorkel",
        price: 100,
        max: 10,
        category: "Seguridad",
        img: "/images/snorkel.png",
      },
      {
        name: "Sombrilla",
        price: 50,
        max: 5,
        category: "Comodidad",
        img: "/images/sombrilla.png",
      },
      {
        name: "Hielera personal",
        price: 80,
        max: 5,
        category: "Comodidad",
        img: "/images/hielera.png",
      },
      {
        name: "Chaleco salvavidas",
        price: 0,
        max: 10,
        category: "Seguridad",
        img: "/images/chaleco.png",
        included: true,
      },
    ];
    
// Manejar la selección del equipo completo
const [isPackageSelected, setIsPackageSelected] = useState(false);

// Manejar la selección del paquete completo
const handlePackageSelection = () => {
  setIsPackageSelected(!isPackageSelected);
  // A
};
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

      const handleCategoryChange = (category) =>{
        setActiveCategory(category);
      }

      const handleIncrease = (index) => {
        setQuantities((prevQuantities) => {
          const currentQuantity = prevQuantities[index] || 0;
          const maxQuantity = items[index].max;
    
          // Verifica que no se supere el máximo
          if (currentQuantity < maxQuantity) {
            return {
              ...prevQuantities,
              [index]: currentQuantity + 1,
            };
          }
          return prevQuantities; // No cambia si se alcanza el máximo
        });
      };

      const handleDecrease = (index) => {
        setQuantities((prevQuantities) => {
          const currentQuantity = prevQuantities[index] || 0;
    
          // Verifica que no sea menor que 0
          if (currentQuantity > 0) {
            return {
              ...prevQuantities,
              [index]: currentQuantity - 1,
            };
          }
          return prevQuantities; // No cambia si ya es 0
        });
      };

      const filteredItems =
  activeCategory.toLowerCase() === "todos los artículos"
    ? items
    : items.filter((item) => item.category === activeCategory);

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
                    {step === index + 1 ? (
                      index + 1
                    ) : step > index + 1 ? (
                      <Check className="step-check" />
                    ) : (
                      index + 1
                    )}
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
                <h2>
                  <FileText />
                  Datos Personales
                </h2>
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
                    <PhoneInput
                      defaultCountry={countryCode}
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      international
                      countryCallingCodeEditable={false}
                      className="phone-input"
                      inputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: "none",
                          backgroundColor: "#f5f5f5",
                          cursor: "default",
                        },
                      }}
                      onFocus={(e) => {
                       
                        document.querySelector(".phone-number-input")?.focus();
                      }}
                    />
                    <input
                      type="tel"
                      value={localPhoneNumber}
                      onChange={handleLocalPhoneChange}
                      placeholder="Número de teléfono"
                      className="phone-number-input"
                      // autoFocus={true}
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
                <h2>
                  <ShoppingBag /> Adicionales para tu Tour
                </h2>

                {/* Sección de información del tour */}
                <div className="rf-info">
                  <h3>
                    <CircleHelp className="icon-style" />
                    Información del Tour
                  </h3>

                  <div className="rf-info-column">
                    <ul>
                      <li>
                        <Clock className="icon-style" />
                        <strong>Duración del Tour:</strong> <span>3 horas</span>
                      </li>
                      <li>
                        <Ship className="icon-style" />
                        <strong>Tipo de Embarcación:</strong>{" "}
                        <span>Lancha rápida</span>
                      </li>
                      <li>
                        <MapPin className="icon-style" />
                        <strong>Punto de Partida:</strong>{" "}
                        <span>Muelle Principal, Puerto Aventura</span>
                      </li>
                      <li>
                        <Phone className="icon-style" />
                        <strong>Teléfono:</strong> <span>(123) 456-7890</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sección de lo que incluye el tour */}
                <div className="tour-includes">
                  <h3>Lo que incluye el tour (500 USD):</h3>
                  <div className="includes-grid">
                    <div className="include-item">
                      <strong>Transporte marítimo</strong>
                      <p>Ida y vuelta en catamarán de lujo</p>
                    </div>
                    <div className="include-item">
                      <strong>Comida gourmet</strong>
                      <p>Buffet con opciones vegetarianas disponibles</p>
                    </div>
                    <div className="include-item">
                      <strong>Servicio fotográfico</strong>
                      <p>Fotos digitales de la experiencia</p>
                    </div>
                    <div className="include-item">
                      <strong>Guía certificado</strong>
                      <p>Guía bilingüe especializado en la zona</p>
                    </div>
                    <div className="include-item">
                      <strong>Bebidas premium</strong>
                      <p>Barra libre de bebidas nacionales</p>
                    </div>
                    <div className="include-item">
                      <strong>Seguro de viaje</strong>
                      <p>Cobertura durante toda la actividad</p>
                    </div>
                  </div>
                </div>

                {/* Sección de selección de artículos original */}
                <div className="slect-articulos">
                  <h2>Paquete de quipo Completo:</h2>

                  <div className="filter-buttons">
                    {[
                      "Todos los artículos",
                      "Equipo",
                      "Seguridad",
                      "Comodidad",
                      "Entretenimiento",
                    ].map((category) => (
                      <button
                        key={category}
                        className={activeCategory === category ? "active" : ""}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="items-container">
                    {filteredItems.map((item, index) => (
                      <div
                        key={index}
                        className={`item-card ${
                          item.included ? "included" : ""
                        }`}
                      >
                        <div className="item-top">
                          <div className="item-image">
                            <img src={item.img} alt={item.name} />
                          </div>
                          <div className="item-info">
                            <h3>{item.name}</h3>
                            <p>{item.category}</p>
                          </div>
                        </div>

                        {/* <div className="price-controls"> */}
                        {/* {item.price > 0 ? (
                <strong>{item.price}.00 pesos</strong>
              ) : (
                <span className="included-badge">Incluido</span>
              )} */}

                        {/* <div className="quantity-controls">
                <button onClick={() => handleDecrease(index)}>
                  -
                </button>
                <span>{quantities[index] || 0}</span>
                <button onClick={() => handleIncrease(index)}>
                  +
                </button>
              </div> */}
                        {/* </div> */}

                        <p className="max-info">
                          Descripcion de cada elemneto que conforma el paquete
                          dl equipo
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de selección de paquete completo (mantenido como solicitaste) */}
                <div className="full-equipment-rental">
                  <div className="equipment-package">
                    <div className="package-header">
                      <h3>Alquiler de equipo completo</h3>
                      <p className="package-description">
                        Si no cuenta con equipo propio, podemos proporcionarle
                        todo lo necesario para disfrutar del tour.
                      </p>
                    </div>

                    <div className="package-content">
                      <div className="package-toggle">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={isPackageSelected}
                            onChange={handlePackageSelection}
                          />
                          <span className="toggle-slider"></span>
                          <span className="toggle-label">
                            Deseo alquilar el equipo completo
                          </span>
                        </label>
                      </div>

                      <div className="package-price-display">
                        <strong className="price-amount">1000.00 pesos</strong>
                        <span className="price-conversion">
                          Equivalente a 50 USD
                        </span>
                      </div>
                    </div>

                    <p className="package-note">
                      Nota: Si cuenta con su propio equipo, puede traerlo al
                      tour. El chaleco salvavidas es obligatorio y está incluido
                      en el precio base del tour.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2>
                  <FileCheck /> Confirmar Datos de Reservación
                </h2>

                {/* Resumen de datos personales */}
                <div className="reservation-summary">
                  <div className="summary-card">
                    <div className="summary-column">
                      <div className="summary-item">
                        <Calendar1 className="icon-style" />
                        <p>
                          <strong>Fecha:</strong> 25 de Octubre, 2023
                        </p>
                      </div>
                      <div className="summary-item">
                        <Clock className="icon-style" />
                        <p>
                          <strong>Hora:</strong> 10:00 AM
                        </p>
                      </div>
                      <div className="summary-item">
                        <Users className="icon-style" />
                        <p>
                          <strong>Personas:</strong> 4
                        </p>
                      </div>
                    </div>

                    <div className="summary-column">
                      <div className="summary-item">
                        <User className="icon-style" />
                        <p>
                          <strong>Nombre:</strong> Juan Pérez
                        </p>
                      </div>
                      <div className="summary-item">
                        <Mail className="icon-style" />
                        <p>
                          <strong>Email:</strong> juan.perez@example.com
                        </p>
                      </div>
                      <div className="summary-item">
                        <Phone className="icon-style" />
                        <p>
                          <strong>Teléfono:</strong> (123) 456-7890
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen del Tour - Versión mejorada */}
                <div className="tour-summary-container">
                  <div className="tour-summary-section">
                    <h3>Lo que incluye su tour:</h3>
                    <div className="included-items-grid">
                      <div className="included-item">
                        <CheckCircle className="icon-check" />
                        <span>Transporte marítimo</span>
                      </div>
                      <div className="included-item">
                        <CheckCircle className="icon-check" />
                        <span>Guía certificado</span>
                      </div>
                      <div className="included-item">
                        <CheckCircle className="icon-check" />
                        <span>Comida gourmet</span>
                      </div>
                      <div className="included-item">
                        <CheckCircle className="icon-check" />
                        <span>Bebidas premium</span>
                      </div>
                      <div className="included-item">
                        <CheckCircle className="icon-check" />
                        <span>Servicio fotográfico</span>
                      </div>
                      <div className="included-item">
                        <CheckCircle className="icon-check" />
                        <span>Seguro de viaje</span>
                      </div>
                    </div>
                  </div>

                  <div className="equipment-summary-section">
                    <h3>Equipo incluido en su reservación:</h3>
                    <div className="equipment-package-summary">
                      <h4>Paquete completo de equipo</h4>
                      <p>
                        Incluye: equipo de snorkel, chaleco salvavidas, equipo
                        de pesca y zapatos acuáticos y más artículos
                      </p>
                      <div className="equipment-price">
                        <strong>1000.00 pesos</strong>
                        <span>Equivalente a 50 USD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen de pago */}
                <div className="payment-summary">
                  <div className="payment-header">
                    <h3>Resumen de pago</h3>
                  </div>

                  <div className="payment-details">
                    <div className="payment-row">
                      <span className="payment-label">Tour básico</span>
                      <span className="payment-amount">10000.00 pesos</span>
                    </div>

                    <div className="payment-row">
                      <span className="payment-label">Alquiler de equipo</span>
                      <span className="payment-amount">1000.00 pesos</span>
                    </div>

                    <div className="payment-total">
                      <span className="payment-total-label">
                        Total a Pagar
                      </span>
                      <span className="payment-total-amount">
                        11000.00 pesos
                      </span>
                    </div>

                    <div className="payment-method">
                      <p className="payment-method-title">Método de pago:</p>
                      <p className="payment-method-detail">
                        Se procesará el pago en el siguiente paso
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información importante */}
                <div className="important-info">
                  <h2>
                    <CircleAlert /> Información importante
                  </h2>
                  <ul>
                    <li>Presentarse 30 minutos antes de la hora de salida</li>
                    <li>
                      Llevar identificación oficial y comprobante de reservación
                    </li>
                    <li>
                      El tour puede cancelarse con 24 horas de anticipación con
                      reembolso completo
                    </li>
                    <li>
                      En caso de mal tiempo, se reprogramará sin costo adicional
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="step-buttons">
            {step > 1 && (
              <button className="prev-button" onClick={prevStep}>
                <ChevronLeft /> Anterior
              </button>
            )}
            {step < 5 && (
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