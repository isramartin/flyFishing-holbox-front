import React, { useRef, useState, useEffect, useContext } from 'react';
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
  ShieldCheck,
  Pencil,
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import '../styles/ReservationStep.css';
import {
  crearReserva,
  FechasOcupadas,
  buscarReservaPorCodigo,
  capturarPagoPayPal,
  crearSesionReserva,
} from '../service/Reserva.service';
import { AuthContext } from '../context/AuthContext';
import { useReserva } from '../context/ReservaContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAlert } from './AlertManager';
import PageHeader from './PageHeader';
import imagen1 from '../assets/image/image1.png';
import ReservationCountdown from './ReservationCountdown';
import ReservationSessionNotice from './ReservationSessionNotice';

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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paypalSession, setPaypalSession] = useState(null);
  const [paypalSdk, setPaypalSdk] = useState(null);
  const paypalButtonRef = useRef(null);
  const { addAlert } = useAlert();
  const [reservationSession, setReservationSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [reservaIniciada, setReservaIniciada] = useState(false);
  const [iniciandoReserva, setIniciandoReserva] = useState(false);
  const [mostrarAvisoSesion, setMostrarAvisoSesion] = useState(false);

  const [mostrarAvisoInicio, setMostrarAvisoInicio] = useState(true);
  const [mostrarAvisoExpiracion, setMostrarAvisoExpiracion] = useState(false);

  // const reserva = await buscarReservaPorCodigo(codigoBusqueda);

  // Sin sesión o con sesión: el flujo es el mismo.
  // Si hay token se usa; si no, se reserva como invitado automáticamente.

  useEffect(() => {
    if (token) {
      console.log('🔐 TOKEN DISPONIBLE PARA PAYPAL:', `***${token.slice(-6)}`);
    } else {
      console.log('🔐 TOKEN PARA PAYPAL: NO DISPONIBLE');
    }
  }, [token]);

  const [reservaState, setReservaState] = useState(() => {
    const saved = sessionStorage.getItem('paypalReserva');

    console.log('📦 SESSION STORAGE:', saved);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        console.log('📦 RESERVA RECUPERADA:', parsed);

        return parsed;
      } catch (error) {
        console.error('Error leyendo paypalReserva:', error);
      }
    }

    return {
      loading: false,
      error: null,
      reservaId: null,
      codigoReserva: null,
      orderId: null,
      approveUrl: null,
      paymentStatus: null,
      paymentDetails: null,
    };
  });

  const iniciarReserva = async () => {
    try {
      setIniciandoReserva(true);
      setSessionError('');

      // Si ya hay una sesión vigente, reutilizarla.
      const savedToken = sessionStorage.getItem('reservationToken');
      const savedExpiresAt = Number(
        sessionStorage.getItem('reservationExpiresAt')
      );

      if (savedToken && savedExpiresAt > Date.now()) {
        setSessionError('');

        setReservationSession({
          token: savedToken,
          expiresAt: savedExpiresAt,
        });

        setReservaIniciada(true);
        console.log('✅ Sesión vigente reutilizada');
        return;
      }

      // No existe una sesión vigente: crearla ahora.
      const response = await crearSesionReserva();

      if (!response?.success || !response?.token) {
        throw new Error('El servidor no devolvió una sesión válida.');
      }

      // Limpiar la orden anterior solo cuando la nueva sesión sea válida.
      sessionStorage.removeItem('paypalReserva');

      setReservaState({
        loading: false,
        error: null,
        reservaId: null,
        codigoReserva: null,
        orderId: null,
        approveUrl: null,
        paymentStatus: null,
        paymentDetails: null,
      });

      const expiresAt = Number(response.expiresAt);

      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        throw new Error('El servidor devolvió una sesión vencida o inválida.');
      }

      sessionStorage.setItem('reservationToken', response.token);
      sessionStorage.setItem('reservationSessionId', response.sessionId);
      sessionStorage.setItem('reservationExpiresAt', String(expiresAt));

      setReservationSession({
        ...response,
        expiresAt,
      });

      setReservaIniciada(true);

      setMostrarAvisoInicio(false);
      setMostrarAvisoExpiracion(false);

      console.log('✅ Reserva iniciada. Temporizador activado.');
      console.log('⏰ Vencimiento:', new Date(expiresAt).toLocaleString());
    } catch (error) {
      console.error('❌ No se pudo iniciar la reserva:', error);
      setSessionError(error.message || 'No fue posible iniciar la reserva.');
    } finally {
      setIniciandoReserva(false);
    }
  };

  useEffect(() => {
    console.log('🔄 Verificando sesión de reserva existente...');

    const savedToken = sessionStorage.getItem('reservationToken');
    const savedSessionId = sessionStorage.getItem('reservationSessionId');
    const savedExpiresAt = Number(
      sessionStorage.getItem('reservationExpiresAt')
    );

    // Primero comprobamos si existe una sesión válida.
    if (
      !savedToken ||
      !Number.isFinite(savedExpiresAt) ||
      savedExpiresAt <= 0
    ) {
      setReservationSession(null);
      setReservaIniciada(false);
      setMostrarAvisoInicio(true);
      setMostrarAvisoExpiracion(false);
      setSessionLoading(false);
      console.log('ℹ️ No hay una sesión guardada.');
      return;
    }

    // Si ya venció, eliminamos la sesión.
    if (savedExpiresAt <= Date.now()) {
      sessionStorage.removeItem('reservationToken');
      sessionStorage.removeItem('reservationSessionId');
      sessionStorage.removeItem('reservationExpiresAt');

      setReservationSession(null);
      setReservaIniciada(false);
      setMostrarAvisoInicio(false);
      setMostrarAvisoExpiracion(true);
      setSessionLoading(false);
      console.log('⏰ La sesión guardada ya venció.');
      return;
    }

    // Solo recuperamos la sesión cuando confirmamos que sigue vigente.
    setReservationSession({
      token: savedToken,
      sessionId: savedSessionId,
      expiresAt: savedExpiresAt,
    });

    setReservaIniciada(true);
    setMostrarAvisoInicio(false);
    setMostrarAvisoExpiracion(false);
    setSessionLoading(false);

    console.log('✅ Sesión vigente recuperada.');
    console.log('🆔 ID de sesión:', savedSessionId);
    console.log('⏰ Expira:', new Date(savedExpiresAt).toLocaleString());
  }, []);

  useEffect(() => {
    const expiresAt = Number(reservationSession?.expiresAt);

    if (!reservaIniciada || !Number.isFinite(expiresAt) || expiresAt <= 0) {
      return;
    }

    const tiempoRestante = expiresAt - Date.now();

    if (tiempoRestante <= 0) {
      finalizarSesion();
      return;
    }

    const timeoutId = setTimeout(() => {
      finalizarSesion();
    }, tiempoRestante);

    function finalizarSesion() {
      sessionStorage.removeItem('reservationToken');
      sessionStorage.removeItem('reservationSessionId');
      sessionStorage.removeItem('reservationExpiresAt');

      setReservationSession(null);
      setReservaIniciada(false);
      setMostrarAvisoInicio(false);
      setMostrarAvisoExpiracion(true);
      setSessionError('Tu tiempo terminó. Inicia nuevamente para continuar.');
    }

    return () => clearTimeout(timeoutId);
  }, [reservationSession?.expiresAt, reservaIniciada]);

  useEffect(() => {
    setStepNumber(parseInt(step, 10) || 1);
  }, [step]);

  useEffect(() => {
    setError(null);
  }, [stepNumber]);

  const calculateTotal = () => {
    const basePrice = 2;
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
      img: imagen1,
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

  console.log('🔐 TOKEN AUTH CONTEXT:', token);
  console.log('👤 AUTHENTICATED:', isAuthenticated);
  console.log('👤 USER:', user);

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
      if (reservaState.loading) return;

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
          precio: 2,
          equipo: {
            alquilar: data.alquilarEquipo,
            precio: data.alquilarEquipo ? 500 : 0,
          },
        };

        const response = await crearReserva(
          reservaData,
          reservationSession?.token
        );

        console.log('==============================');
        console.log('RESPUESTA CREAR RESERVA');
        console.log(response);
        console.log('ORDER ID:', response?.orderId);
        console.log('RESERVA ID:', response?.reservaId);
        console.log('CÓDIGO:', response?.codigoReserva);
        console.log('==============================');

        if (!response?.success) {
          throw new Error(
            response?.message || 'No fue posible crear la reserva.'
          );
        }

        if (!response?.reservaId) {
          throw new Error('El backend no devolvió el ID de la reserva.');
        }

        if (!response?.orderId) {
          throw new Error('El backend no devolvió el orderId de PayPal.');
        }

        const nuevaReservaState = {
          loading: false,
          error: null,

          reservaId: response.reservaId,
          codigoReserva: response.codigoReserva,

          orderId: response.orderId,
          approveUrl: response.approveUrl,

          paymentStatus: response.paymentStatus,
          paymentDetails: null,
        };

        console.log('GUARDANDO RESERVA PARA PAYPAL:', nuevaReservaState);

        sessionStorage.setItem(
          'paypalReserva',
          JSON.stringify(nuevaReservaState)
        );

        setReservaState(nuevaReservaState);

        setPaymentCompleted(false);
        setPaymentError(null);

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
      <PageHeader
        image={imagen1}
        title='Reservación de Tour'
        subtitle='Reserve su experiencia en pocos pasos'
      />

      <div className='reservation-progress-header'>
        {!sessionLoading && (
          <ReservationCountdown
            expiresAt={reservationSession?.expiresAt}
            idle={!reservaIniciada}
          />
        )}

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

              return (
                <div key={index} className={`step-line ${lineClass}`}></div>
              );
            })}
          </div>
        </div>
      </div>

      <div className='reservation-tour'>
        <div className='reservation-content'>
          <div className='reservation-sidebar-column'>
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
                            reservaEncontrada.fechaReserva
                              .split('-')
                              .map(Number);

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
          </div>

          <div className='tour-details'>
            {!sessionLoading && (
              <>
                {!reservaIniciada && mostrarAvisoInicio && (
                  <ReservationSessionNotice
                    type='info'
                    visible={true}
                    message='Inicia tu reserva para comenzar la cuenta regresiva de 10 minutos.'
                  />
                )}

                {mostrarAvisoExpiracion && (
                  <ReservationSessionNotice
                    type='error'
                    visible={true}
                    message='El tiempo de tu reserva ha terminado. Inicia nuevamente para continuar.'
                  />
                )}
              </>
            )}

            {!reservaIniciada ? (
              <ReservationSessionNotice
                showStartPanel={true}
                onStart={iniciarReserva}
                starting={iniciandoReserva}
                sessionError={sessionError}
              />
            ) : (
              <>
                {stepNumber === 1 && (
                  <div className='step-one'>
                    <div className='step-one-header'>
                      <div className='step-one-heading'>
                        <span className='step-eyebrow'>
                          PASO 01 · DISPONIBILIDAD
                        </span>

                        <h2>Elige cuándo vivirlo</h2>

                        <p>
                          Selecciona tu fecha y hora para planear tu aventura.
                        </p>
                      </div>

                      <div className='reservation-badge'>
                        <Lock size={14} />
                        <span>RESERVA PROTEGIDA</span>
                      </div>
                    </div>

                    <div className='step-one-divider' />

                    <div className='tour-option'>
                      <div className='tour-option-main'>
                        <MapPin size={18} />

                        <div className='tour-option-copy'>
                          <h3>Fly Fishing Holbox</h3>
                          <p>Experiencia privada · Desde $1,000 MXN</p>
                        </div>
                      </div>

                      <span className='tour-option-badge'>Más reservado</span>
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
                            if (match.cantidad >= 2)
                              return 'dia-ocupado-completo';
                            if (match.cantidad === 1)
                              return 'dia-ocupado-parcial';

                            return 'disponible';
                          }}
                        />

                        <div className='calendar-legend'>
                          <div>
                            <span className='dot available' />
                            Disponible
                          </div>

                          <div>
                            <span className='dot partial' />
                            Pocos lugares
                          </div>

                          <div>
                            <span className='dot full' />
                            No disponible
                          </div>
                        </div>
                      </div>

                      <div className='tour-info'>
                        <div className='selected-details'>
                          <div className='form-group'>
                            <label>
                              <CalendarCheck className='icon-style' />
                              Fecha seleccionada
                            </label>

                            <input
                              type='text'
                              value={data.date || 'Seleccione una fecha'}
                              disabled
                            />
                          </div>

                          <div className='form-group'>
                            <label>
                              <Clock className='icon-style' />
                              Hora
                            </label>

                            <select
                              value={data.time}
                              onChange={(e) =>
                                updateData('time', e.target.value)
                              }
                            >
                              <option value='09:00'>09:00 AM</option>
                              <option value='10:00'>10:00 AM</option>
                              <option value='11:00'>11:00 AM</option>
                              <option value='12:00'>12:00 PM</option>
                            </select>
                          </div>

                          <div className='form-group'>
                            <label>
                              <UsersRound className='icon-style' />
                              Número de personas
                            </label>

                            <select
                              value={data.guests}
                              onChange={(e) =>
                                updateData('guests', e.target.value)
                              }
                            >
                              <option value='1'>1 persona</option>
                              <option value='2'>2 personas</option>
                              <option value='3'>3 personas</option>
                            </select>
                          </div>

                          <div className='tour-price-summary'>
                            <div className='tour-price-label'>
                              TOTAL ESTIMADO
                            </div>

                            <div className='tour-price-row'>
                              <div className='tour-price'>
                                $
                                {(
                                  1000 * Number(data.guests || 1)
                                ).toLocaleString('en-US')}
                                <span> MXN</span>
                              </div>
                            </div>
                          </div>

                          <div className='security-info'>
                            <div className='security-icon'>
                              <Lock size={18} />
                            </div>

                            <div className='security-text'>
                              <h4>Tu información es segura</h4>
                              <p>Reserva con confianza.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='step-one-footer'>
                      <span>
                        <Check size={14} />
                        Confirmación inmediata
                      </span>

                      <span>
                        <ShieldCheck size={14} />
                        Pago seguro
                      </span>

                      <span>
                        <MapPin size={14} />
                        Holbox, México
                      </span>
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
                  <div className='step-three'>
                    {/* Encabezado */}
                    <div className='step-three-header'>
                      <div>
                        <span className='step-three-eyebrow'>
                          INCLUYE Y AGREGA
                        </span>

                        <h2>Adicionales para tu tour</h2>

                        <p>
                          Selecciona los complementos que harán de tu día en el
                          mar una experiencia inolvidable.
                        </p>
                      </div>

                      <span className='step-three-badge'>
                        <ShieldCheck size={13} />
                        TODO PREPARADO
                      </span>
                    </div>

                    <div className='step-three-divider' />

                    {/* Lo que incluye el tour */}
                    <section className='tour-includes'>
                      <h3>
                        <span className='includes-check'>✓</span>
                        LO QUE INCLUYE TU TOUR
                        <small>(500 USD)</small>
                      </h3>

                      <div className='includes-grid'>
                        <div className='include-item'>
                          <strong>Transporte marítimo</strong>
                          <p>Ida y vuelta en catamarán de lujo</p>
                        </div>

                        <div className='include-item'>
                          <strong>Comida gourmet</strong>
                          <p>Opciones vegetarianas disponibles</p>
                        </div>

                        <div className='include-item'>
                          <strong>Servicio fotográfico</strong>
                          <p>Recuerdos digitales de tu experiencia</p>
                        </div>

                        <div className='include-item'>
                          <strong>Guía certificado</strong>
                          <p>Acompañamiento experto durante el tour</p>
                        </div>

                        <div className='include-item'>
                          <strong>Bebidas premium</strong>
                          <p>Selección de bebidas para disfrutar a bordo</p>
                        </div>

                        <div className='include-item'>
                          <strong>Seguro de viaje</strong>
                          <p>Cobertura durante la actividad</p>
                        </div>
                      </div>
                    </section>

                    {/* Selección de artículos */}
                    <section className='slect-articulos'>
                      <span className='step-three-eyebrow'>
                        PERSONALIZA TU JORNADA
                      </span>

                      <h2>Paquete de equipo completo</h2>

                      <p className='items-intro'>
                        Selecciona los elementos que quieres sumar a tu
                        experiencia. Cada pieza está pensada para que disfrutes
                        más del día.
                      </p>

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
                            type='button'
                            className={
                              activeCategory === category ? 'active' : ''
                            }
                            onClick={() => handleCategoryChange(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <div className='items-container'>
                        {filteredItems.map((item, index) => (
                          <div
                            key={item.id ?? `${item.name}-${index}`}
                            className='item-card'
                          >
                            <div className='item-image'>
                              <img src={item.img} alt={item.name} />

                              <span className='item-category-badge'>
                                {item.category}
                              </span>
                            </div>

                            <div className='item-info'>
                              <h3>{item.name}</h3>
                              <p>{item.category}</p>
                            </div>

                            <p className='max-info'>
                              {item.description ||
                                'Un complemento pensado para disfrutar tu experiencia.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Alquiler de equipo */}
                    <section className='full-equipment-rental'>
                      <div className='package-header'>
                        <span className='step-three-eyebrow'>
                          ALQUILER DE EQUIPO COMPLETO
                        </span>

                        <h3>Todo listo para tu día en el mar.</h3>

                        <p className='package-description'>
                          Si no cuentas con equipo propio, podemos
                          proporcionarte todo lo necesario para disfrutar la
                          experiencia.
                        </p>
                      </div>

                      <div className='package-content'>
                        <label className='toggle-switch'>
                          <input
                            type='checkbox'
                            checked={data.alquilarEquipo}
                            onChange={handlePackageSelection}
                          />

                          <span className='toggle-slider' />

                          <span className='toggle-copy'>
                            <strong>DESEO ALQUILAR EL EQUIPO COMPLETO</strong>
                            <span>Equipo profesional listo para ti</span>
                            <small>
                              Caña, carrete, línea y accesorios seleccionados
                              para tu jornada.
                            </small>
                          </span>
                        </label>

                        <div className='package-price-display'>
                          <strong className='price-amount'>$1,000 MXN</strong>
                          <span className='price-conversion'>
                            Equivalente a 50 USD
                          </span>
                        </div>
                      </div>

                      <p className='package-note'>
                        <span>ⓘ</span>
                        El chaleco salvavidas es obligatorio y está incluido en
                        el precio base del tour.
                      </p>
                    </section>
                  </div>
                )}

                {stepNumber === 4 && (
                  <div className='step-four'>
                    {reservaState.loading && (
                      <div className='reservation-processing-overlay'>
                        <div className='reservation-processing-card'>
                          <span className='reservation-spinner' />

                          <h3>Estamos preparando tu reservación</h3>

                          <p>
                            Guardando tus datos y preparando el pago seguro con
                            PayPal. Por favor, no cierres esta página.
                          </p>
                        </div>
                      </div>
                    )}

                    {reservaState.error && !reservaState.loading && (
                      <div
                        className='reservation-processing-error'
                        role='alert'
                      >
                        <CircleAlert size={20} />
                        <div>
                          <strong>No pudimos procesar tu reservación</strong>
                          <p>{reservaState.error}</p>
                          <span>Revisa el mensaje e inténtalo nuevamente.</span>
                        </div>
                      </div>
                    )}

                    {/* Encabezado */}
                    <header className='step-four-header'>
                      <span className='step-four-eyebrow'>
                        PASO 04 · REVISIÓN FINAL
                      </span>

                      <h2>
                        <FileCheck aria-hidden='true' />
                        Confirma tu reservación
                      </h2>

                      <p>
                        Revisa los detalles de tu experiencia antes de continuar
                        al pago.
                      </p>
                    </header>

                    {/* Datos de la reserva */}
                    <section className='reservation-summary'>
                      <div className='section-heading'>
                        <div>
                          <span className='section-eyebrow'>
                            TU RESERVACIÓN
                          </span>
                          <h3>Detalles de tu reserva</h3>
                        </div>

                        <span className='review-badge'>Por confirmar</span>
                      </div>

                      <div className='summary-card'>
                        <div className='summary-column'>
                          <div className='summary-item'>
                            <div className='summary-icon'>
                              <Calendar1 aria-hidden='true' />
                            </div>

                            <div className='summary-copy'>
                              <span className='summary-label'>
                                Fecha del tour
                              </span>
                              <strong>{data.date || 'Sin seleccionar'}</strong>
                            </div>

                            <button
                              type='button'
                              className='edit-summary-button'
                              aria-label='Editar fecha del tour'
                              title='Editar fecha'
                              onClick={() => navigate('/reservaciones/steps/1')}
                            >
                              <Pencil size={15} aria-hidden='true' />
                            </button>
                          </div>

                          <div className='summary-item'>
                            <div className='summary-icon'>
                              <Clock aria-hidden='true' />
                            </div>

                            <div className='summary-copy'>
                              <span className='summary-label'>
                                Hora de salida
                              </span>
                              <strong>{data.time || 'Sin seleccionar'}</strong>
                            </div>

                            <button
                              type='button'
                              className='edit-summary-button'
                              aria-label='Editar hora del tour'
                              title='Editar hora'
                              onClick={() => navigate('/reservaciones/steps/1')}
                            >
                              <Pencil size={15} aria-hidden='true' />
                            </button>
                          </div>

                          <div className='summary-item'>
                            <div className='summary-icon'>
                              <Users aria-hidden='true' />
                            </div>

                            <div className='summary-copy'>
                              <span className='summary-label'>
                                Número de personas
                              </span>
                              <strong>
                                {data.guests}{' '}
                                {Number(data.guests) === 1
                                  ? 'persona'
                                  : 'personas'}
                              </strong>
                            </div>

                            <button
                              type='button'
                              className='edit-summary-button'
                              aria-label='Editar número de personas'
                              title='Editar personas'
                              onClick={() => navigate('/reservaciones/steps/1')}
                            >
                              <Pencil size={15} aria-hidden='true' />
                            </button>
                          </div>
                        </div>

                        <div className='summary-column'>
                          <div className='summary-item'>
                            <div className='summary-icon'>
                              <User aria-hidden='true' />
                            </div>

                            <div className='summary-copy'>
                              <span className='summary-label'>
                                Nombre completo
                              </span>
                              <strong>{data.name || 'Sin completar'}</strong>
                            </div>

                            <button
                              type='button'
                              className='edit-summary-button'
                              aria-label='Editar nombre'
                              title='Editar nombre'
                              onClick={() => navigate('/reservaciones/steps/2')}
                            >
                              <Pencil size={15} aria-hidden='true' />
                            </button>
                          </div>

                          <div className='summary-item'>
                            <div className='summary-icon'>
                              <Mail aria-hidden='true' />
                            </div>

                            <div className='summary-copy'>
                              <span className='summary-label'>
                                Correo electrónico
                              </span>
                              <strong>{data.email || 'Sin completar'}</strong>
                            </div>

                            <button
                              type='button'
                              className='edit-summary-button'
                              aria-label='Editar correo electrónico'
                              title='Editar correo'
                              onClick={() => navigate('/reservaciones/steps/2')}
                            >
                              <Pencil size={15} aria-hidden='true' />
                            </button>
                          </div>

                          <div className='summary-item'>
                            <div className='summary-icon'>
                              <Phone aria-hidden='true' />
                            </div>

                            <div className='summary-copy'>
                              <span className='summary-label'>
                                Teléfono de contacto
                              </span>
                              <strong>{data.phone || 'Sin completar'}</strong>
                            </div>

                            <button
                              type='button'
                              className='edit-summary-button'
                              aria-label='Editar teléfono'
                              title='Editar teléfono'
                              onClick={() => navigate('/reservaciones/steps/2')}
                            >
                              <Pencil size={15} aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Incluye y equipo */}
                    <section className='tour-summary-container'>
                      <div className='tour-summary-section'>
                        <span className='section-eyebrow'>
                          INCLUIDO EN TU EXPERIENCIA
                        </span>
                        <h3>Lo que incluye tu tour</h3>

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
                              <CheckCircle
                                className='icon-check'
                                aria-hidden='true'
                              />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='equipment-summary-section'>
                        <span className='section-eyebrow'>TU EQUIPO</span>
                        <h3>Equipo de tu reservación</h3>

                        <div
                          className={`equipment-package-summary ${
                            data.alquilarEquipo
                              ? 'equipment-selected'
                              : 'equipment-not-selected'
                          }`}
                        >
                          <div className='equipment-summary-icon'>
                            <ShoppingBag aria-hidden='true' />
                          </div>

                          <div className='equipment-summary-copy'>
                            <h4>
                              {data.alquilarEquipo
                                ? 'Paquete completo de equipo'
                                : 'Sin alquiler de equipo'}
                            </h4>

                            <p>
                              {data.alquilarEquipo
                                ? 'Has seleccionado el alquiler de equipo completo para tu experiencia.'
                                : 'No has seleccionado el alquiler. Utilizarás tu propio equipo.'}
                            </p>

                            <span
                              className={`equipment-status ${
                                data.alquilarEquipo
                                  ? 'is-selected'
                                  : 'is-not-selected'
                              }`}
                            >
                              {data.alquilarEquipo
                                ? 'Seleccionado'
                                : 'No seleccionado'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {stepNumber === 5 && (
                  <div className='pending-payment-step modern-card'>
                    {!paymentCompleted ? (
                      <>
                        {/* Encabezado */}
                        <header className='payment-page-header'>
                          <span className='payment-eyebrow'>
                            PASO FINAL · CONFIRMACIÓN
                          </span>

                          <h2 className='confirmation-title'>
                            Completa tu pago
                          </h2>

                          <p className='confirmation-subtitle'>
                            Tu aventura está reservada. Confirma el pago de
                            forma segura y prepárate para vivir Holbox desde el
                            mar.
                          </p>

                          <span className='reservation-status'>
                            <ShieldCheck size={15} aria-hidden='true' />
                            Reserva registrada
                          </span>
                        </header>

                        {/* Distribución: detalles y pago */}
                        <div className='payment-layout'>
                          {/* Detalles y precios */}
                          <section className='info-card reservation-payment-card'>
                            <h3>Detalles de tu reserva</h3>

                            <div className='reservation-detail-list'>
                              <p>
                                <strong>Código de reserva</strong>
                                <span>
                                  {reservaState.codigoReserva || '---'}
                                </span>
                              </p>

                              <p>
                                <strong>Fecha</strong>
                                <span>{data?.date || 'Sin seleccionar'}</span>
                              </p>

                              <p>
                                <strong>Hora</strong>
                                <span>{data?.time || 'Sin seleccionar'}</span>
                              </p>

                              <p>
                                <strong>Personas</strong>
                                <span>
                                  {data?.guests || 0}{' '}
                                  {Number(data?.guests) === 1
                                    ? 'persona'
                                    : 'personas'}
                                </span>
                              </p>
                            </div>

                            {/* Desglose dinámico de precios */}
                            <div className='payment-breakdown'>
                              <span className='breakdown-eyebrow'>
                                DESGLOSE DE TU RESERVA
                              </span>

                              <div className='payment-price-row'>
                                <span>Tour básico</span>
                                <strong>
                                  $
                                  {Number(totals.basePrice || 0).toLocaleString(
                                    'es-MX'
                                  )}{' '}
                                  MXN
                                </strong>
                              </div>

                              {data?.alquilarEquipo && (
                                <div className='payment-price-row'>
                                  <span>Alquiler de equipo completo</span>
                                  <strong>
                                    +$
                                    {Number(
                                      totals.equipmentPrice || 0
                                    ).toLocaleString('es-MX')}{' '}
                                    MXN
                                  </strong>
                                </div>
                              )}

                              <div className='payment-total-row'>
                                <span>Total a pagar</span>

                                <div className='payment-total-value'>
                                  <strong>
                                    $
                                    {Number(totals.total || 0).toLocaleString(
                                      'es-MX'
                                    )}
                                  </strong>
                                  <small>MXN</small>
                                </div>
                              </div>
                            </div>
                          </section>

                          {/* Pago con PayPal */}
                          <section className='info-card paypal-payment-card'>
                            <h3>Forma de Pago</h3>

                            {/* <div className='payment-method-selected'>
                              <div className='payment-method-icon'>
                                <ShieldCheck size={17} aria-hidden='true' />
                              </div>

                              <div className='payment-method-copy'>
                                <strong>PayPal</strong>
                                <span>Pago rápido y protegido</span>
                              </div>

                              <CheckCircle size={16} aria-hidden='true' />
                            </div> */}

                            <div className='payment-security-note'>
                              <strong>Pago seguro con PayPal</strong>
                              <p>
                                Tus datos se procesan de forma segura. El pago
                                se realizará a través de la plataforma de
                                PayPal.
                              </p>
                            </div>

                            {paymentError && (
                              <div className='alert-box error'>
                                <strong>Error en el pago</strong>
                                <p>{paymentError}</p>
                              </div>
                            )}

                            {!reservaState.orderId && (
                              <div className='alert-box error'>
                                <strong>
                                  No se encontró la orden de PayPal.
                                </strong>
                                <p>
                                  No podemos iniciar el pago porque la orden de
                                  PayPal no está disponible.
                                </p>
                              </div>
                            )}

                            {reservaState.orderId && (
                              <PayPalScriptProvider
                                options={{
                                  clientId: import.meta.env
                                    .VITE_PAYPAL_CLIENT_ID,
                                  currency: 'MXN',
                                  intent: 'capture',
                                  locale: 'es_MX',
                                }}
                              >
                                <div className='paypal-button-container'>
                                  <PayPalButtons
                                    style={{
                                      layout: 'vertical',
                                      shape: 'rect',
                                      label: 'paypal',
                                      height: 48,
                                    }}
                                    disabled={paymentLoading}
                                    forceReRender={[reservaState.orderId]}
                                    createOrder={() => {
                                      console.log(
                                        'PayPal createOrder →',
                                        reservaState.orderId
                                      );

                                      return reservaState.orderId;
                                    }}
                                    onApprove={async (paypalData) => {
                                      try {
                                        setPaymentLoading(true);
                                        setPaymentError(null);

                                        const orderId =
                                          paypalData?.orderID ||
                                          reservaState.orderId;

                                        // Obtener el token ACTUAL, no el que React pudo conservar en memoria.
                                        const sessionToken =
                                          sessionStorage.getItem(
                                            'reservationToken'
                                          );
                                        const expiresAt = Number(
                                          sessionStorage.getItem(
                                            'reservationExpiresAt'
                                          )
                                        );

                                        if (!orderId) {
                                          throw new Error(
                                            'No se encontró el ID de la orden de PayPal.'
                                          );
                                        }

                                        if (
                                          !sessionToken ||
                                          !Number.isFinite(expiresAt) ||
                                          expiresAt <= Date.now()
                                        ) {
                                          throw new Error(
                                            'Tu sesión de reserva venció. Inicia nuevamente para continuar con el pago.'
                                          );
                                        }

                                        const result = await capturarPagoPayPal(
                                          orderId,
                                          sessionToken
                                        );

                                        console.log(
                                          '✅ RESPUESTA CAPTURA PAYPAL:',
                                          result
                                        );

                                        if (!result?.success) {
                                          throw new Error(
                                            result?.error ||
                                              result?.message ||
                                              'El pago no pudo completarse.'
                                          );
                                        }

                                        addAlert(
                                          '¡Pago realizado correctamente! Tu reserva ha sido confirmada.',
                                          'success'
                                        );

                                        setPaymentCompleted(true);
                                      } catch (error) {
                                        console.error(
                                          '❌ Error al capturar PayPal:',
                                          error
                                        );

                                        const errorMessage =
                                          error?.message ||
                                          'No fue posible completar el pago.';

                                        addAlert(errorMessage, 'error');
                                        setPaymentError(errorMessage);
                                      } finally {
                                        setPaymentLoading(false);
                                      }
                                    }}
                                  />
                                </div>
                              </PayPalScriptProvider>
                            )}

                            {paymentLoading && (
                              <div className='payment-loading'>
                                <p>Procesando tu pago...</p>
                              </div>
                            )}

                            <p className='payment-protected-note'>
                              <ShieldCheck size={13} aria-hidden='true' />
                              Transacción protegida
                            </p>
                          </section>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Pago completado */}
                        <header className='payment-page-header payment-success-header'>
                          <span className='payment-eyebrow'>
                            RESERVA CONFIRMADA
                          </span>

                          <div className='payment-success-icon'>
                            <CheckCircle size={34} aria-hidden='true' />
                          </div>

                          <h2 className='confirmation-title'>
                            ¡Reserva confirmada!
                          </h2>

                          <p className='confirmation-subtitle'>
                            Tu pago se realizó correctamente y tu reserva ha
                            sido confirmada.
                          </p>
                        </header>

                        <div className='alert-box success'>
                          <strong>¡Pago realizado correctamente!</strong>
                          <p>
                            Hemos procesado tu pago mediante PayPal. Tu
                            comprobante de reservación ha sido generado y
                            enviado a tu correo electrónico.
                          </p>
                        </div>

                        <section className='info-card confirmation-reservation-card confirmation-reservation-card-wide'>
                          <h3>Detalles de tu reserva</h3>

                          <div className='reservation-detail-list'>
                            <p>
                              <strong>Código de reserva</strong>
                              <span>{reservaState.codigoReserva || '---'}</span>
                            </p>

                            <p>
                              <strong>Fecha</strong>
                              <span>{data?.date || 'Sin seleccionar'}</span>
                            </p>

                            <p>
                              <strong>Hora</strong>
                              <span>{data?.time || 'Sin seleccionar'}</span>
                            </p>

                            <p>
                              <strong>Personas</strong>
                              <span>
                                {data?.guests || 0}{' '}
                                {Number(data?.guests) === 1
                                  ? 'persona'
                                  : 'personas'}
                              </span>
                            </p>

                            <p>
                              <strong>Tour básico</strong>
                              <span>
                                $
                                {Number(totals.basePrice || 0).toLocaleString(
                                  'es-MX'
                                )}{' '}
                                MXN
                              </span>
                            </p>

                            {data?.alquilarEquipo && (
                              <p>
                                <strong>Alquiler de equipo</strong>
                                <span>
                                  $
                                  {Number(
                                    totals.equipmentPrice || 0
                                  ).toLocaleString('es-MX')}{' '}
                                  MXN
                                </span>
                              </p>
                            )}

                            <p>
                              <strong>Total pagado</strong>
                              <span>
                                $
                                {Number(totals.total || 0).toLocaleString(
                                  'es-MX'
                                )}{' '}
                                MXN
                              </span>
                            </p>

                            <p>
                              <strong>Método de pago</strong>
                              <span>PayPal</span>
                            </p>
                          </div>
                        </section>

                        <div className='email-notice'>
                          <h3>Revisa tu correo electrónico</h3>

                          <p>
                            Hemos enviado el comprobante de tu reservación a{' '}
                            <strong>{data?.email}</strong>.
                          </p>

                          <p>
                            Si no encuentras el correo, revisa tu carpeta de
                            spam o correo no deseado.
                          </p>
                        </div>

                        <button
                          type='button'
                          className='confirmation-button modern-button'
                          onClick={() => {
                            sessionStorage.removeItem('paypalReserva');
                            clearReserva();
                            navigate('/');
                          }}
                        >
                          Finalizar
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {reservaIniciada && reservationSession && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
