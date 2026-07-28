import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  Calendar1, CalendarCheck, Check, X, ChevronLeft, ChevronRight,
  CircleAlert, CircleHelp, Clock, FileCheck, FileText, Mail, MapPin,
  Phone, Ship, ShoppingBag, Smile, User, UserRound, Users, UsersRound,
  CheckCircle, LockKeyhole, TriangleAlert,
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import '../styles/ReservationStep.css';
import iamgen1 from '../assets/image/image1.png';
import { crearReserva, FechasOcupadas } from '../service/Reserva.service';
import { AuthContext } from '../context/AuthContext';
import { useReserva } from '../context/ReservaContext';

const steps = ['Fecha y Hora', 'Datos Personales', 'Adicionales', 'Confirmación', 'Pago'];

export const ReservationStep = () => {
  const { step } = useParams();
  const [stepNumber, setStepNumber] = useState(1);
  const [localPhoneNumber, setLocalPhoneNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isValid, setIsValid] = useState(true);
  const [countryCode, setCountryCode] = useState('MX');
  const [phoneNumber, setPhoneNumber] = useState('+52');
  const [activeCategory, setActiveCategory] = useState('Todos los artículos');
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const authContext = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const { data, setData, clearReserva } = useReserva();
  const navigate = useNavigate();
  const [localToken, setLocalToken] = useState('');
  const [fechasOcupadas, setFechasOcupadas] = useState([]);

  // Sin sesión o con sesión: el flujo es el mismo.
  // Si hay token se usa; si no, se reserva como invitado automáticamente.

  const [reservaState, setReservaState] = useState({
    loading: false,
    error: null,
    reservaId: null,
    sessionUrl: null,
    sessionId: null,
    paymentStatus: null,
    paymentDetails: null,
  });

  useEffect(() => {
    setStepNumber(parseInt(step, 10) || 1);
  }, [step]);

  useEffect(() => {
    setError(null);
  }, [stepNumber]);

  const calculateTotal = () => {
    const basePrice = 12;
    const equipmentPrice = data.alquilarEquipo ? 500 : 0;
    return { basePrice, equipmentPrice, total: basePrice + equipmentPrice };
  };
  const totals = calculateTotal();

  useEffect(() => {
    const tokenSources = [
      localStorage.getItem('authToken'),
      authContext?.token,
      JSON.parse(localStorage.getItem('auth'))?.token,
    ].filter(Boolean);
    const token = tokenSources[0];
    if (!token) return;
    setAuthToken(token);

    const cargarFechas = async () => {
      try {
        const fechas = await FechasOcupadas(token);
        if (Array.isArray(fechas)) setFechasOcupadas(fechas);
      } catch (error) {
        console.error('Error al cargar fechas ocupadas:', error.message || error);
      }
    };
    cargarFechas();
  }, [authContext?.token]);

  useEffect(() => {
    setLocalToken(localStorage.getItem('authToken') || '');
  }, []);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (stepNumber === 5 && status) {
      setReservaState((prev) => ({
        ...prev,
        paymentStatus: status === 'succeeded' ? 'succeeded' : 'failed',
      }));
    }
  }, [location.search, stepNumber]);

  const items = [
    { name: 'Caña de pescar', price: 150, max: 5, category: 'Equipo', img: iamgen1 },
    { name: 'Cámara acuática', price: 200, max: 3, category: 'Equipo', img: '/images/camara-acuatica.png' },
    { name: 'Equipo de snorkel', price: 100, max: 10, category: 'Seguridad', img: '/images/snorkel.png' },
    { name: 'Sombrilla', price: 50, max: 5, category: 'Comodidad', img: '/images/sombrilla.png' },
    { name: 'Hielera personal', price: 80, max: 5, category: 'Comodidad', img: '/images/hielera.png' },
    { name: 'Chaleco salvavidas', price: 0, max: 10, category: 'Seguridad', img: '/images/chaleco.png', included: true },
  ];

  const handlePackageSelection = (event) => {
    setData((prev) => ({ ...prev, alquilarEquipo: event.target.checked }));
  };

  const updateData = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    if (stepNumber === 1 && !data.date) {
      setError('Por favor selecciona una fecha');
      return;
    }
    if (stepNumber === 2 && (!data.name || !data.email || !data.phone)) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Paso 4 → crear reserva y redirigir a Stripe
    if (stepNumber === 4) {
      try {
        setReservaState((prev) => ({ ...prev, loading: true, error: null }));

        // Token opcional: si existe se manda, si no se reserva como invitado
        const tokenSources = [
          localStorage.getItem('authToken'),
          authContext?.token,
          JSON.parse(localStorage.getItem('auth'))?.token,
        ].filter(Boolean);
        const token = tokenSources[0] || null;

        const reservaData = {
          fechaReserva: data.date,
          hora: data.time,
          numeroPersonas: parseInt(data.guests),
          nombreCompleto: data.name,
          email: data.email,
          numeroTelefono: data.phone,
          precio: 12,
          equipo: { alquilar: data.alquilarEquipo, precio: data.alquilarEquipo ? 500 : 0 },
          esInvitado: !token,  // true si no hay sesión iniciada
        };

        const response = await crearReserva(reservaData, token);

        if (!response?.sessionUrl || !response?.sessionId || !response?.reservaId) {
          throw new Error(response?.message || 'No se recibió sessionUrl en la respuesta');
        }

        window.location.href = response.sessionUrl;
      } catch (error) {
        console.error('Error en nextStep:', error.message);
        setReservaState((prev) => ({ ...prev, loading: false, error: error.message }));
      }
      return;
    }

    setError(null);
    if (stepNumber < 7) navigate(`/reservaciones/steps/${stepNumber + 1}`);
  };

  const prevStep = () => {
    if (stepNumber > 1) navigate(`/reservaciones/steps/${stepNumber - 1}`);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateData('date', date.toLocaleDateString());
  };

  const handlePhoneChange = (value) => {
    const safeValue = value || '+52';
    setPhoneNumber(safeValue);
    const fullNumber = safeValue + localPhoneNumber;
    setIsValid(fullNumber.length === 0 || isValidPhoneNumber(fullNumber));
    updateData('phone', fullNumber);
  };

  const handleLocalPhoneChange = (e) => {
    const value = e.target.value;
    setLocalPhoneNumber(value);
    const fullNumber = phoneNumber + value;
    setIsValid(fullNumber.length === 0 || isValidPhoneNumber(fullNumber));
    updateData('phone', fullNumber);
  };

  const handleCategoryChange = (category) => setActiveCategory(category);

  const handleIncrease = (index) => {
    setQuantities((prev) => {
      const current = prev[index] || 0;
      if (current < items[index].max) return { ...prev, [index]: current + 1 };
      return prev;
    });
  };

  const handleDecrease = (index) => {
    setQuantities((prev) => {
      const current = prev[index] || 0;
      if (current > 0) return { ...prev, [index]: current - 1 };
      return prev;
    });
  };

  const formatFechaCorta = (date) =>
    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const filteredItems =
    activeCategory.toLowerCase() === 'todos los artículos'
      ? items
      : items.filter((item) => item.category === activeCategory);



  return (
    <div className='reserva-container'>
      <h1 className='title-container'>Reservación de Tour</h1>
      <p className='subtitle-container'>Reserve su experiencia en pocos pasos</p>

      <div className='steps-container'>
        <div className='steps'>
          {steps.map((label, index) => {
            const currentStep = index + 1;
            const isStepFive = currentStep === 5;
            const paymentSucceeded = reservaState.paymentStatus === 'succeeded';
            const paymentFailed = reservaState.paymentStatus === 'failed';
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber > currentStep;

            let stepClass = '';
            if (isStepFive) {
              if (paymentSucceeded) stepClass = 'completed';
              else if (paymentFailed) stepClass = 'failled';
              else stepClass = isActive ? 'active' : '';
            } else {
              if (isActive) stepClass = 'active';
              else if (isCompleted) stepClass = 'completed';
            }

            return (
              <div key={index} className='step'>
                <span className={`step-span ${stepClass}`}>
                  <div className='step-number'>
                    {isStepFive && paymentSucceeded ? <Check className='step-check' />
                      : isStepFive && paymentFailed ? <X className='step-check' />
                      : isCompleted ? <Check className='step-check' />
                      : currentStep}
                  </div>
                  <div className='step-title'>{label}</div>
                </span>
              </div>
            );
          })}
        </div>

        <div className='step-lines'>
          {steps.map((_, index) => {
            const currentStep = index + 1;
            let lineClass = '';
            if (currentStep === 5 && reservaState.paymentStatus === 'failed') lineClass = 'failled';
            else if (currentStep === 5 && reservaState.paymentStatus === 'succeeded') lineClass = 'completed';
            else if (stepNumber > currentStep) lineClass = 'completed';
            else if (stepNumber === currentStep) lineClass = 'active';
            return <div key={index} className={`step-line ${lineClass}`}></div>;
          })}
        </div>
      </div>

      <div className='reservation-tour'>
        <div className='tour-details'>

          {stepNumber === 1 && (
            <div>
              <h2><Calendar1 /> Seleccione fecha y hora del tour</h2>
              <div className='tour-option'>
                <h3><MapPin /> Fly Fishing Holbox</h3>
                <p>Precio: 1000.00 pesos</p>
              </div>
              <div className='tour-content'>
                <div className='calendar-container'>
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    locale='es-ES'
                    minDate={new Date()}
                    tileDisabled={({ date, view }) => {
                      if (view === 'month') {
                        const fecha = formatFechaCorta(date);
                        return fechasOcupadas.some((f) => f.fecha === fecha && f.cantidad >= 2);
                      }
                      return false;
                    }}
                    tileClassName={({ date, view }) => {
                      if (view === 'month') {
                        const fecha = formatFechaCorta(date);
                        const match = fechasOcupadas.find((f) => f.fecha === fecha);
                        if (match?.cantidad >= 2) return 'dia-ocupado-completo';
                        if (match?.cantidad === 1) return 'dia-ocupado-parcial';
                      }
                      return null;
                    }}
                  />
                </div>
                <div className='tour-info'>
                  <div className='selected-details'>
                    <div className='form-group'>
                      <label><CalendarCheck className='icon-style' /> Fecha seleccionada</label>
                      <input type='text' value={data.date || 'Seleccione una fecha'} disabled />
                    </div>
                    <div className='form-group'>
                      <label><Clock className='icon-style' /> Hora</label>
                      <select value={data.time} onChange={(e) => updateData('time', e.target.value)}>
                        <option value='09:00'>09:00</option>
                        <option value='10:00'>10:00</option>
                        <option value='11:00'>11:00</option>
                        <option value='12:00'>12:00</option>
                      </select>
                    </div>
                    <div className='form-group'>
                      <label><UsersRound className='icon-style' /> Número de personas</label>
                      <select value={data.guests} onChange={(e) => updateData('guests', e.target.value)}>
                        <option value='1'>1 persona</option>
                        <option value='2'>2 personas</option>
                        <option value='3'>3 personas</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stepNumber === 2 && (
            <div>
              <h2><FileText /> Datos Personales</h2>
              <div className='form-group'>
                <label><UserRound className='icon-style' /> Nombre Completo</label>
                <input type='text' value={data.name} onChange={(e) => updateData('name', e.target.value)} placeholder='Nombre Completo' />
              </div>
              <div className='form-group'>
                <label><Mail className='icon-style' /> Email</label>
                <input type='email' value={data.email} onChange={(e) => updateData('email', e.target.value)} placeholder='Correo Electrónico' />
              </div>
              <div className='form-group'>
                <label><Phone className='icon-style' /> Teléfono</label>
                <div className='phone-container'>
                  <PhoneInput
                    defaultCountry={countryCode}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    international
                    countryCallingCodeEditable={false}
                    className='phone-input'
                    inputProps={{ readOnly: true, style: { pointerEvents: 'none', backgroundColor: '#f5f5f5', cursor: 'default' } }}
                  />
                  <input type='tel' value={localPhoneNumber} onChange={handleLocalPhoneChange} placeholder='Número de teléfono' className='phone-number-input' />
                </div>
                <p>Código de país seleccionado: {phoneNumber}</p>
                {!isValid && localPhoneNumber.length > 0 && <p className='error-message'>Número de teléfono no válido</p>}
              </div>
            </div>
          )}

          {stepNumber === 3 && (
            <div>
              <h2><ShoppingBag /> Adicionales para tu Tour</h2>
              <div className='rf-info'>
                <h3><CircleHelp className='icon-style' /> Información del Tour</h3>
                <div className='rf-info-column'>
                  <ul>
                    <li><Clock className='icon-style' /><strong>Duración del Tour:</strong> <span>3 horas</span></li>
                    <li><Ship className='icon-style' /><strong>Tipo de Embarcación:</strong> <span>Lancha rápida</span></li>
                    <li><MapPin className='icon-style' /><strong>Punto de Partida:</strong> <span>Muelle Principal, Puerto Aventura</span></li>
                    <li><Phone className='icon-style' /><strong>Teléfono:</strong> <span>(123) 456-7890</span></li>
                  </ul>
                </div>
              </div>
              <div className='tour-includes'>
                <h3>Lo que incluye el tour (500 USD):</h3>
                <div className='includes-grid'>
                  <div className='include-item'><strong>Transporte marítimo</strong><p>Ida y vuelta en catamarán de lujo</p></div>
                  <div className='include-item'><strong>Comida gourmet</strong><p>Buffet con opciones vegetarianas disponibles</p></div>
                  <div className='include-item'><strong>Servicio fotográfico</strong><p>Fotos digitales de la experiencia</p></div>
                  <div className='include-item'><strong>Guía certificado</strong><p>Guía bilingüe especializado en la zona</p></div>
                  <div className='include-item'><strong>Bebidas premium</strong><p>Barra libre de bebidas nacionales</p></div>
                  <div className='include-item'><strong>Seguro de viaje</strong><p>Cobertura durante toda la actividad</p></div>
                </div>
              </div>
              <div className='slect-articulos'>
                <h2>Paquete de Equipo Completo:</h2>
                <div className='filter-buttons'>
                  {['Todos los artículos', 'Equipo', 'Seguridad', 'Comodidad', 'Entretenimiento'].map((category) => (
                    <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => handleCategoryChange(category)}>
                      {category}
                    </button>
                  ))}
                </div>
                <div className='items-container'>
                  {filteredItems.map((item, index) => (
                    <div key={index} className={`item-card ${item.included ? 'included' : ''}`}>
                      <div className='item-top'>
                        <div className='item-image'><img src={item.img} alt={item.name} /></div>
                        <div className='item-info'><h3>{item.name}</h3><p>{item.category}</p></div>
                      </div>
                      <p className='max-info'>Descripción de cada elemento que conforma el paquete del equipo</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className='full-equipment-rental'>
                <div className='equipment-package'>
                  <div className='package-header'>
                    <h3>Alquiler de equipo completo</h3>
                    <p className='package-description'>Si no cuenta con equipo propio, podemos proporcionarle todo lo necesario.</p>
                  </div>
                  <div className='package-content'>
                    <div className='package-toggle'>
                      <label className='toggle-switch'>
                        <input type='checkbox' checked={data.alquilarEquipo} onChange={handlePackageSelection} />
                        <span className='toggle-slider'></span>
                        <span className='toggle-label'>Deseo alquilar el equipo completo</span>
                      </label>
                    </div>
                    <div className='package-price-display'>
                      <strong className='price-amount'>1000.00 pesos</strong>
                      <span className='price-conversion'>Equivalente a 50 USD</span>
                    </div>
                  </div>
                  <p className='package-note'>Nota: El chaleco salvavidas es obligatorio y está incluido en el precio base del tour.</p>
                </div>
              </div>
            </div>
          )}

          {stepNumber === 4 && (
            <div>
              <h2><FileCheck /> Confirmar Datos de Reservación</h2>
              <div className='reservation-summary'>
                <div className='summary-card'>
                  <div className='summary-column'>
                    <div className='summary-item'><Calendar1 className='icon-style' /><p><strong>Fecha:</strong> {data.date}</p></div>
                    <div className='summary-item'><Clock className='icon-style' /><p><strong>Hora:</strong> {data.time}</p></div>
                    <div className='summary-item'><Users className='icon-style' /><p><strong>Personas:</strong> {data.guests}</p></div>
                  </div>
                  <div className='summary-column'>
                    <div className='summary-item'><User className='icon-style' /><p><strong>Nombre:</strong> {data.name}</p></div>
                    <div className='summary-item'><Mail className='icon-style' /><p><strong>Email:</strong> {data.email}</p></div>
                    <div className='summary-item'><Phone className='icon-style' /><p><strong>Teléfono:</strong> {data.phone}</p></div>
                  </div>
                </div>
              </div>
              <div className='tour-summary-container'>
                <div className='tour-summary-section'>
                  <h3>Lo que incluye su tour:</h3>
                  <div className='included-items-grid'>
                    {['Transporte marítimo','Guía certificado','Comida gourmet','Bebidas premium','Servicio fotográfico','Seguro de viaje'].map((item) => (
                      <div key={item} className='included-item'><CheckCircle className='icon-check' /><span>{item}</span></div>
                    ))}
                  </div>
                </div>
                <div className='equipment-summary-section'>
                  <h3>Equipo incluido en su reservación:</h3>
                  <div className='equipment-package-summary'>
                    <h4>Paquete completo de equipo</h4>
                    <p>Incluye: equipo de snorkel, chaleco salvavidas, equipo de pesca y zapatos acuáticos y más artículos</p>
                    <div className='equipment-price'><strong>1000.00 pesos</strong><span>Equivalente a 50 USD</span></div>
                  </div>
                </div>
              </div>
              <div className='payment-summary'>
                <div className='payment-header'><h3>Resumen de pago</h3></div>
                <div className='payment-details'>
                  <div className='payment-row'><span className='payment-label'>Tour básico</span><span className='payment-amount'>{totals.basePrice} pesos</span></div>
                  {data.alquilarEquipo && (
                    <div className='payment-row'><span className='payment-label'>Alquiler de equipo</span><span className='payment-amount'>{totals.equipmentPrice} pesos</span></div>
                  )}
                  <div className='payment-total'><span className='payment-total-label'>Total a Pagar</span><span className='payment-total-amount'>${totals.total}</span></div>
                  <div className='payment-method'>
                    <p className='payment-method-title'>Método de pago:</p>
                    <p className='payment-method-detail'>Se procesará el pago en el siguiente paso</p>
                  </div>
                </div>
              </div>
              <div className='important-info'>
                <h2><CircleAlert /> Información importante</h2>
                <ul>
                  <li>Presentarse 30 minutos antes de la hora de salida</li>
                  <li>Llevar identificación oficial y comprobante de reservación</li>
                  <li>El tour puede cancelarse con 24 horas de anticipación con reembolso completo</li>
                  <li>En caso de mal tiempo, se reprogramará sin costo adicional</li>
                </ul>
              </div>
            </div>
          )}

          {stepNumber === 5 && (
            <div>
              {reservaState.paymentStatus === 'succeeded' ? (
                <div className='confirmation-step modern-card'>
                  <div className='confirmation-icon success-icon'><CheckCircle size={64} color='#4CAF50' /></div>
                  <h2 className='confirmation-title'>¡Pago realizado con éxito!</h2>
                  <p className='confirmation-subtitle'>Tu reserva ha sido confirmada. Recibirás un correo con los detalles.</p>
                  <div className='confirmation-details'>
                    <h3 className='details-title'>Detalles de la reserva:</h3>
                    <p><strong>Fecha:</strong> {data?.date}</p>
                    <p><strong>Hora:</strong> {data?.time}</p>
                    <p><strong>Personas:</strong> {data?.guests}</p>
                    <p><strong>Total pagado:</strong> ${totals.total}</p>
                  </div>
                  <button onClick={() => { clearReserva(); navigate('/reservaciones/steps/1'); }} className='confirmation-button modern-button'>
                    Finalizar Proceso de Reserva
                  </button>
                </div>
              ) : reservaState.paymentStatus === 'failed' ? (
                <div className='error-step modern-card'>
                  <h2 className='error-title'>Ocurrió un problema con tu pago</h2>
                  <p className='error-message'>Tu transacción fue cancelada o falló. No se ha realizado ningún cargo.</p>
                  <p className='error-instruction'>Puedes volver a intentarlo o revisar tu método de pago.</p>
                  <button onClick={() => { clearReserva(); navigate('/reservaciones/steps/1'); }} className='retry-button modern-button'>
                    Reintentar Reserva
                  </button>
                </div>
              ) : reservaState.loading ? (
                <div className='loading-state'><p>Cargando pasarela de pago...</p></div>
              ) : (
                <div className='error-state'>
                  <p>No se pudo inicializar la pasarela de pago</p>
                  {reservaState.error && <p className='error-detail'>{reservaState.error}</p>}
                  <button onClick={() => { clearReserva(); navigate('/reservaciones/steps/1'); }}>Volver a intentar</button>
                </div>
              )}
            </div>
          )}

        </div>

        <div className='step-buttons'>
          {stepNumber > 1 && stepNumber < 5 && (
            <button className='prev-button' onClick={prevStep}><ChevronLeft /> Anterior</button>
          )}
          {stepNumber < 5 && (
            <button className='next-button' onClick={nextStep}>Siguiente <ChevronRight /></button>
          )}
        </div>
      </div>
    </div>
  );
};