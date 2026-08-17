import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  Calendar1,
  CalendarCheck,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Clock,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  Phone,
  Ship,
  ShoppingBag,
  Smile,
  User,
  UserRound,
  Users,
  UsersRound,
  CheckCircle,
  LockKeyhole,
  TriangleAlert,
  Search,
  Lock,
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import '../styles/ReservationStep.css';
import iamgen1 from '../assets/image/image1.png';
import {
  crearReserva,
  FechasOcupadas,
  buscarReservaPorCodigo,
} from '../service/Reserva.service';
import { AuthContext } from '../context/AuthContext';
import { useReserva } from '../context/ReservaContext';

const steps = [
  'Fecha y Hora',
  'Datos Personales',
  'Adicionales',
  'Confirmación',
  'Pago',
];

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
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [buscandoReserva, setBuscandoReserva] = useState(false);
  const [reservaEncontrada, setReservaEncontrada] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  // const reserva = await buscarReservaPorCodigo(codigoBusqueda);

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
    const cargarFechas = async () => {
      try {
        const fechas = await FechasOcupadas();

        if (Array.isArray(fechas)) {
          setFechasOcupadas(fechas);
        }
      } catch (error) {
        console.error(
          'Error al cargar fechas ocupadas:',
          error.message || error
        );
      }
    };

    cargarFechas();
  }, []);

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
    {
      name: 'Caña de pescar',
      price: 150,
      max: 5,
      category: 'Equipo',
      img: iamgen1,
    },
    {
      name: 'Cámara acuática',
      price: 200,
      max: 3,
      category: 'Equipo',
      img: '/images/camara-acuatica.png',
    },
    {
      name: 'Equipo de snorkel',
      price: 100,
      max: 10,
      category: 'Seguridad',
      img: '/images/snorkel.png',
    },
    {
      name: 'Sombrilla',
      price: 50,
      max: 5,
      category: 'Comodidad',
      img: '/images/sombrilla.png',
    },
    {
      name: 'Hielera personal',
      price: 80,
      max: 5,
      category: 'Comodidad',
      img: '/images/hielera.png',
    },
    {
      name: 'Chaleco salvavidas',
      price: 0,
      max: 10,
      category: 'Seguridad',
      img: '/images/chaleco.png',
      included: true,
    },
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

    if (stepNumber === 4) {
      try {
        setReservaState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const reservaData = {
          fechaReserva: data.date,
          hora: data.time,
          numeroPersonas: Number(data.guests),
          nombreCompleto: data.name,
          email: data.email,
          numeroTelefono: data.phone,
          precio: totals.total,
          equipo: {
            alquilar: data.alquilarEquipo,
            precio: data.alquilarEquipo ? 500 : 0,
          },
        };

        const response = await crearReserva(reservaData);

        setReservaState((prev) => ({
          ...prev,
          loading: false,
          reserva: response,
          error: null,
        }));

        setError(null);

        navigate('/reservaciones/steps/5');
      } catch (error) {
        console.error(error);

        setReservaState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }

      return;
    }

    setError(null);

    navigate(`/reservaciones/steps/${stepNumber + 1}`);
  };

  const prevStep = () => {
    if (stepNumber > 1) navigate(`/reservaciones/steps/${stepNumber - 1}`);
  };

  const buscarReserva = async () => {
    if (!codigoBusqueda.trim()) {
      setErrorBusqueda('Ingresa un código de reserva.');
      return;
    }

    try {
      setBuscandoReserva(true);
      setErrorBusqueda(null);
      setReservaEncontrada(null);

      const reserva = await buscarReservaPorCodigo(
        codigoBusqueda.trim().toUpperCase()
      );

      setReservaEncontrada(reserva);

      console.log('Reserva encontrada:', reserva);
    } catch (error) {
      setErrorBusqueda(error.message);
    } finally {
      setBuscandoReserva(false);
    }
  };

  const hoy = new Date();

  let pasoActual = 1;

  if (reservaEncontrada) {
    const hoy = new Date();
    const fechaTour = new Date(reservaEncontrada.fechaReserva);

    if (reservaEncontrada.payment) {
      pasoActual = 2;
    }

    if (reservaEncontrada.payment && fechaTour < hoy) {
      pasoActual = 3;
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);

    setData((prev) => ({
      ...prev,
      date: formatFechaISO(date),
    }));
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

  // const formatFechaCorta = (date) =>
  //   `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const formatFechaISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const filteredItems =
    activeCategory.toLowerCase() === 'todos los artículos'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className='reserva-container'>
      <h1 className='title-container'>Reservación de Tour</h1>
      <p className='subtitle-container'>
        Reserve su experiencia en pocos pasos
      </p>

      <div className='steps-container'>
        <div className='steps'>
          {steps.map((label, index) => {
            const currentStep = index + 1;

            const isActive = stepNumber === currentStep;
            const isCompleted =
              stepNumber > currentStep ||
              (stepNumber >= 5 && currentStep === 5);

            let stepClass = '';

            if (isCompleted) {
              stepClass = 'completed';
            } else if (isActive) {
              stepClass = 'active';
            }

            return (
              <div key={index} className='step'>
                <span className={`step-span ${stepClass}`}>
                  <div className='step-number'>
                    {isCompleted ? (
                      <Check className='step-check' />
                    ) : (
                      currentStep
                    )}
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

            if (stepNumber >= 5) {
              lineClass = 'completed';
            } else if (stepNumber > currentStep) {
              lineClass = 'completed';
            } else if (stepNumber === currentStep) {
              lineClass = 'active';
            }

            return <div key={index} className={`step-line ${lineClass}`}></div>;
          })}
        </div>
      </div>

      <div className='reservation-tour'>
        <div className='reservation-content'>
          <aside className='reservation-sidebar'>
            <div className='lookup-header'>
              <div className='lookup-icon'>
                <Search size={22} />
              </div>

              <div className='lookup-header-info'>
                <h3>CONSULTAR RESERVA</h3>
                <p>Recupera una reserva existente</p>
              </div>
            </div>

            <div className='lookup-form'>
              <label>Código de reserva</label>

              <div className='lookup-input'>
                <input
                  type='text'
                  placeholder='FFH-XXXXXX'
                  value={codigoBusqueda}
                  onChange={(e) =>
                    setCodigoBusqueda(e.target.value.toUpperCase())
                  }
                />

                <Search size={18} className='lookup-search-icon' />
              </div>

              {errorBusqueda && (
                <small className='lookup-error'>{errorBusqueda}</small>
              )}

              <button className='lookup-button' onClick={buscarReserva}>
                <Search size={17} />
                Buscar reserva
              </button>
            </div>

            <div className='lookup-divider'>
              <span>o</span>
            </div>

            {!reservaEncontrada ? (
              <>
                <div className='lookup-info'>
                  <CircleAlert size={18} className='lookup-info-icon' />

                  <span>
                    Ingresa el código de reserva que recibiste por correo
                    electrónico para ver los detalles de tu reservación.
                  </span>
                </div>

                <div className='lookup-example'>
                  <small>Ejemplo de código:</small>

                  <div className='lookup-code'>FFH-XXXXXX</div>
                </div>
              </>
            ) : (
              <div className='reservation-result'>
                <div className='reservation-success'>
                  <h3>¡Reserva encontrada!</h3>
                  <p>Tu reserva está activa.</p>
                </div>

                <div className='reservation-code-card'>
                  <small>CÓDIGO DE RESERVA</small>

                  <h2>{reservaEncontrada.codigoReserva}</h2>
                </div>

                <div className='reservation-status'>
                  <span>Estado de pago</span>

                  <span
                    className={`status ${
                      reservaEncontrada.paymentStatus === 'PAID'
                        ? 'paid'
                        : 'pending'
                    }`}
                  >
                    {reservaEncontrada.paymentStatus === 'PAID'
                      ? 'PAGADO'
                      : 'PENDIENTE'}
                  </span>
                </div>

                <div className='reservation-section'>
                  <h4>DETALLES DEL TOUR</h4>

                  <div className='reservation-row'>
                    <span>Fecha del tour</span>

                    <strong>
                      {(() => {
                        const [year, month, day] =
                          reservaEncontrada.fechaReserva.split('-').map(Number);

                        return new Date(
                          year,
                          month - 1,
                          day
                        ).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        });
                      })()}
                    </strong>
                  </div>

                  <div className='reservation-row'>
                    <span>Hora</span>

                    <strong>{reservaEncontrada.hora}</strong>
                  </div>

                  <div className='reservation-row'>
                    <span>Personas</span>

                    <strong>{reservaEncontrada.numeroPersonas}</strong>
                  </div>

                  <div className='reservation-row'>
                    <span>Total a pagar</span>

                    <strong>
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(reservaEncontrada.totalPagar)}
                    </strong>
                  </div>
                </div>

                <div className='reservation-section'>
                  <h4>CLIENTE</h4>

                  <div className='reservation-client'>
                    <strong>{reservaEncontrada.nombreCompleto}</strong>

                    <span>{reservaEncontrada.email}</span>
                  </div>
                </div>

                <div className='reservation-section'>
                  <h4>PROGRESO DE TU RESERVA</h4>

                  <div className='reservation-progress'>
                    <div
                      className={`progress-step ${
                        pasoActual >= 1 ? 'active completed' : ''
                      }`}
                    >
                      <div className='progress-circle'></div>

                      <span>Pendiente</span>
                    </div>

                    <div
                      className={`progress-step ${
                        pasoActual === 2
                          ? 'active'
                          : pasoActual > 2
                            ? 'completed'
                            : ''
                      }`}
                    >
                      <div className='progress-circle'></div>

                      <span>Confirmada</span>
                    </div>

                    <div
                      className={`progress-step ${
                        pasoActual === 3 ? 'active complete' : ''
                      }`}
                    >
                      <div className='progress-circle'></div>

                      <span>Realizado</span>
                    </div>
                  </div>
                </div>

                <div className='reservation-actions'>
                  {reservaEncontrada.paymentStatus === 'PAID' ? (
                    <button
                      className='download-btn'
                      onClick={() =>
                        window.open(reservaEncontrada.pdfUrl, '_blank')
                      }
                    >
                      Descargar comprobante
                    </button>
                  ) : (
                    <button className='pay-btn'>Realizar pago</button>
                  )}
                </div>
              </div>
            )}
          </aside>

          <div className='tour-details'>
            {stepNumber === 1 && (
              <div>
                <h2>
                  <Calendar1 /> Seleccione fecha y hora del tour
                </h2>
                <div className='tour-option'>
                  <h3>
                    <MapPin /> Fly Fishing Holbox
                  </h3>
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
                          const fecha = formatFechaISO(date);
                          return fechasOcupadas.some(
                            (f) => f.fecha === fecha && f.cantidad >= 2
                          );
                        }
                        return false;
                      }}
                      tileClassName={({ date, view }) => {
                        if (view !== 'month') return;

                        const fecha = formatFechaISO(date);

                        const match = fechasOcupadas.find(
                          (f) => f.fecha === fecha
                        );

                        if (!match) return 'disponible';

                        if (match.cantidad >= 2) return 'dia-ocupado-completo';

                        if (match.cantidad === 1) return 'dia-ocupado-parcial';

                        return 'disponible';
                      }}
                    />
                  </div>

                  <div className='tour-info'>
                    <div className='selected-details'>
                      <div className='form-group'>
                        <label>
                          <CalendarCheck className='icon-style' /> Fecha
                          seleccionada
                        </label>
                        <input
                          type='text'
                          value={data.date || 'Seleccione una fecha'}
                          disabled
                        />
                      </div>
                      <div className='form-group'>
                        <label>
                          <Clock className='icon-style' /> Hora
                        </label>
                        <select
                          value={data.time}
                          onChange={(e) => updateData('time', e.target.value)}
                        >
                          <option value='09:00'>09:00</option>
                          <option value='10:00'>10:00</option>
                          <option value='11:00'>11:00</option>
                          <option value='12:00'>12:00</option>
                        </select>
                      </div>
                      <div className='form-group'>
                        <label>
                          <UsersRound className='icon-style' /> Número de
                          personas
                        </label>
                        <select
                          value={data.guests}
                          onChange={(e) => updateData('guests', e.target.value)}
                        >
                          <option value='1'>1 persona</option>
                          <option value='2'>2 personas</option>
                          <option value='3'>3 personas</option>
                        </select>
                      </div>

                      <div className='security-info'>
                        <div className='security-icon'>
                          <Lock size={24} />
                        </div>

                        <div className='security-text'>
                          <h4>Tu información es segura</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='calendar-legend'>
                  <div>
                    <span className='dot available'></span>
                    Disponible
                  </div>

                  <div>
                    <span className='dot partial'></span>
                    Pocos lugares
                  </div>

                  <div>
                    <span className='dot full'></span>
                    No disponible
                  </div>
                </div>
              </div>
            )}

            {stepNumber === 2 && (
              <div>
                <h2>
                  <FileText /> Datos Personales
                </h2>
                <div className='form-group'>
                  <label>
                    <UserRound className='icon-style' /> Nombre Completo
                  </label>
                  <input
                    type='text'
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    placeholder='Nombre Completo'
                  />
                </div>
                <div className='form-group'>
                  <label>
                    <Mail className='icon-style' /> Email
                  </label>
                  <input
                    type='email'
                    value={data.email}
                    onChange={(e) => updateData('email', e.target.value)}
                    placeholder='Correo Electrónico'
                  />
                </div>
                <div className='form-group'>
                  <label>
                    <Phone className='icon-style' /> Teléfono
                  </label>
                  <div className='phone-container'>
                    <PhoneInput
                      defaultCountry={countryCode}
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      international
                      countryCallingCodeEditable={false}
                      className='phone-input'
                      inputProps={{
                        readOnly: true,
                        style: {
                          pointerEvents: 'none',
                          backgroundColor: '#f5f5f5',
                          cursor: 'default',
                        },
                      }}
                    />
                    <input
                      type='tel'
                      value={localPhoneNumber}
                      onChange={handleLocalPhoneChange}
                      placeholder='Número de teléfono'
                      className='phone-number-input'
                    />
                  </div>
                  <p>Código de país seleccionado: {phoneNumber}</p>
                  {!isValid && localPhoneNumber.length > 0 && (
                    <p className='error-message'>
                      Número de teléfono no válido
                    </p>
                  )}
                </div>
              </div>
            )}

            {stepNumber === 3 && (
              <div>
                <h2>
                  <ShoppingBag /> Adicionales para tu Tour
                </h2>
                <div className='rf-info'>
                  <h3>
                    <CircleHelp className='icon-style' /> Información del Tour
                  </h3>
                  <div className='rf-info-column'>
                    <ul>
                      <li>
                        <Clock className='icon-style' />
                        <strong>Duración del Tour:</strong> <span>3 horas</span>
                      </li>
                      <li>
                        <Ship className='icon-style' />
                        <strong>Tipo de Embarcación:</strong>{' '}
                        <span>Lancha rápida</span>
                      </li>
                      <li>
                        <MapPin className='icon-style' />
                        <strong>Punto de Partida:</strong>{' '}
                        <span>Muelle Principal, Puerto Aventura</span>
                      </li>
                      <li>
                        <Phone className='icon-style' />
                        <strong>Teléfono:</strong> <span>(123) 456-7890</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='tour-includes'>
                  <h3>Lo que incluye el tour (500 USD):</h3>
                  <div className='includes-grid'>
                    <div className='include-item'>
                      <strong>Transporte marítimo</strong>
                      <p>Ida y vuelta en catamarán de lujo</p>
                    </div>
                    <div className='include-item'>
                      <strong>Comida gourmet</strong>
                      <p>Buffet con opciones vegetarianas disponibles</p>
                    </div>
                    <div className='include-item'>
                      <strong>Servicio fotográfico</strong>
                      <p>Fotos digitales de la experiencia</p>
                    </div>
                    <div className='include-item'>
                      <strong>Guía certificado</strong>
                      <p>Guía bilingüe especializado en la zona</p>
                    </div>
                    <div className='include-item'>
                      <strong>Bebidas premium</strong>
                      <p>Barra libre de bebidas nacionales</p>
                    </div>
                    <div className='include-item'>
                      <strong>Seguro de viaje</strong>
                      <p>Cobertura durante toda la actividad</p>
                    </div>
                  </div>
                </div>
                <div className='slect-articulos'>
                  <h2>Paquete de Equipo Completo:</h2>
                  <div className='filter-buttons'>
                    {[
                      'Todos los artículos',
                      'Equipo',
                      'Seguridad',
                      'Comodidad',
                      'Entretenimiento',
                    ].map((category) => (
                      <button
                        key={category}
                        className={activeCategory === category ? 'active' : ''}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className='items-container'>
                    {filteredItems.map((item, index) => (
                      <div
                        key={index}
                        className={`item-card ${item.included ? 'included' : ''}`}
                      >
                        <div className='item-top'>
                          <div className='item-image'>
                            <img src={item.img} alt={item.name} />
                          </div>
                          <div className='item-info'>
                            <h3>{item.name}</h3>
                            <p>{item.category}</p>
                          </div>
                        </div>
                        <p className='max-info'>
                          Descripción de cada elemento que conforma el paquete
                          del equipo
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='full-equipment-rental'>
                  <div className='equipment-package'>
                    <div className='package-header'>
                      <h3>Alquiler de equipo completo</h3>
                      <p className='package-description'>
                        Si no cuenta con equipo propio, podemos proporcionarle
                        todo lo necesario.
                      </p>
                    </div>
                    <div className='package-content'>
                      <div className='package-toggle'>
                        <label className='toggle-switch'>
                          <input
                            type='checkbox'
                            checked={data.alquilarEquipo}
                            onChange={handlePackageSelection}
                          />
                          <span className='toggle-slider'></span>
                          <span className='toggle-label'>
                            Deseo alquilar el equipo completo
                          </span>
                        </label>
                      </div>
                      <div className='package-price-display'>
                        <strong className='price-amount'>1000.00 pesos</strong>
                        <span className='price-conversion'>
                          Equivalente a 50 USD
                        </span>
                      </div>
                    </div>
                    <p className='package-note'>
                      Nota: El chaleco salvavidas es obligatorio y está incluido
                      en el precio base del tour.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {stepNumber === 4 && (
              <div>
                <h2>
                  <FileCheck /> Confirmar Datos de Reservación
                </h2>
                <div className='reservation-summary'>
                  <div className='summary-card'>
                    <div className='summary-column'>
                      <div className='summary-item'>
                        <Calendar1 className='icon-style' />
                        <p>
                          <strong>Fecha:</strong> {data.date}
                        </p>
                      </div>
                      <div className='summary-item'>
                        <Clock className='icon-style' />
                        <p>
                          <strong>Hora:</strong> {data.time}
                        </p>
                      </div>
                      <div className='summary-item'>
                        <Users className='icon-style' />
                        <p>
                          <strong>Personas:</strong> {data.guests}
                        </p>
                      </div>
                    </div>
                    <div className='summary-column'>
                      <div className='summary-item'>
                        <User className='icon-style' />
                        <p>
                          <strong>Nombre:</strong> {data.name}
                        </p>
                      </div>
                      <div className='summary-item'>
                        <Mail className='icon-style' />
                        <p>
                          <strong>Email:</strong> {data.email}
                        </p>
                      </div>
                      <div className='summary-item'>
                        <Phone className='icon-style' />
                        <p>
                          <strong>Teléfono:</strong> {data.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='tour-summary-container'>
                  <div className='tour-summary-section'>
                    <h3>Lo que incluye su tour:</h3>
                    <div className='included-items-grid'>
                      {[
                        'Transporte marítimo',
                        'Guía certificado',
                        'Comida gourmet',
                        'Bebidas premium',
                        'Servicio fotográfico',
                        'Seguro de viaje',
                      ].map((item) => (
                        <div key={item} className='included-item'>
                          <CheckCircle className='icon-check' />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='equipment-summary-section'>
                    <h3>Equipo incluido en su reservación:</h3>
                    <div className='equipment-package-summary'>
                      <h4>Paquete completo de equipo</h4>
                      <p>
                        Incluye: equipo de snorkel, chaleco salvavidas, equipo
                        de pesca y zapatos acuáticos y más artículos
                      </p>
                      <div className='equipment-price'>
                        <strong>1000.00 pesos</strong>
                        <span>Equivalente a 50 USD</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='payment-summary'>
                  <div className='payment-header'>
                    <h3>Resumen de pago</h3>
                  </div>
                  <div className='payment-details'>
                    <div className='payment-row'>
                      <span className='payment-label'>Tour básico</span>
                      <span className='payment-amount'>
                        {totals.basePrice} pesos
                      </span>
                    </div>
                    {data.alquilarEquipo && (
                      <div className='payment-row'>
                        <span className='payment-label'>
                          Alquiler de equipo
                        </span>
                        <span className='payment-amount'>
                          {totals.equipmentPrice} pesos
                        </span>
                      </div>
                    )}
                    <div className='payment-total'>
                      <span className='payment-total-label'>Total a Pagar</span>
                      <span className='payment-total-amount'>
                        ${totals.total}
                      </span>
                    </div>
                    <div className='payment-method'>
                      <p className='payment-method-title'>Método de pago:</p>
                      <p className='payment-method-detail'>
                        Se procesará el pago en el siguiente paso
                      </p>
                    </div>
                  </div>
                </div>
                <div className='important-info'>
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

            {stepNumber === 5 && (
              <div className='pending-payment-step modern-card'>
                <h2 className='confirmation-title'>
                  ¡Solicitud de reserva recibida!
                </h2>

                <p className='confirmation-subtitle'>
                  Hemos apartado tu fecha de manera temporal mientras realizas
                  el pago por transferencia bancaria.
                </p>

                <div className='alert-box'>
                  <strong>Importante</strong>

                  <p>
                    Dispones de <strong>24 horas</strong> para realizar tu
                    transferencia. Después de ese tiempo, la reserva será
                    cancelada automáticamente y la fecha volverá a estar
                    disponible.
                  </p>
                </div>

                <div className='info-card'>
                  <h3>Detalles de tu reserva</h3>

                  <p>
                    <strong>Código</strong>
                    <span>{reservaState.reserva?.codigoReserva}</span>
                  </p>

                  <p>
                    <strong>Fecha</strong>
                    <span>{data?.date}</span>
                  </p>

                  <p>
                    <strong>Hora</strong>
                    <span>{data?.time}</span>
                  </p>

                  <p>
                    <strong>Personas</strong>
                    <span>{data?.guests}</span>
                  </p>

                  <p>
                    <strong>Total a pagar</strong>
                    <span>${totals.total}</span>
                  </p>
                </div>

                <div className='info-card'>
                  <h3>Datos para la transferencia</h3>

                  <p>
                    <strong>Banco:</strong>
                    <span>BBVA</span>
                  </p>

                  <p>
                    <strong>Beneficiario:</strong>
                    <span>Fly Fishing Holbox</span>
                  </p>

                  <p>
                    <strong>Cuenta:</strong>
                    <span>0123456789</span>
                  </p>

                  <p>
                    <strong>CLABE:</strong>
                    <span>012345678901234567</span>
                  </p>

                  <p>
                    <strong>Referencia:</strong>
                    <span>{reservaState.reserva?.codigoReserva}</span>
                  </p>
                </div>

                <div className='email-notice'>
                  <h3>Revisa tu correo electrónico</h3>

                  <p>
                    Hemos enviado un correo a <strong>{data?.email}</strong> con
                    las instrucciones para realizar la transferencia y tu código
                    de reserva.
                  </p>

                  <p>
                    Si no encuentras el correo, revisa tu carpeta de spam o
                    correo no deseado.
                  </p>
                </div>

                <button
                  className='confirmation-button modern-button'
                  onClick={() => {
                    clearReserva();
                    navigate('/');
                  }}
                >
                  Finalizar
                </button>
              </div>
            )}

            <div className='step-buttons'>
              {stepNumber > 1 && stepNumber < 5 && (
                <button className='prev-button' onClick={prevStep}>
                  <ChevronLeft /> Anterior
                </button>
              )}
              {stepNumber < 5 && (
                <button className='next-button' onClick={nextStep}>
                  Siguiente <ChevronRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
