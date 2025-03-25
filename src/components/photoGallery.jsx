import React, { useState,useRef, useEffect } from "react";
import imagen1 from '../assets/image/image1.png';
import imagen2 from '../assets/image/image2.png';
import imagen3 from '../assets/image/image3.png';
import imagen4 from '../assets/image/image4.png';
import imagen5 from '../assets/image/image2.png';
import imagen6 from '../assets/image/image3.png';
import imagen7 from '../assets/image/image4.png';
import imagen8 from '../assets/image/image2.png';
import imagen9 from '../assets/image/image3.png';
import imagen10 from '../assets/image/image4.png';

const images = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6, imagen7, imagen8, imagen9, imagen10];

const PhotoGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);
  const isScrolling = useRef(false);


  console.log("showModal:", showModal); // Verifica si cambia el estado

  const handleImageClick = (index, e) => {
    e.stopPropagation();
    console.log("Click en imagen:", index);
    setActiveIndex(index);
    setShowModal(true);
  };

  const centerThumbnail = (index) => {
    if (!containerRef.current || isScrolling.current) return;
    
    isScrolling.current = true;
    const container = containerRef.current;
    const thumb = container.children[index];
    
    if (!thumb) return;

    const containerWidth = container.offsetWidth;
    const thumbWidth = thumb.offsetWidth;
    const thumbOffset = thumb.offsetLeft;
    const scrollTo = thumbOffset - (containerWidth / 2) + (thumbWidth / 2);

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });

    // Resetear el flag después de la animación
    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  useEffect(() => {
    centerThumbnail(activeIndex);
  }, [activeIndex]);


  useEffect(() => {
    if (containerRef.current && images.length > 0) {
      const container = containerRef.current;
      const activeThumb = container.children[activeIndex];
      
      if (activeThumb) {
        const containerWidth = container.offsetWidth;
        const thumbWidth = activeThumb.offsetWidth;
        const thumbOffset = activeThumb.offsetLeft;
        const scrollTo = thumbOffset - (containerWidth / 2) + (thumbWidth / 2);
        
        container.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex, images.length]);


  const handleCloseModal = () => {
    console.log("Cerrando modal");
    setShowModal(false);
  };

  // const handlePrev = (e) => {
  //   e.stopPropagation();
  //   setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  // };

  // const handleNext = (e) => {
  //   e.stopPropagation();
  //   setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  // };

  const handleNext = () => {
    setActiveIndex(prev => {
      const nextIndex = prev === images.length - 1 ? 0 : prev + 1;
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setActiveIndex(prev => {
      const prevIndex = prev === 0 ? images.length - 1 : prev - 1;
      return prevIndex;
    });
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
         <div className="gallery-modal-overlay" onClick={ handleCloseModal}>
         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
           <button onClick={handlePrev} className="arrow-left">&#10094;</button>
           <img src={images[activeIndex]} alt="Imagen ampliada" className="modal-image" />
           <button onClick={handleNext} className="arrow-right">&#10095;</button>
           
           <div className="thumbnails-wrapper">
             <div className="thumbnail-container" ref={containerRef}>
               {images.map((image, index) => (
                 <img
                   key={index}
                   src={image}
                   alt={`Thumbnail ${index + 1}`}
                   onClick={() => setActiveIndex(index)}
                   className={`thumbnail ${index === activeIndex ? 'active' : 'inactive'}`}
                 />
               ))}
             </div>
           </div>
         </div>
       </div>
      )}
    </div>
  );
};

export default PhotoGallery;
