import React, { useState, useEffect, useRef } from 'react';
import Portada from '../components/portada';
import InfoPeces from '../components/infoPeces';
import Image1 from '../assets/image/barco_pruba.png';
import personaje from '../assets/image/personaje.jpg';
import video from '../assets/video.mp4';
import {
  ShieldCheck,
  Fish,
  CalendarDays,
  Waves,
  Handshake,
} from 'lucide-react';
import '../styles/globalContainer.css';

// ── ID del video de YouTube ──────────────────────────────────────────────────
const YT_VIDEO_ID = 'i_P-ZW_q0wM';

const Home = () => {
  const containerRef = useRef(null); // div wrapper del iframe
  const playerRef = useRef(null); // instancia YT.Player
  const [ytReady, setYtReady] = useState(false);
  const videoRef = useRef(null);

  // 1. Cargar el script de la YouTube IFrame API una sola vez

  // 2. Crear el player cuando la API esté lista
  useEffect(() => {
    if (!ytReady || !containerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: YT_VIDEO_ID,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 0, // no autoplay al cargar
        mute: 1, // mute requerido para autoplay en navegadores
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
    });
  }, [ytReady]);

  // 3. IntersectionObserver: play al entrar, pause al salir
  useEffect(() => {
    if (!ytReady) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const player = playerRef.current;
          if (!player || typeof player.playVideo !== 'function') return;

          if (entry.isIntersecting) {
            player.playVideo();
          } else {
            player.pauseVideo();
          }
        });
      },
      { threshold: 0.5 } // 50% visible = play
    );

    // Observamos el contenedor (el iframe lo crea la API dentro de él)
    const el = containerRef.current?.parentElement;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [ytReady]);

  return (
    <div className='home-container'>
      <Portada />

      {/* ── Sección video ── */}
      <section className='info-section'>
        <h2>Descubre Todo lo que Ofrecemos</h2>
        <video
          ref={videoRef}
          className='hero-video__media'
          src={video}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* <button
          className='video-sound-button'
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = !videoRef.current.muted;
            }
          }}
        >
          🔊
        </button> */}

        <div className='hero-video__overlay'></div>
      </section>

<section className='guide-section'>

  <div className='guide-section-top'>

    <p className='guide-eyebrow'>
      El mar se conoce mejor con quien lo vive.
    </p>

    <h2 className='guide-title'>
      Meet the guide
    </h2>

    <div className='guide-rule' />

  </div>


  <div className='guide-card'>

    <div className='guide-image-container'>

      <img
        className='guide-image'
        src={personaje}
        alt='Ángel Ancona, Head Guide'
      />

      <div className='guide-image-scrim' />

      <div className='guide-image-footer'>

        <span className='guide-tag'>
          HEAD GUIDE
        </span>

        <h3 className='guide-name'>
          Angel Ancona
        </h3>

        <p className='guide-location'>
          GRASSHOPPER
        </p>

      </div>

    </div>


    <div className='guide-content'>

      <div className='guide-content-header'>

        <span className='guide-label'>
          SOBRE EL GUIA
        </span>

      </div>


      <div className='guide-intro'>

        Hijo y nieto de pescadores nativos de Holbox,
        Ángel nació y creció en la isla, desarrollando
        desde muy joven un talento excepcional para la
        pesca con mosca y un profundo conocimiento del
        agua y el comportamiento de los peces.

      </div>


      <p className='guide-text'>

        Con más de <strong>20 años de experiencia</strong> como guía
        de fly fishing, es reconocido como uno de los mejores
        guías de la región. Su precisión y dominio de la pesca
        a la vista lo han llevado a destacar en torneos como
        <strong> “THE MAYAN PERMIT”</strong>, celebrado en Xcalak,
        donde ha sido <strong>campeón durante 4 años consecutivos:
        2022, 2023, 2024 y 2025.</strong>

      </p>


      <div className='guide-highlights'>

        <div className='guide-highlight'>

          <span className='guide-highlight-line'></span>

          <strong>20+</strong>

          <span>AÑOS DE EXPERIENCIA</span>

        </div>


        <div className='guide-highlight'>

          <span className='guide-highlight-line'></span>

          <strong>4 AÑOS</strong>

          <span>CAMPEÓN MAYAN PERMIT</span>

        </div>


        <div className='guide-highlight'>

          <span className='guide-highlight-line'></span>

          <strong>HOLBOX</strong>

          <span>ORIGINARIO DE LA ISLA</span>

        </div>


        <div className='guide-highlight'>

          <span className='guide-highlight-line'></span>

          <strong>FLY FISHING</strong>

          <span>PESCA A LA VISTA</span>

        </div>

      </div>

    </div>

  </div>

</section>

      {/* ── Por qué reservar ── */}
      <section className='service-section'>
        <h2>¿Por Qué Reservar con Nosotros?</h2>
        <p>
          Nuestra plataforma está diseñada para facilitarte la mejor experiencia
          en fly fishing. Reserva tus días de pesca en los mejores lugares, con
          guías expertos y equipamiento de calidad, todo desde un mismo lugar.
        </p>

        <div className='service-cards'>
          <div className='service-card'>
            <span className='service-icon'>
              <div className='icon-wrapper'>
                <ShieldCheck />
              </div>
            </span>
            <h3>Seguridad Garantizada</h3>
            <p>
              Protegemos tus datos y aseguramos que tu experiencia sea privada y
              segura.
            </p>
          </div>
          <div className='service-card'>
            <span className='service-icon'>
              <Fish />
            </span>
            <h3>Guías Expertos</h3>
            <p>
              Conéctate con profesionales que conocen los mejores spots y
              técnicas de pesca.
            </p>
          </div>
          <div className='service-card'>
            <span className='service-icon'>
              <CalendarDays />
            </span>
            <h3>Reservas Simples</h3>
            <p>
              Planifica y reserva tu jornada de pesca en pocos pasos, sin
              complicaciones.
            </p>
          </div>
          <div className='service-card'>
            <span className='service-icon'>
              <Waves />
            </span>
            <h3>Equipamiento de Calidad</h3>
            <p>
              Accede a equipo profesional disponible para alquiler o compra
              según tu necesidad.
            </p>
          </div>
          <div className='service-card'>
            <span className='service-icon'>
              <Handshake />
            </span>
            <h3>Atención Personalizada</h3>
            <p>
              Estamos para ayudarte en cada paso, desde la reserva hasta la
              experiencia en el río.
            </p>
          </div>
        </div>
      </section>

      {/* ── Embarcación ── */}
      <section className='boat-info-section'>
        <div className='boat-section-top'>
          <p className='boat-eyebrow'>Su embarcación y salidas</p>
          <h2 className='section-title'>Embarcación y Horarios de Salida</h2>
          <div className='gold-rule' />
        </div>

        <div className='boat-details'>
          <div className='boat-image-container'>
            <img
              className='boat-image'
              src={Image1}
              alt='Embarcación de Fly Fishing'
            />
            <div className='boat-image-scrim' />
            <div className='boat-image-footer'>
              <span className='vessel-tag'>✦ Fly Fishing Premium</span>
              <h3 className='vessel-name'>Tarpon Fighters</h3>
              <p className='vessel-loc'>Península de Yucatán · México</p>
            </div>
          </div>

          <div className='boat-description'>
            <span className='boat-badge'>🎣 Fly Fishing Premium</span>
            <p className='boat-label'>Sobre la embarcación</p>
            <p className='boat-text'>
              Vive una experiencia única de pesca deportiva a bordo de una
              embarcación diseñada para brindarte comodidad, seguridad y el
              mejor desempeño en cada salida.
            </p>
            <ul className='boat-features'>
              <li>
                <span>👥</span>
                <div>
                  <strong>Capacidad</strong>
                  <p>Hasta 3 personas</p>
                </div>
              </li>
              <li>
                <span>🦺</span>
                <div>
                  <strong>Seguridad</strong>
                  <p>Equipo completo incluido</p>
                </div>
              </li>
              <li>
                <span>🎣</span>
                <div>
                  <strong>Equipo de pesca</strong>
                  <p>Disponible para renta si no cuentas con el tuyo</p>
                </div>
              </li>
              <li>
                <span>🧑‍✈️</span>
                <div>
                  <strong>Guías expertos</strong>
                  <p>Acompañamiento profesional durante la experiencia</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
