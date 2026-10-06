import React from 'react';

import '../styles/footer.css';

import {
    Facebook,
    Instagram,
    Mail,
    Phone,
    ArrowUpRight
} from 'lucide-react';

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (

        <footer className="footer">

            {/* =====================================
                CTA
            ===================================== */}
<div className="footer-cta">

    <div className="footer-cta-content">

        <span className="footer-eyebrow">
            TARPON FIGHTERS · HOLBOX
        </span>

        <h2>
            The water <em>is waiting.</em>
        </h2>

        <div className="footer-cta-bottom">

            <p>
                Vive una experiencia de fly fishing
                que recordarás mucho después de dejar el agua.
            </p>

            <a
                href="/#/reservaciones/steps/1"
                className="footer-cta-button"
            >
                RESERVAR AHORA
                <ArrowUpRight size={15} />
            </a>

        </div>

    </div>

</div>

            {/* =====================================
                MAIN FOOTER
            ===================================== */}

            <div className="footer-main">

                <div className="footer-brand">

                    <span className="footer-brand-mark">
                        TF
                    </span>

                    <div>

                        <h3>
                            TARPON
                            <span>FIGHTERS</span>
                        </h3>

                        <p>
                            Fly Fishing · Holbox, México
                        </p>

                    </div>

                </div>


                <div className="footer-column">

                    <span className="footer-column-title">
                        EXPLORA
                    </span>

                    <a href="/home">
                        Inicio
                    </a>

                    <a href="/#/reservaciones/steps/1">
                        Reservaciones
                    </a>

                    <a href="/articulos">
                        Mundo Pesca
                    </a>

                    <a href="/galeria">
                        Galería
                    </a>

                </div>


                <div className="footer-column">

                    <span className="footer-column-title">
                        CONTACTO
                    </span>

                    <a
                        href="mailto:info@flyfishingholbox.com.mx"
                        className="footer-contact"
                    >
                        <Mail size={15} />
                        info@flyfishingholbox.com.mx
                    </a>

                    <a
                        href="tel:+529842054246"
                        className="footer-contact"
                    >
                        <Phone size={15} />
                        +52 984 205 4246
                    </a>

                </div>


                <div className="footer-column footer-social-column">

                    <span className="footer-column-title">
                        SÍGUENOS
                    </span>

                    <p>
                        Sigue nuestras jornadas,
                        capturas y aventuras en Holbox.
                    </p>

                    <div className="footer-social">

                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <Facebook size={17} />
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <Instagram size={17} />
                        </a>

                    </div>

                </div>

            </div>


            {/* =====================================
                BOTTOM
            ===================================== */}

            <div className="footer-bottom">

                <span>
                    © {currentYear} Tarpon Fighters
                </span>

                <span className="footer-bottom-center">
                    FLY FISHING · HOLBOX · MÉXICO
                </span>

                <div className="footer-bottom-links">

                    <a href="/#/Politica de Privacidad">
                        Privacidad
                    </a>

                    <a href="/#/Terminos y Condiciones">
                        Términos
                    </a>

                </div>

            </div>

        </footer>
    );
};

export default Footer;