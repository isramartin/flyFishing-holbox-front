import React, { useState } from "react";
import imagen1 from '../assets/image/image1.png';
import imagen2 from '../assets/image/image2.png';
import imagen3 from '../assets/image/image3.png';
import imagen4 from '../assets/image/image4.png';

const images = [imagen1, imagen2, imagen3, imagen4, imagen3, imagen1, imagen3, imagen4, imagen3, imagen4];

const PhotoGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);

  console.log("showModal:", showModal); // Verifica si cambia el estado

  const handleImageClick = (index, e) => {
    e.stopPropagation();
    console.log("Click en imagen:", index);
    setActiveIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Cerrando modal");
    setShowModal(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="gallery-container">
      <div className="gallery-masonry">
        {images.map((image, index) => (
          <div 
            className="gallery-item" 
            key={index} 
            onMouseEnter={() => setHoverIndex(index)} 
            onMouseLeave={() => setHoverIndex(null)}
            onClick={(e) => handleImageClick(index, e)} // Captura clic en toda el área
          >
            <img
              src={image}
              alt={`Foto ${index + 1}`}
              className="gallery-image"
              onClick={(e) => handleImageClick(index, e)}
            />
            {hoverIndex === index && (
              <div className="gallery-overlay">
                <div className="gallery-actions">
                  <button>❤️</button>
                  <button>🔗</button>
                  <button>⬇️</button>
                </div>
                <div className="gallery-info">
                  <h3>Arquitectura Urbana</h3>
                  <p>Rascacielos modernos con fachadas de cristal</p>
                  <span className="gallery-location">Barcelona, España</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="gallery-modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={handlePrev} className="arrow-left">&#10094;</button>
            <img src={images[activeIndex]} alt="Imagen ampliada" className="modal-image" />
            <button onClick={handleNext} className="arrow-right">&#10095;</button>
            <div className="thumbnail-container">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
                  className={`thumbnail ${index === activeIndex ? "active" : "inactive"}`}
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
