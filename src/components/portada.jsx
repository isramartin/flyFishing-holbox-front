import React, { useState, useEffect } from 'react';
import '../styles/portada.css'; // Asegúrate de crear este archivo para los estilos
import imagen1 from '../assets/image/image1.png';
import imagen2 from '../assets/image/image2.png';
import imagen3 from '../assets/image/image3.png';
import imagen4 from '../assets/image/image4.png';
import { Link } from 'react-router-dom';

const images = [imagen1, imagen2, imagen3, imagen4];

const Portada = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(false);
      }, 500); // Transición suave
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="hero">
      <img src={imagen1} alt="Portada" className="hero-image" />

      {/* Contenedor de cuadros sobre la portada */}
      <div className="hero-boxes">
        <div className="box top-left">
        <img src={images[(currentIndex + 1) % images.length]} alt="Cuadro 1" className={fade ? 'fade' : ''} />
        </div>
        <div className="box top-right">
          <img src={images[(currentIndex + 2) % images.length]} alt="Cuadro 2" className={fade ? 'fade' : ''} />
        </div>
        <div className="box bottom-left">
          <img src={images[(currentIndex + 3) % images.length]} alt="Cuadro 3" className={fade ? 'fade' : ''} />
        </div>
        <div className="box bottom-right">
          <img src={images[(currentIndex + 4) % images.length]} alt="Cuadro 4" className={fade ? 'fade' : ''} />
        </div>
      </div>

      <div className="hero-overlay">
        <h1>Isla Holbox</h1>
        <h2>It all begins with the destination. Holbox Island has an amazing fishery, and well kmown as a word class tarpon fishing destination where you can regulary find migratory giants upwards of 100lbs</h2>
        
        <Link className="btn-reservar" to="/reservaciones" >Reservar Ahora</Link>
      
      </div>
    </header>
  );
};

export default Portada;
