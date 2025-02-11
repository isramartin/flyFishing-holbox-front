import React, { useState } from "react";
import imagen1 from '../assets/image/image1.png';
import imagen2 from '../assets/image/image2.png';
import imagen3 from '../assets/image/image3.png';
import imagen4 from '../assets/image/image4.png';

const images = [imagen1, imagen2, imagen3, imagen4];

const PhotoGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageClick = (index) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="container mt-6" style={{ marginTop: "100px" }}>
    
      <div className="row">
        {images.map((image, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <img
              src={image}
              alt={`Foto ${index + 1}`}
              className="img-fluid rounded shadow-sm"
              onClick={() => handleImageClick(index)} // Muestra la imagen en el modal
            />
          </div>
        ))}
      </div>

      {/* Modal Simple */}
      {showModal && (
        <div
          onClick={handleCloseModal} // Cierra al hacer clic fuera de la imagen
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Oscurece todo, incluyendo el menú
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1050", // Asegura que el modal esté sobre el menú
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // Previene el cierre al hacer clic en la imagen
            style={{
              position: "relative",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "90%",
              maxHeight: "70vh",
              zIndex: "1100", // Asegura que el modal esté por encima del fondo
            }}
          >
            {/* Flecha izquierda */}
            <button
              onClick={handlePrev}
              style={{
                position: "absolute",
                top: "50%",
                left: "-500px", // Mueve la flecha fuera del contenedor
                transform: "translateY(-50%)",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "30px",
              }}
            >
              &#10094;
            </button>

            <img
              src={images[activeIndex]} // Usa el índice activo para mostrar la imagen correspondiente
              alt="Imagen ampliada"
              style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain" }}
            />

            {/* Flecha derecha */}
            <button
              onClick={handleNext}
              style={{
                position: "absolute",
                top: "50%",
                right: "-500px", // Mueve la flecha fuera del contenedor
                transform: "translateY(-50%)",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "30px",
              }}
            >
              &#10095;
            </button>

            {/* Miniaturas */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setActiveIndex(index)} // Cambia la imagen activa al hacer clic
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    margin: "0 5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    opacity: index === activeIndex ? 1 : 0.5, // Resalta la imagen activa
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
