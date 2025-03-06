import React, { useState } from "react";
import "../styles/prueba.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AlignJustify, LayoutGrid, CirclePlus } from "lucide-react"; // Importa los íconos

const Review2 = () => {
  const [activeTab, setActiveTab] = useState("Mosaico");

  // Datos de ejemplo para las cards
  const cardsData = [
    { id: 1, title: "Card 1", content: "Contenido de la card 1" },
    { id: 2, title: "Card 2", content: "Contenido de la card 2" },
    { id: 3, title: "Card 3", content: "Contenido de la card 3" },
    { id: 4, title: "Card 4", content: "Contenido de la card 4" },
    { id: 5, title: "Card 5", content: "Contenido de la card 5" },
    { id: 1, title: "Card 1", content: "Contenido de la card 1" },
    { id: 2, title: "Card 2", content: "Contenido de la card 2" },
    { id: 3, title: "Card 3", content: "Contenido de la card 3" },
    { id: 4, title: "Card 4", content: "Contenido de la card 4" },
    { id: 5, title: "Card 5", content: "Contenido de la card 5" },
  ];

  return (
    <div className="prueba-container d-flex align-items-center flex-column">
      <div className="opiniones-container text-center p-4 rounded w-75">
        <h2 className="titulo">Galería de Opiniones</h2>
        <p className="descripcion">
          Explora nuestra colección de experiencias compartidas por clientes reales. Cada opinión
          es una pieza única en nuestro mosaico de satisfacción.
        </p>

        {/* Tarjetas de opinión */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <div className="card-opinion rounded p-3 text-center bg-white shadow-lg">
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
          <div className="card-opinion rounded p-3 text-center bg-white shadow-lg">
            <h3 className="valorR text-success">9</h3>
            <div className="icono-comentario text-success">💬</div>
            <p className="etiqueta text-muted">Reseñas Totales</p>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="op-container ">
        <ul className="nav justify-content-start">
          <li className="nav-item">
            <button
              className={`tab-op nav-link ${activeTab === "Mosaico" ? "active" : ""}`}
              onClick={() => setActiveTab("Mosaico")}
            >
              <AlignJustify /> Mosaico
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`tab-op nav-link ${activeTab === "Lista" ? "active" : ""}`}
              onClick={() => setActiveTab("Lista")}
            >
              <LayoutGrid /> Lista
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`tab-op nav-link ${activeTab === "Agregar Reseña" ? "active" : ""}`}
              onClick={() => setActiveTab("Agregar Reseña")}
            >
              <CirclePlus /> Agregar Reseña
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido de las pestañas */}
      <div className="tab-content w-75">
        {activeTab === "Mosaico" && (
          <div className="card-grid-container">
            {cardsData.map((card) => (
              <div key={card.id} className="card">
                <h3>{card.title}</h3>
                <p>{card.content}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "Lista" && (
          <div className="card-list-container">
            {cardsData.map((card) => (
              <div key={card.id} className="card">
                <h3>{card.title}</h3>
                <p>{card.content}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "Agregar Reseña" && (
          <div>
            <p>Formulario para Agregar Reseña...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review2;