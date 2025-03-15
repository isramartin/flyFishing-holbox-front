import React, { useState } from "react";
import "../styles/prueba.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AlignJustify, LayoutGrid, CirclePlus } from "lucide-react"; // Importa los íconos

const Review2 = () => {
  const [activeTab, setActiveTab] = useState("Mosaico");

   const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [group, setGroup] = useState(null);
  
  
  
    const groups = [ "Parejas", "Familia", "Amigos", "Solo"];
    const ratingLabels = ["Pésimo", "Malo", "Bueno", "Muy bueno", "Excelente"];
  
    const handleRating = (index) => {
      setRating(index + 1);
    };
  
    const handleSubmit = () => {
      if (!review.trim() || !title.trim() || !date || !group) {
        alert("Por favor completa todos los campos.");
        return;
      }
  
      const newReview = {
        rating,
        title,
        review,
        date,
        group,
      };
  
      onSubmit(newReview);
  
      setRating(0);
      setReview("");
      setTitle("");
      setDate("");
      setGroup(null);
    };
  // Datos de ejemplo para las cards
  const cardsData = [
    {
      id: 1,
      user: {
        name: "Maria García",
        date: "Hace 2 días",
        role: "Soporte Técnico",
        image: "https://via.placeholder.com/40", // Imagen de perfil
        badge: "24", // Distintivo
      },
      rating: 5, // Número de estrellas
      title: "Excelente",
      content:
        "La atención al cliente fue impecable. El equipo resolvió mi problema en tiempo récord y con una amabilidad que no esperaba. Definitivamente volveré a confiar en ellos...",
      status: "excelente", // Estado para la línea de color
    },
    {
      id: 2,
      user: {
        name: "Juan Pérez",
        date: "Hace 5 días",
        role: "Cliente",
        image: "https://via.placeholder.com/40", // Imagen de perfil
        badge: "12", // Distintivo
      },
      rating: 4,
      title: "Muy bueno",
      content:
        "El servicio fue muy bueno, aunque hubo un pequeño retraso en la entrega. En general, estoy satisfecho con la experiencia.",
      status: "bueno", // Estado para la línea de color
    },
    {
      id: 3,
      user: {
        name: "Maria García",
        date: "Hace 2 días",
        role: "Soporte Técnico",
        image: "https://via.placeholder.com/40", // Imagen de perfil
        badge: "24", // Distintivo
      },
      rating: 5, // Número de estrellas
      title: "Excelente",
      content:
        "La atención al cliente fue impecable. El equipo resolvió mi problema en tiempo récord y con una amabilidad que no esperaba. Definitivamente volveré a confiar en ellos...",
      status: "malo", // Estado para la línea de color
    },
    {
      id: 4,
      user: {
        name: "Maria García",
        date: "Hace 2 días",
        role: "Soporte Técnico",
        image: "https://via.placeholder.com/40", // Imagen de perfil
        badge: "24", // Distintivo
      },
      rating: 5, // Número de estrellas
      title: "Excelente",
      content:
        "La atención al cliente fue impecable. El equipo resolvió mi problema en tiempo récord y con una amabilidad que no esperaba. Definitivamente volveré a confiar en ellos...",
      status: "regular", // Estado para la línea de color
    },
    {
      id: 5,
      user: {
        name: "Maria García",
        date: "Hace 2 días",
        role: "Soporte Técnico",
        image: "https://via.placeholder.com/40", // Imagen de perfil
        badge: "24", // Distintivo
      },
      rating: 5, // Número de estrellas
      title: "Excelente",
      content:
        "La atención al cliente fue impecable. El equipo resolvió mi problema en tiempo récord y con una amabilidad que no esperaba. Definitivamente volveré a confiar en ellos...",
      status: "excelente", // Estado para la línea de color
    },
    {
      id: 6,
      user: {
        name: "Maria García",
        date: "Hace 2 días",
        role: "Soporte Técnico",
        image: "https://via.placeholder.com/40", // Imagen de perfil
        badge: "24", // Distintivo
      },
      rating: 5, // Número de estrellas
      title: "Excelente",
      content:
        "La atención al cliente fue impecable. El equipo resolvió mi problema en tiempo récord y con una amabilidad que no esperaba. Definitivamente volveré a confiar en ellos...",
      status: "excelente", // Estado para la línea de color
    },
    {
      id: 7,
      user: {
        name: "Maria García",
        date: "Hace 2 días",
        role: "Soporte Técnico",
        image: "https://via.placeholder.com/40", // Imagen de perfil
        badge: "24", // Distintivo
      },
      rating: 5, // Número de estrellas
      title: "Excelente",
      content:
        "La atención al cliente fue impecable. El equipo resolvió mi problema en tiempo récord y con una amabilidad que no esperaba. Definitivamente volveré a confiar en ellos...",
      status: "excelente", // Estado para la línea de color
    },
    // Agrega más datos de ejemplo aquí...
  ];

  // Función para obtener el color de la línea según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case "excelente":
        return "#4caf50"; // Verde
      case "bueno":
        return "#ffc107"; // Amarillo
      case "regular":
        return "#ff9800"; // Naranja
      case "malo":
        return "#f44336"; // Rojo
      default:
        return "#4caf50"; // Verde por defecto
    }
  };

  // Función para agregar transparencia al color
const getStatusColorWithOpacity = (status, opacity = 0.5) => {
  const color = getStatusColor(status); // Obtiene el color base
  const r = parseInt(color.slice(1, 3), 16); // Extrae el componente rojo
  const g = parseInt(color.slice(3, 5), 16); // Extrae el componente verde
  const b = parseInt(color.slice(5, 7), 16); // Extrae el componente azul
  return `rgba(${r}, ${g}, ${b}, ${opacity})`; // Convierte a rgba con transparencia
};

  return (
    <div className="prueba-container">
      <div className="opiniones-container  text-center p-3 rounded">
        <h2 className="titulo">Galería de Opiniones</h2>
        <p className="descripcion">
          Explora nuestra colección de experiencias compartidas por clientes reales. Cada opinión
          es una pieza única en nuestro mosaico de satisfacción.
        </p>

        {/* Tarjetas de opinión */}
<div className="d-flex card-flex-wrap justify-content-center gap-4 ">
  <div className="card-opinion rounded p-1 text-center bg-white shadow-lg">
    <h3 className="valorP text-primary">4.1</h3>
    <div className="estrellas text-warning">⭐⭐⭐⭐☆</div>
    <p className="etiqueta text-muted">Calificación Promedio</p>
  </div>
  <div className="card-opinion rounded p-3 text-center bg-white shadow-lg">
    <h3 className="valorC text-info">78%</h3>
    <div className="barra-progreso bg-light">
      <div className="progreso bg-info" style={{ width: "78%" }}></div>
    </div>
    <p className="etiqueta text-muted">Clientes Satisfechos</p>
  </div>
  <div className="card-opinion rounded p-1 text-center bg-white shadow-lg">
    <h3 className="valorR text-success">9</h3>
    <div className="icono-comentario text-success">💬</div>
    <p className="etiqueta text-muted">Reseñas Totales</p>
  </div>
</div>

      </div>

      {/* Pestañas */}
      <div className="op-container">
        <ul className="nav">
          <li >
            <button
              className={`tab-op  ${activeTab === "Mosaico" ? "active" : ""}`}
              onClick={() => setActiveTab("Mosaico")}
            >
              <AlignJustify /> 
              Mosaico
            </button>
          </li>
          <li >
            <button
              className={`tab-op  ${activeTab === "Lista" ? "active" : ""}`}
              onClick={() => setActiveTab("Lista")}
            >
              <LayoutGrid />
              Lista
            </button>
          </li>
          <li >
            <button
              className={`tab-op ${activeTab === "Agregar Reseña" ? "active" : ""}`}
              onClick={() => setActiveTab("Agregar Reseña")}
            >
              <CirclePlus /> 
              Agregar Reseña
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido de las pestañas */}
      <div className="tab-content w-75">
        {activeTab === "Mosaico" && (
          <div className="card-grid-container">
            {cardsData.map((card) => (
              <div
                key={card.id}
                className="card"
                style={{ "--status-color": getStatusColor(card.status), "--status-color-opacity": getStatusColorWithOpacity(card.status, 0.3), }} // Color de la línea
              >
                <div className="card-user">
                  <img src={card.user.image} alt={card.user.name} />
                  <div className="card-user-info">
                    <span className="card-user-name">{card.user.name}</span>
                    <span className="card-user-date">
                      {card.user.date} · {card.user.role}
                    </span>
                  </div>
                  <span className="card-user-badge">{card.status}</span> {/* Distintivo */}
                </div>
                <div className="card-stars">
                  {"★".repeat(card.rating)}{"☆".repeat(5 - card.rating)}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-content">{card.content}</p>
                <a className="card-read-more">Leer más →</a>
              </div>
            ))}
          </div>
        )}
        {activeTab === "Lista" && (
          <div className="card-list-container">
            {cardsData.map((card) => (
              <div
                key={card.id}
                className="card"
                style={{ "--status-color": getStatusColor(card.status) }} // Color de la línea
              >
                <div className="card-user">
                  <img src={card.user.image} alt={card.user.name} />
                  <div className="card-user-info">
                    <span className="card-user-name">{card.user.name}</span>
                    <span className="card-user-date">
                      {card.user.date} · {card.user.role}
                    </span>
                  </div>
                  <span className="card-user-badge">{card.status}</span> {/* Distintivo */}
                </div>
                <div className="card-stars">
                  {"★".repeat(card.rating)}{"☆".repeat(5 - card.rating)}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-content">{card.content}</p>
                <a className="card-read-more">Leer más →</a>
              </div>
            ))}
          </div>
        )}
        {activeTab === "Agregar Reseña" && (
         
         <div className="review-box">
         <h2>¿Cómo calificarías tu experiencia?</h2>
   
         {/* Columna izquierda */}
         <div className="left-column">
           <div className="star-rating">
             {[...Array(5)].map((_, index) => (
               <span
                 key={index}
                 className={index < (hover || rating) ? "star selected" : "star"}
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
                 : "Selecciona una calificación"}
             </p>
           </div>
   
           <label>¿Cuándo fuiste?</label>
           <select value={date} onChange={(e) => setDate(e.target.value)}>
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
                 className={group === g ? "selected" : ""}
                 onClick={() => setGroup(g)}
               >
                 {g}
               </button>
             ))}
           </div>
         </div>
   
         {/* Columna derecha */}
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
   
         {/* Botón de enviar */}
         <div className="button-container">
        <button type="submit" onClick={handleSubmit}>
          Enviar Reseña
        </button>
      </div>
       </div>
         
        )}
      </div>
    </div>
  );
};

export default Review2;