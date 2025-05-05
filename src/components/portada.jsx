import React, { useState, useEffect, useCallback } from 'react';
import '../styles/portada.css';
import imagen1 from '../assets/image/image1.png';
import imagen2 from '../assets/image/image2.png';
import imagen3 from '../assets/image/image3.png';
import imagen4 from '../assets/image/image4.png';
import { Link } from 'react-router-dom';

const images = [imagen1, imagen2, imagen3, imagen4];

const Portada = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(false);
      }, 500);
    }, 5000);

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Preload images for better performance
  useEffect(() => {
    images.forEach(img => {
      const image = new Image();
      image.src = img;
    });
  }, []);

  const renderBoxes = () => {
    if (isMobile) {
      return (
        <>
          <div className="box top-left">
            <img src={images[(currentIndex + 1) % images.length]} alt="Cuadro 1" className={fade ? 'fade' : ''} />
          </div>
          <div className="box bottom-left">
            <img src={images[(currentIndex + 3) % images.length]} alt="Cuadro 3" className={fade ? 'fade' : ''} />
          </div>
        </>
      );
    }
    
  };

  return (
    <header className="hero">
      <img 
        src={images[currentIndex]} 
        alt="Portada" 
        className={`hero-image ${fade ? 'fade' : ''}`} 
        loading="eager"
      />

      {/* <div className="hero-boxes">
        {renderBoxes()}
      </div> */}

      <div className="hero-overlay">
        <h1>Isla Holbox</h1>
        <h2>
          It all begins with the destination. Holbox Island has an amazing fishery, 
          and well known as a world class tarpon fishing destination where you can 
          regularly find migratory giants upwards of 100lbs
        </h2>
        <Link className="btn-reservar" to="/reservaciones">
          Reservar Ahora
        </Link>
      </div>
    </header>
  );
};

export default Portada;