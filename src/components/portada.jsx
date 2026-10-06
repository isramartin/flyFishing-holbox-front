import React, { useState, useEffect, useCallback } from 'react';
import '../styles/portada.css';
import imagen1 from '../assets/image/image1.png';
import imagen2 from '../assets/image/image2.png';
import imagen3 from '../assets/image/image3.png';
import imagen4 from '../assets/image/image4.png';
import imagen5 from '../assets/image/image5.jpg';
import { Link } from 'react-router-dom';

const images = [imagen1];

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
      }, 400);
    }, 4000);

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
      alt="Isla Holbox"
      className="hero-image"
      loading="eager"
    />

    <div className="hero-overlay">

      <div className="hero-content">

        <span className="hero-eyebrow">
          HOLBOX · QUINTANA ROO
        </span>

        <h1>
          ISLA HOLBOX
        </h1>

        <p className="hero-description">
          It all begins with the destination. Holbox Island has an amazing fishery, 
          and well known as a world class tarpon fishing destination where you can 
          regularly find migratory giants upwards of 100lbs
        </p>

        <div className="hero-actions">

          <Link
            className="btn-reservar"
            to="/reservaciones/steps/1"
          >
            RESERVAR AHORA
            <span className="btn-arrow">↗</span>
          </Link>

          <Link
            className="btn-guia"
            to="/#guia"
          >
            CONOCE TU GUÍA
          </Link>

        </div>

      </div>

      <div className="hero-bottom">
        <span className="hero-bottom-line"></span>

        <span className="hero-bottom-text">
          PESCA DE CLASE MUNDIAL
        </span>
      </div>

    </div>

  </header>
);
};

export default Portada;