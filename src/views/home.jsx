import React, { useState, useEffect } from 'react';
import Portada from '../components/portada';
import InfoPeces from '../components/infoPeces';
import Image1 from '../assets/image/logo.png';
import '../styles/globalContainer.css';

const Home = () => {
  return (
    <div className="home-container">
      <div>
        <Portada />
      </div>

      <section className="info-section">
        <h2>Descubre Todo lo que Ofrecemos</h2>
        <p>
          Navega por nuestra plataforma para encontrar contenido exclusivo,
          guardar tus favoritos y descargar imágenes de alta calidad.
        </p>
        <div className="info-cards">
          <div className="info-card">
            <span role="img" aria-label="galería">
              🖼️
            </span>
            <h3>Explora Galerías</h3>
            <p>Disfruta de una colección visual cuidadosamente seleccionada.</p>
          </div>
          <div className="info-card">
            <span role="img" aria-label="descarga">
              ⬇️
            </span>
            <h3>Descargas Fáciles</h3>
            <p>Guarda imágenes directamente en tu dispositivo con un clic.</p>
          </div>
          <div className="info-card">
            <span role="img" aria-label="favoritos">
              ❤️
            </span>
            <h3>Marca Favoritos</h3>
            <p>Guarda tus imágenes preferidas para tenerlas siempre a mano.</p>
          </div>

          <div className="info-card">
            <span role="img" aria-label="favoritos">
              📝
            </span>
            <h3>Escribe Una Reseña</h3>
            <p>
              Despues de disfrutar tu experiencia con nosotros galanos una
              critica constructiva.
            </p>
          </div>
        </div>
      </section>

     <section className="service-section">
  <h2>¿Por Qué Reservar con Nosotros?</h2>
  <p>
    Nuestra plataforma está diseñada para facilitarte la mejor experiencia en fly fishing. Reserva tus días de pesca en los mejores lugares, con guías expertos y equipamiento de calidad, todo desde un mismo lugar.
  </p>

  <div className="service-cards">

     <div className="service-card">
      <span role="img" aria-label="seguridad" className="service-icon">🔒</span>
      <h3>Seguridad Garantizada</h3>
      <p>Protegemos tus datos y aseguramos que tu experiencia sea privada y segura.</p>
    </div>

    <div className="service-card">
      <span role="img" aria-label="guías expertos" className="service-icon">🎣</span>
      <h3>Guías Expertos</h3>
      <p>Conéctate con profesionales que conocen los mejores spots y técnicas de pesca.</p>
    </div>

    <div className="service-card">
      <span role="img" aria-label="reservas fáciles" className="service-icon">📅</span>
      <h3>Reservas Simples</h3>
      <p>Planifica y reserva tu jornada de pesca en pocos pasos, sin complicaciones.</p>
    </div>
 
    <div className="service-card">
      <span role="img" aria-label="equipamiento" className="service-icon">🛶</span>
      <h3>Equipamiento de Calidad</h3>
      <p>Accede a equipo profesional disponible para alquiler o compra según tu necesidad.</p>
    </div>

    <div className="service-card">
      <span role="img" aria-label="soporte" className="service-icon">🤝</span>
      <h3>Atención Personalizada</h3>
      <p>Estamos para ayudarte en cada paso, desde la reserva hasta la experiencia en el río.</p>
    </div>
  </div>

  {/* <button className="btn-primary" onClick={() => alert('¡Próximamente podrás reservar con nosotros!')}>
    Reserva Ahora
  </button> */}
</section>

<section className="boat-info-section">
  <h2 className="section-title">Embarcación y Horarios de Salida</h2>
  
  <div className="boat-details">
    <div className="boat-image-container">
      <img className="boat-image" src={Image1} alt="Embarcación de Fly Fishing" />
    </div>

    <div className="boat-description">
      <h3 className="boat-name">Embarcación "Tarpon Fighters" 🎣</h3>
      <p className="boat-text">
        Disfruta de una experiencia premium en fly fishing con nuestra embarcación equipada para tu comodidad y seguridad.
      </p>

      <ul className="boat-features">
        <li>👥 Capacidad para 3 personas</li>
        <li>🦺 Equipo de seguridad incluido</li>
        <li>🎣 Renta de equipo de pesca en caso de no contrar con uno propio</li>
        <li>🧑‍✈️ Guías expertos a bordo</li>
        {/* <li>🧭 Sistema de navegación GPS</li> */}
      </ul>
    </div>
  </div>

  <div className="schedule">
    <h3 className="schedule-title">Horarios de Salida</h3>
    <div className="schedule-cards">
      <div className="schedule-card">⏰ 6:00 AM - Unico Horario</div>
      {/* <div className="schedule-card">⏰ 10:00 AM - Mediodía</div>
      <div className="schedule-card">⏰ 3:00 PM - Vespertina</div>
      <div className="schedule-card">🌙 6:00 PM - Nocturna (temporada alta)</div> */}
    </div>
    <p className="schedule-note">Llega 15 minutos antes para embarcar sin contratiempos.</p>
  </div>
</section>



      
    </div>
  );
};

export default Home;
