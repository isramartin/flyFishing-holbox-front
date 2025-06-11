import React, { useState, useEffect, useContext } from 'react';
import { getAllResenas } from '../service/Reseña.service';
import '../styles/prueba.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  AlignJustify,
  LayoutGrid,
  CirclePlus,
  LockKeyhole,
  TriangleAlert,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Review2 = () => {
  const [activeTab, setActiveTab] = useState('Mosaico');
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const { token: contextToken } = useContext(AuthContext);
  const [localToken, setLocalToken] = useState('');

  // Estados para el formulario
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [group, setGroup] = useState(null);

  const groups = ['Parejas', 'Familia', 'Amigos', 'Solo'];
  const ratingLabels = ['Pésimo', 'Malo', 'Bueno', 'Muy bueno', 'Excelente'];

  useEffect(() => {
    console.log('Estado de autenticación review:', isAuthenticated);
    console.log(
      'Token disponible:',
      token ? '***' + token.slice(-4) : 'No hay token'
    );

    if (!isAuthenticated || !token) {
      console.error('Usuario no autenticado o token faltante');
      // Redirigir al login o mostrar error
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    console.log('AuthContext:', authContext);

    // Intentar obtener el token de varias fuentes
    const token =
      localStorage.getItem('authToken') || // 1. LocalStorage
      (authContext && authContext.token) || // 2. Contexto
      '';

    console.log(
      'Token obtenido:',
      token ? '***' + token.slice(-4) : 'NO TOKEN'
    );

    if (!token) {
      console.error('No se encontró token en ninguna fuente');
      // Redirigir al login o mostrar error
    } else {
      setAuthToken(token);
    }
  }, [authContext]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('authToken');
    setLocalToken(tokenFromStorage || '');
  }, []);

  // Obtener reseñas de la API
  useEffect(() => {
    const fetchResenas = async () => {
      try {
        setLoading(true);
        const data = await getAllResenas();
        setResenas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
  }, []);

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    if (!review.trim() || !title.trim() || !date || !group) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const newReview = {
      rating,
      title,
      review,
      date,
      group,
    };

    // Aquí deberías implementar la función para enviar a tu API
    // onSubmit(newReview);

    setRating(0);
    setReview('');
    setTitle('');
    setDate('');
    setGroup(null);
  };

  // Función para obtener el color de la línea según el estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excelente':
        return '#4CAF50'; // Verde - Excelente
      case 'muy bueno':
        return '#8BC34A'; // Verde claro - Muy bueno
      case 'bueno':
        return '#FFC107'; // Amarillo - Bueno
      case 'regular':
        return '#FF9800'; // Naranja - Regular
      case 'malo':
        return '#F44336'; // Rojo - Malo
      case 'pésimo':
      case 'pesimo':
        return '#9E9E9E'; // Gris - Pésimo
      default:
        return '#4CAF50'; // Verde por defecto
    }
  };

  const getStatusColorWithOpacity = (status, opacity = 0.5) => {
    const color = getStatusColor(status);
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Calcular estadísticas
  const promedio =
    resenas.length > 0
      ? (
          resenas.reduce((sum, resena) => sum + resena.calificacion, 0) /
          resenas.length
        ).toFixed(1)
      : 0;

  const satisfechos =
    resenas.length > 0
      ? Math.round(
          (resenas.filter((r) => r.calificacion >= 4).length / resenas.length) *
            100
        )
      : 0;

  return (
    <div className="prueba-container">
      <div className="opiniones-container text-center p-3 rounded">
        <h2 className="titulo">Galería de Opiniones</h2>
        <p className="descripcion">
          Explora nuestra colección de experiencias compartidas por clientes
          reales. Cada opinión es una pieza única en nuestro mosaico de
          satisfacción.
        </p>

        {/* Tarjetas de opinión o Skeleton */}
        <div className="d-flex card-flex-wrap justify-content-center gap-4">
          {loading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="card-opinion rounded p-3 bg-white shadow-lg skeleton-card"
                >
                  <div className="skeleton-line short" />
                  <div className="skeleton-stars" />
                  <div className="skeleton-line medium" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="card-opinion rounded p-1 text-center bg-white shadow-lg">
                <h3 className="valorP text-primary">{promedio}</h3>
                <div className="estrellas text-warning">
                  {'⭐'.repeat(Math.round(promedio))}
                  {'☆'.repeat(5 - Math.round(promedio))}
                </div>
                <p className="etiqueta text-muted">Calificación Promedio</p>
              </div>
              <div className="card-opinion rounded p-3 text-center bg-white shadow-lg">
                <h3 className="valorC text-info">{satisfechos}%</h3>
                <div className="barra-progreso bg-light">
                  <div
                    className="progreso bg-info"
                    style={{ width: `${satisfechos}%` }}
                  ></div>
                </div>
                <p className="etiqueta text-muted">Clientes Satisfechos</p>
              </div>
              <div className="card-opinion rounded p-1 text-center bg-white shadow-lg">
                <h3 className="valorR text-success">{resenas.length}</h3>
                <div className="icono-comentario text-success">💬</div>
                <p className="etiqueta text-muted">Reseñas Totales</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pestañas */}
      <div className="op-container">
        <ul className="nav">
          <li>
            <button
              className={`tab-op ${activeTab === 'Mosaico' ? 'active' : ''}`}
              onClick={() => setActiveTab('Mosaico')}
            >
              <AlignJustify />
              Mosaico
            </button>
          </li>
          <li>
            <button
              className={`tab-op ${activeTab === 'Lista' ? 'active' : ''}`}
              onClick={() => setActiveTab('Lista')}
            >
              <LayoutGrid />
              Lista
            </button>
          </li>
          <li>
            <button
              className={`tab-op ${
                activeTab === 'Agregar Reseña' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('Agregar Reseña')}
            >
              <CirclePlus />
              Agregar Reseña
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido de las pestañas */}
      <div className="tab-content w-75">
        {loading ? (
          // Skeletons para contenido según pestaña activa y cantidad de resenas (mínimo 3 skeletons)
          activeTab === 'Lista' ? (
            <div className="card-list-container">
              {[...Array(resenas.length || 3)].map((_, i) => (
                <div
                  key={i}
                  className="card skeleton-card p-3"
                  style={{ height: 'auto' }}
                >
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="skeleton-avatar" />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="skeleton-line medium" />
                        <div className="skeleton-line short" />
                      </div>
                      <div className="skeleton-badge" />{' '}
                      {/* Skeleton para badge de estado */}
                    </div>
                  </div>
                  <div className="skeleton-stars" />
                  <div className="skeleton-line long" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-grid-container">
              {[...Array(resenas.length || 3)].map((_, i) => (
                <div
                  key={i}
                  className="card skeleton-card p-3"
                  style={{ height: 'auto' }}
                >
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="skeleton-avatar" />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="skeleton-line medium" />
                        <div className="skeleton-line short" />
                      </div>
                      <div className="skeleton-badge" />{' '}
                      {/* Skeleton para badge de estado */}
                    </div>
                  </div>
                  <div className="skeleton-stars" />
                  <div className="skeleton-line long" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {activeTab === 'Mosaico' && (
              <div className="card-grid-container">
                {resenas.map((resena) => (
                  <div
                    key={resena.id}
                    className="card"
                    style={{
                      '--status-color': getStatusColor(resena.status),
                      '--status-color-opacity': getStatusColorWithOpacity(
                        resena.status,
                        0.3
                      ),
                    }}
                  >
                    <div className="card-user">
                      <img src={resena.userPhotoUrl} alt="Usuario" />
                      <div className="card-user-info">
                        <span className="card-user-name">
                          {resena.userName}
                        </span>
                        <span className="card-user-date">
                          {resena.fechaVisita} · {resena.acompanante}
                        </span>
                      </div>
                      <span className="card-user-badge">{resena.status}</span>
                    </div>
                    <div className="card-stars">
                      {'★'.repeat(resena.calificacion)}
                      {'☆'.repeat(5 - resena.calificacion)}
                    </div>
                    <h3 className="card-title">{resena.titulo}</h3>
                    <p className="card-content">{resena.opinion}</p>
                    <a className="card-read-more">Leer más →</a>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Lista' && (
              <div className="card-list-container">
                {resenas.map((resena) => (
                  <div
                    key={resena.id}
                    className="card"
                    style={{ '--status-color': getStatusColor(resena.status) }}
                  >
                    <div className="card-user">
                      <img src={resena.userPhotoUrl} alt="Usuario" />
                      <div className="card-user-info">
                        <span className="card-user-name">
                          {resena.userName}
                        </span>
                        <span className="card-user-date">
                          {resena.fechaVisita} · {resena.acompanante}
                        </span>
                      </div>
                      <span className="card-user-badge">{resena.status}</span>
                    </div>
                    <div className="card-stars">
                      {'★'.repeat(resena.calificacion)}
                      {'☆'.repeat(5 - resena.calificacion)}
                    </div>
                    <h3 className="card-title">{resena.titulo}</h3>
                    <p className="card-content">{resena.opinion}</p>
                    <a className="card-read-more">Leer más →</a>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Agregar Reseña' &&
              (isAuthenticated ? (
                <div className="review-box">
                  <h2>¿Cómo calificarías tu experiencia?</h2>
                  <div className="left-column">
                    <div className="star-rating">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={
                            index < (hover || rating) ? 'star selected' : 'star'
                          }
                          onClick={() => handleRating(index)}
                          onMouseEnter={() => setHover(index + 1)}
                          onMouseLeave={() => setHover(0)}
                        >
                          ★
                        </span>
                      ))}
                      <p className="rating-text">
                        {hover > 0
                          ? ratingLabels[hover - 1]
                          : rating > 0
                          ? ratingLabels[rating - 1]
                          : 'Selecciona una calificación'}
                      </p>
                    </div>
                    <label>¿Cuándo fuiste?</label>
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Enero">Enero</option>
                      <option value="Febrero">Febrero</option>
                      <option value="Marzo">Marzo</option>
                    </select>
                    <label>¿Con quién fuiste?</label>
                    <div className="group-selection">
                      {groups.map((g) => (
                        <button
                          key={g}
                          className={group === g ? 'selected' : ''}
                          onClick={() => setGroup(g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="right-column">
                    <label>Título de tu opinión</label>
                    <input
                      type="text"
                      placeholder="Cuéntanos un poco sobre tu experiencia"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Escribe tu opinión</label>
                    <textarea
                      placeholder="Escribe tu reseña..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="button-container">
                    <button type="submit" onClick={handleSubmit}>
                      Enviar Reseña
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-warning">
                  <div className="auth-warning-card">
                    <h2 className="auth-warning-title">
                      <TriangleAlert className="alert-icon-block" /> Sesión no
                      iniciada
                    </h2>
                    <p className="auth-warning-message">
                      Para escribir una reseña, necesitas iniciar sesión en tu
                      cuenta.
                    </p>
                    <LockKeyhole className="lock-icon-block" />
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Review2;
