import React from 'react';
import '../styles/footer.css';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section about">
          <h4>Sobre Nosotros</h4>
          <p>Somos una plataforma especializada en reservas para experiencias únicas de fly fishing. Vive la pesca deportiva como nunca antes.</p>
        </div>

        <div className="footer-section contact">
          <h4>Contacto</h4>
          <p><Mail size={16} /> info@flyfishingholbox.com.mx</p>
          <p><Phone size={16} /> +52 984 205 4246</p>
        </div>

        {/* <div className="footer-section links">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/reservaciones">Reservaciones</a></li>
            <li><a href="/galeria">Galería</a></li>
            <li><a href="/reseñas">Reseñas</a></li>
            <li><a href="/contacto">Contáctanos</a></li>
          </ul>
        </div> */}

        <div className="footer-section social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Tarpon Fighters. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
