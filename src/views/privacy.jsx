import { useEffect, useState } from "react";
import "../styles/Privacy.css";

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("responsable");

  const sections = [
    ["responsable", "01. Responsable"],
    ["datos", "02. Datos personales"],
    ["sensibles", "03. Datos sensibles"],
    ["finalidades", "04. Finalidades"],
    ["consentimiento", "05. Consentimiento"],
    ["reservas", "06. Reservas y cuenta"],
    ["pagos", "07. Pagos"],
    ["fotografias", "08. Fotografías e imagen"],
    ["cookies", "09. Cookies"],
    ["transferencias", "10. Transferencias"],
    ["terceros", "11. Encargados y terceros"],
    ["conservacion", "12. Conservación"],
    ["arco", "13. Derechos ARCO"],
    ["limitacion", "14. Limitación y revocación"],
    ["seguridad", "15. Seguridad"],
    ["vulneraciones", "16. Vulneraciones"],
    ["cambios", "17. Cambios al aviso"],
    ["contacto", "18. Contacto"],
  ];

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const elements = sections
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top -
              b.boundingClientRect.top
          );

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) =>
        observer.unobserve(element)
      );
    };
  }, []);

  return (
    <main className="privacy-page">

      {/* =========================
          HERO
      ========================= */}
      <section className="privacy-hero">
        <div className="privacy-hero-content">
          <span className="privacy-eyebrow">
            TARPON FIGHTERS
          </span>

          <h1>Aviso de Privacidad</h1>

          <p>
            Conoce cómo TARPON FIGHTERS recopila, utiliza,
            conserva y protege tus datos personales al utilizar
            nuestra plataforma y contratar nuestros servicios.
          </p>

          <span className="privacy-date">
            Última actualización: [FECHA]
          </span>
        </div>
      </section>

      {/* =========================
          CONTENIDO
      ========================= */}
      <section className="privacy-container">

        {/* SIDEBAR */}
        <aside className="privacy-sidebar">
          <div className="privacy-sidebar-card">

            <span className="privacy-sidebar-title">
              Contenido
            </span>

            {sections.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={
                  activeSection === id ? "active" : ""
                }
                onClick={(e) =>
                  handleSectionClick(e, id)
                }
              >
                {label}
              </a>
            ))}

          </div>
        </aside>

        {/* DOCUMENTO */}
        <article className="privacy-content">

          {/* INTRODUCCIÓN */}
          <div className="privacy-intro">

            <span className="section-label">
              Información legal
            </span>

            <p>
              <strong>
                [RAZÓN SOCIAL O NOMBRE]
              </strong>
              , bajo el nombre comercial
              <strong> TARPON FIGHTERS</strong>, es responsable
              del tratamiento de los datos personales que sean
              recabados a través de su sitio web, plataforma,
              formularios, procesos de reservación y demás medios
              relacionados con la prestación de sus servicios.
            </p>

            <p>
              El presente Aviso de Privacidad Integral se emite de
              conformidad con la legislación mexicana aplicable en
              materia de protección de datos personales y tiene como
              finalidad informar a las personas titulares sobre las
              características principales del tratamiento de sus
              datos personales.
            </p>

            <p>
              Al proporcionar datos personales, la persona titular
              deberá leer cuidadosamente el presente Aviso de
              Privacidad y los demás documentos legales aplicables.
            </p>

          </div>

          {/* =========================
              01 RESPONSABLE
          ========================= */}
          <section
            id="responsable"
            className="privacy-section"
          >
            <span className="section-number">
              01
            </span>

            <h2>Identificación del responsable</h2>

            <p>
              El responsable del tratamiento de los datos personales
              es:
            </p>

            <div className="provider-card">

              <div>
                <span>
                  Nombre comercial
                </span>

                <strong>
                  TARPON FIGHTERS
                </strong>
              </div>

              <div>
                <span>
                  Razón social / nombre completo
                </span>

                <strong>
                  [RAZÓN SOCIAL O NOMBRE]
                </strong>
              </div>

              <div>
                <span>
                  RFC
                </span>

                <strong>
                  [RFC]
                </strong>
              </div>

              <div>
                <span>
                  Domicilio
                </span>

                <strong>
                  [DOMICILIO]
                </strong>
              </div>

              <div>
                <span>
                  Correo electrónico
                </span>

                <strong>
                  [CORREO]
                </strong>
              </div>

              <div>
                <span>
                  Teléfono
                </span>

                <strong>
                  [TELÉFONO]
                </strong>
              </div>

              <div>
                <span>
                  Sitio web
                </span>

                <strong>
                  [DOMINIO]
                </strong>
              </div>

            </div>

            <div className="privacy-note">
              <strong>
                Responsable
              </strong>

              <p>
                Para cualquier cuestión relacionada con el
                tratamiento de datos personales, solicitudes ARCO,
                revocación del consentimiento o limitación del uso
                de datos, la persona titular podrá utilizar los
                medios de contacto señalados en este Aviso.
              </p>
            </div>

          </section>

          {/* =========================
              02 DATOS
          ========================= */}
          <section
            id="datos"
            className="privacy-section"
          >
            <span className="section-number">
              02
            </span>

            <h2>
              Datos personales que serán tratados
            </h2>

            <p>
              Para proporcionar los servicios ofrecidos por
              TARPON FIGHTERS, podremos recabar únicamente los
              datos personales que resulten necesarios, adecuados
              y relevantes para las finalidades informadas.
            </p>

            <h3>
              Datos de identificación
            </h3>

            <ul>
              <li>
                Nombre y apellidos.
              </li>

              <li>
                Información necesaria para identificar la
                reservación.
              </li>

              <li>
                Datos necesarios para verificar la identidad
                cuando resulte necesario.
              </li>
            </ul>

            <h3>
              Datos de contacto
            </h3>

            <ul>
              <li>
                Correo electrónico.
              </li>

              <li>
                Número telefónico.
              </li>

              <li>
                Información necesaria para establecer
                comunicación relacionada con el servicio.
              </li>
            </ul>

            <h3>
              Datos relacionados con la reservación
            </h3>

            <ul>
              <li>
                Fecha de la actividad.
              </li>

              <li>
                Horario.
              </li>

              <li>
                Número de participantes.
              </li>

              <li>
                Servicio contratado.
              </li>

              <li>
                Servicios adicionales.
              </li>

              <li>
                Estado de la reservación.
              </li>

              <li>
                Estado y referencia de pago.
              </li>
            </ul>

            <h3>
              Datos de facturación
            </h3>

            <p>
              En caso de que el usuario solicite factura, podrán
              recabarse los datos fiscales necesarios para su
              elaboración, tales como:
            </p>

            <ul>
              <li>
                Nombre o razón social.
              </li>

              <li>
                RFC.
              </li>

              <li>
                Domicilio fiscal, cuando resulte necesario.
              </li>

              <li>
                Régimen fiscal.
              </li>

              <li>
                Código postal.
              </li>

              <li>
                Uso de CFDI y demás información requerida para
                emitir el comprobante fiscal.
              </li>
            </ul>

            <h3>
              Datos técnicos
            </h3>

            <ul>
              <li>
                Dirección IP.
              </li>

              <li>
                Tipo de dispositivo.
              </li>

              <li>
                Sistema operativo.
              </li>

              <li>
                Navegador.
              </li>

              <li>
                Información técnica necesaria para seguridad y
                funcionamiento.
              </li>
            </ul>

          </section>

          {/* =========================
              03 SENSIBLES
          ========================= */}
          <section
            id="sensibles"
            className="privacy-section"
          >
            <span className="section-number">
              03
            </span>

            <h2>
              Datos personales sensibles
            </h2>

            <p>
              TARPON FIGHTERS no solicitará datos personales
              sensibles salvo que exista una necesidad legítima,
              concreta y relacionada con una finalidad determinada.
            </p>

            <p>
              Cuando resulte necesario tratar datos personales
              sensibles, se solicitará el consentimiento expreso
              correspondiente, salvo que se actualice alguna de las
              excepciones previstas por la legislación aplicable.
            </p>

            <div className="privacy-note">
              <strong>
                Importante
              </strong>

              <p>
                La persona titular deberá evitar proporcionar
                información sensible que no sea necesaria para la
                prestación del servicio.
              </p>
            </div>

          </section>

          {/* =========================
              04 FINALIDADES
          ========================= */}
          <section
            id="finalidades"
            className="privacy-section"
          >
            <span className="section-number">
              04
            </span>

            <h2>
              Finalidades del tratamiento
            </h2>

            <p>
              Los datos personales serán utilizados para las
              finalidades que se describen a continuación.
            </p>

            <h3>
              Finalidades primarias
            </h3>

            <p>
              Son aquellas necesarias para la existencia,
              mantenimiento y cumplimiento de la relación con la
              persona titular:
            </p>

            <ul>
              <li>
                Crear y administrar cuentas de usuario.
              </li>

              <li>
                Registrar y administrar reservaciones.
              </li>

              <li>
                Confirmar fechas y horarios.
              </li>

              <li>
                Coordinar la prestación del servicio.
              </li>

              <li>
                Contactar al usuario respecto de su reservación.
              </li>

              <li>
                Enviar confirmaciones y recordatorios.
              </li>

              <li>
                Gestionar pagos.
              </li>

              <li>
                Gestionar cancelaciones y modificaciones.
              </li>

              <li>
                Generar comprobantes y documentación relacionada
                con la reservación.
              </li>

              <li>
                Atender solicitudes, dudas, aclaraciones y
                reclamaciones.
              </li>

              <li>
                Prevenir fraude, abuso y usos no autorizados.
              </li>

              <li>
                Cumplir obligaciones legales.
              </li>

              <li>
                Ejercer o defender derechos.
              </li>
            </ul>

            <h3>
              Finalidades secundarias
            </h3>

            <p>
              Adicionalmente, y cuando resulte aplicable, los datos
              podrán utilizarse para:
            </p>

            <ul>
              <li>
                Enviar información promocional.
              </li>

              <li>
                Informar sobre nuevos servicios.
              </li>

              <li>
                Enviar promociones.
              </li>

              <li>
                Realizar encuestas de satisfacción.
              </li>

              <li>
                Analizar y mejorar la experiencia del usuario.
              </li>
            </ul>

            <div className="privacy-note">
              <strong>
                Finalidades secundarias
              </strong>

              <p>
                La persona titular podrá manifestar su negativa al
                tratamiento para finalidades secundarias mediante
                los mecanismos que TARPON FIGHTERS ponga a su
                disposición.
              </p>
            </div>

          </section>

          {/* =========================
              05 CONSENTIMIENTO
          ========================= */}
          <section
            id="consentimiento"
            className="privacy-section"
          >
            <span className="section-number">
              05
            </span>

            <h2>
              Consentimiento
            </h2>

            <p>
              El tratamiento de datos personales se realizará
              conforme a los principios y obligaciones previstos por
              la legislación aplicable.
            </p>

            <p>
              Cuando legalmente se requiera consentimiento, éste
              será obtenido mediante los mecanismos correspondientes.
            </p>

            <p>
              Para tratamientos que requieran consentimiento expreso
              o expreso y por escrito, se utilizarán mecanismos que
              permitan acreditar razonablemente la manifestación de
              voluntad de la persona titular.
            </p>

            <p>
              La negativa para el tratamiento de datos que no sean
              necesarios para la relación jurídica no deberá impedir
              el acceso a los servicios cuando dichos datos no sean
              necesarios para proporcionarlos.
            </p>

          </section>

          {/* =========================
              06 RESERVAS
          ========================= */}
          <section
            id="reservas"
            className="privacy-section"
          >
            <span className="section-number">
              06
            </span>

            <h2>
              Cuenta y reservaciones
            </h2>

            <p>
              Los datos proporcionados durante el registro y proceso
              de reservación serán asociados con la cuenta o
              reservación correspondiente.
            </p>

            <p>
              Esta información podrá incluir datos de contacto,
              información del servicio contratado, fecha, horario,
              participantes, importe, estado de pago y demás
              información necesaria para administrar la reserva.
            </p>

            <h3>
              Datos de terceros
            </h3>

            <p>
              Cuando una persona proporcione datos personales de
              otros participantes, deberá hacerlo contando con las
              facultades o autorizaciones necesarias y procurando
              informarles sobre dicho tratamiento.
            </p>

          </section>

          {/* =========================
              07 PAGOS
          ========================= */}
          <section
            id="pagos"
            className="privacy-section"
          >
            <span className="section-number">
              07
            </span>

            <h2>
              Pagos y proveedores de pago
            </h2>

            <p>
              TARPON FIGHTERS podrá utilizar proveedores externos
              para procesar pagos relacionados con las reservaciones.
            </p>

            <p>
              Entre estos proveedores podrá encontrarse
              <strong> PayPal</strong>.
            </p>

            <p>
              Cuando el pago sea procesado directamente por un
              tercero, la información financiera será tratada de
              conformidad con las políticas y condiciones del
              proveedor correspondiente.
            </p>

            <p>
              TARPON FIGHTERS no pretende almacenar directamente
              números completos de tarjetas, códigos de seguridad
              u otra información financiera sensible que no resulte
              necesaria para administrar la reservación.
            </p>

            <p>
              Podrán conservarse datos relacionados con la
              transacción, tales como importe, fecha, identificador
              de operación y estado del pago.
            </p>

          </section>

          {/* =========================
              08 FOTOGRAFÍAS
          ========================= */}
          <section
            id="fotografias"
            className="privacy-section"
          >
            <span className="section-number">
              08
            </span>

            <h2>
              Fotografías y derechos de imagen
            </h2>

            <p>
              Durante la prestación de los servicios podrán tomarse
              fotografías relacionadas con la experiencia de pesca,
              incluyendo participantes, guías, embarcaciones,
              paisajes, equipo y capturas.
            </p>

            <p>
              La galería de TARPON FIGHTERS será administrada
              exclusivamente por personal autorizado.
            </p>

            <p>
              Los clientes y usuarios no tendrán autorización para
              cargar directamente fotografías a la galería mediante
              la plataforma.
            </p>

            <h3>
              Fotografías identificables
            </h3>

            <p>
              Cuando una fotografía permita identificar claramente a
              una persona, se considerarán los derechos de imagen,
              privacidad y protección de datos que resulten aplicables
              al uso pretendido.
            </p>

            <h3>
              Uso promocional
            </h3>

            <p>
              Cuando se pretenda utilizar la imagen identificable de
              una persona para fines promocionales o publicitarios,
              TARPON FIGHTERS solicitará la autorización
              correspondiente cuando ésta resulte necesaria.
            </p>

            <p>
              La realización de una reservación o participación en
              una actividad no deberá interpretarse por sí sola como
              una autorización ilimitada para utilizar la imagen de
              una persona con fines publicitarios.
            </p>

            <h3>
              Menores de edad
            </h3>

            <p>
              Cuando una persona menor de edad sea identificable en
              una fotografía y el uso pretendido requiera
              autorización, ésta deberá obtenerse del padre, madre,
              tutor o representante legal que corresponda.
            </p>

            <h3>
              Solicitud de retiro
            </h3>

            <p>
              Una persona podrá solicitar la revisión o retiro de
              una fotografía cuando considere que afecta sus
              derechos.
            </p>

            <div className="privacy-contact-box">
              <span>
                Solicitudes relacionadas con fotografías
              </span>

              <strong>
                [CORREO]
              </strong>
            </div>

          </section>

          {/* =========================
              09 COOKIES
          ========================= */}
          <section
            id="cookies"
            className="privacy-section"
          >
            <span className="section-number">
              09
            </span>

            <h2>
              Cookies y tecnologías similares
            </h2>

            <p>
              La plataforma podrá utilizar cookies, almacenamiento
              local y tecnologías similares necesarias para su
              funcionamiento.
            </p>

            <h3>
              Cookies necesarias
            </h3>

            <p>
              Podrán utilizarse para mantener sesiones, recordar
              determinadas configuraciones, proporcionar funciones
              de seguridad y permitir el funcionamiento de la
              plataforma.
            </p>

            <h3>
              Cookies de análisis
            </h3>

            <p>
              Si se implementan herramientas de análisis, éstas
              podrán recopilar información relacionada con la forma
              en que se utiliza el sitio.
            </p>

            <p>
              El usuario podrá configurar su navegador para
              administrar determinadas cookies.
            </p>

            <div className="privacy-note">
              <strong>
                Terceros
              </strong>

              <p>
                Si en el futuro se incorporan servicios de análisis,
                publicidad o tecnologías de terceros que impliquen
                tratamientos adicionales, este Aviso será actualizado
                cuando corresponda.
              </p>
            </div>

          </section>

          {/* =========================
              10 TRANSFERENCIAS
          ========================= */}
          <section
            id="transferencias"
            className="privacy-section"
          >
            <span className="section-number">
              10
            </span>

            <h2>
              Transferencias de datos personales
            </h2>

            <p>
              TARPON FIGHTERS podrá transferir datos personales
              cuando dicha transferencia sea necesaria para cumplir
              las finalidades informadas, exista consentimiento
              cuando éste sea requerido o se actualice alguna de las
              excepciones previstas por la legislación aplicable.
            </p>

            <p>
              Las transferencias podrán realizarse a proveedores
              tecnológicos, proveedores de pago, prestadores de
              servicios y terceros que resulten necesarios para la
              operación del servicio.
            </p>

            <p>
              Cuando corresponda, se comunicarán al tercero las
              condiciones y limitaciones previstas en el presente
              Aviso de Privacidad.
            </p>

          </section>

          {/* =========================
              11 TERCEROS
          ========================= */}
          <section
            id="terceros"
            className="privacy-section"
          >
            <span className="section-number">
              11
            </span>

            <h2>
              Encargados y servicios tecnológicos
            </h2>

            <p>
              TARPON FIGHTERS podrá contratar o utilizar terceros
              que traten datos personales por cuenta del responsable
              para prestar servicios tecnológicos u operativos.
            </p>

            <div className="privacy-provider-grid">

              <div className="privacy-provider-item">
                <span>
                  Infraestructura y servicios tecnológicos
                </span>

                <strong>
                  Firebase
                </strong>
              </div>

              <div className="privacy-provider-item">
                <span>
                  Procesamiento de pagos
                </span>

                <strong>
                  PayPal
                </strong>
              </div>

            </div>

            <p>
              Los proveedores podrán tratar información únicamente
              en la medida necesaria para proporcionar los servicios
              contratados y conforme a las condiciones aplicables.
            </p>

          </section>

          {/* =========================
              12 CONSERVACIÓN
          ========================= */}
          <section
            id="conservacion"
            className="privacy-section"
          >
            <span className="section-number">
              12
            </span>

            <h2>
              Conservación, bloqueo y supresión
            </h2>

            <p>
              Los datos personales serán conservados durante el
              periodo necesario para cumplir las finalidades que
              motivaron su tratamiento.
            </p>

            <p>
              Una vez que los datos dejen de ser necesarios, serán
              suprimidos, previo bloqueo cuando corresponda, y
              conforme a los plazos legales o contractuales
              aplicables.
            </p>

            <p>
              Cuando exista una obligación legal de conservación,
              responsabilidad pendiente, procedimiento o necesidad
              de ejercer o defender derechos, los datos podrán
              conservarse durante el periodo correspondiente.
            </p>

            <div className="privacy-note">
              <strong>
                Limitación
              </strong>

              <p>
                TARPON FIGHTERS procurará que el periodo de
                tratamiento y conservación sea únicamente el
                necesario para las finalidades informadas.
              </p>
            </div>

          </section>

          {/* =========================
              13 ARCO
          ========================= */}
          <section
            id="arco"
            className="privacy-section"
          >
            <span className="section-number">
              13
            </span>

            <h2>
              Derechos ARCO
            </h2>

            <p>
              La persona titular podrá ejercer sus derechos de
              Acceso, Rectificación, Cancelación y Oposición
              respecto de sus datos personales.
            </p>

            <div className="arco-grid">

              <div className="arco-card">
                <span>A</span>

                <h3>
                  Acceso
                </h3>

                <p>
                  Conocer qué datos personales son tratados y las
                  condiciones de su tratamiento.
                </p>
              </div>

              <div className="arco-card">
                <span>R</span>

                <h3>
                  Rectificación
                </h3>

                <p>
                  Solicitar la corrección de datos personales
                  inexactos, incompletos o desactualizados.
                </p>
              </div>

              <div className="arco-card">
                <span>C</span>

                <h3>
                  Cancelación
                </h3>

                <p>
                  Solicitar la eliminación de los datos cuando
                  resulte procedente.
                </p>
              </div>

              <div className="arco-card">
                <span>O</span>

                <h3>
                  Oposición
                </h3>

                <p>
                  Oponerse al tratamiento para determinadas
                  finalidades cuando legalmente corresponda.
                </p>
              </div>

            </div>

            <h3>
              Requisitos de la solicitud
            </h3>

            <p>
              La solicitud deberá contener, como mínimo, la
              información necesaria para identificar a la persona
              titular y localizar sus datos, así como una descripción
              clara del derecho que pretende ejercer.
            </p>

            <p>
              Cuando corresponda, deberá acompañarse la
              documentación necesaria para acreditar la identidad o
              representación.
            </p>

            <h3>
              Medio para presentar solicitudes
            </h3>

            <div className="privacy-contact-box">

              <span>
                Correo para solicitudes ARCO
              </span>

              <strong>
                [CORREO]
              </strong>

            </div>

            <p>
              Las solicitudes serán atendidas dentro de los plazos
              y conforme al procedimiento establecidos por la
              legislación aplicable.
            </p>

          </section>

          {/* =========================
              14 LIMITACIÓN
          ========================= */}
          <section
            id="limitacion"
            className="privacy-section"
          >
            <span className="section-number">
              14
            </span>

            <h2>
              Revocación y limitación del uso o divulgación
            </h2>

            <h3>
              Revocación del consentimiento
            </h3>

            <p>
              La persona titular podrá solicitar la revocación de
              su consentimiento para determinados tratamientos,
              cuando éste sea la base aplicable y la revocación sea
              legalmente procedente.
            </p>

            <p>
              La revocación no tendrá efectos retroactivos y no
              podrá afectar tratamientos que deban continuar por una
              obligación legal o contractual.
            </p>

            <h3>
              Limitación del uso
            </h3>

            <p>
              La persona titular podrá solicitar mecanismos para
              limitar el uso o divulgación de sus datos personales,
              particularmente respecto de finalidades secundarias.
            </p>

            <div className="privacy-note">
              <strong>
                Comunicaciones necesarias
              </strong>

              <p>
                Las comunicaciones necesarias para administrar una
                reservación, confirmar pagos, informar cambios o
                proporcionar el servicio podrán continuar cuando
                sean necesarias para la relación jurídica.
              </p>
            </div>

          </section>

          {/* =========================
              15 SEGURIDAD
          ========================= */}
          <section
            id="seguridad"
            className="privacy-section"
          >
            <span className="section-number">
              15
            </span>

            <h2>
              Medidas de seguridad
            </h2>

            <p>
              TARPON FIGHTERS implementará medidas administrativas,
              técnicas y físicas razonables para proteger los datos
              personales contra daño, pérdida, alteración,
              destrucción o acceso, tratamiento o uso no autorizado.
            </p>

            <h3>
              Medidas técnicas
            </h3>

            <ul>
              <li>
                Controles de acceso.
              </li>

              <li>
                Autenticación.
              </li>

              <li>
                Gestión de permisos.
              </li>

              <li>
                Protección de infraestructura.
              </li>

              <li>
                Restricción de acceso a información.
              </li>
            </ul>

            <h3>
              Confidencialidad
            </h3>

            <p>
              Las personas que intervengan en el tratamiento de
              datos personales estarán sujetas al deber de
              confidencialidad correspondiente.
            </p>

          </section>

          {/* =========================
              16 VULNERACIONES
          ========================= */}
          <section
            id="vulneraciones"
            className="privacy-section"
          >
            <span className="section-number">
              16
            </span>

            <h2>
              Vulneraciones de seguridad
            </h2>

            <p>
              En caso de que ocurra una vulneración de seguridad que
              afecte de manera significativa los derechos
              patrimoniales o morales de las personas titulares,
              TARPON FIGHTERS realizará las acciones y comunicaciones
              que correspondan conforme a la legislación aplicable.
            </p>

            <p>
              Las acciones podrán incluir la identificación de la
              vulneración, evaluación de sus efectos, implementación
              de medidas correctivas y, cuando legalmente corresponda,
              comunicación a las personas afectadas.
            </p>

          </section>

          {/* =========================
              17 CAMBIOS
          ========================= */}
          <section
            id="cambios"
            className="privacy-section"
          >
            <span className="section-number">
              17
            </span>

            <h2>
              Cambios al Aviso de Privacidad
            </h2>

            <p>
              TARPON FIGHTERS podrá modificar, actualizar o ampliar
              este Aviso de Privacidad cuando resulte necesario por
              cambios legales, operativos, tecnológicos o en los
              servicios proporcionados.
            </p>

            <p>
              La versión vigente permanecerá disponible en la
              plataforma.
            </p>

            <p>
              Cada actualización indicará su fecha de entrada en
              vigor o última actualización.
            </p>

            <div className="privacy-link-card">

              <div>
                <span>
                  Documento vigente
                </span>

                <strong>
                  Aviso de Privacidad Integral
                </strong>
              </div>

              <span className="privacy-version">
                Versión 1.0
              </span>

            </div>

          </section>

          {/* =========================
              18 CONTACTO
          ========================= */}
          <section
            id="contacto"
            className="privacy-section privacy-final"
          >
            <span className="section-number">
              18
            </span>

            <h2>
              Contacto
            </h2>

            <p>
              Para cualquier duda relacionada con el presente Aviso
              de Privacidad, tratamiento de datos personales,
              ejercicio de derechos ARCO, revocación del
              consentimiento, limitación del uso o divulgación, o
              solicitudes relacionadas con fotografías e imagen,
              puedes comunicarte mediante:
            </p>

            <div className="provider-card contact-card">

              <div>
                <span>
                  Responsable
                </span>

                <strong>
                  TARPON FIGHTERS
                </strong>
              </div>

              <div>
                <span>
                  Correo electrónico
                </span>

                <strong>
                  [CORREO]
                </strong>
              </div>

              <div>
                <span>
                  Teléfono
                </span>

                <strong>
                  [TELÉFONO]
                </strong>
              </div>

              <div>
                <span>
                  Domicilio
                </span>

                <strong>
                  [DOMICILIO]
                </strong>
              </div>

              <div>
                <span>
                  Horario de atención
                </span>

                <strong>
                  [HORARIO]
                </strong>
              </div>

            </div>

          </section>

          {/* =========================
              CIERRE
          ========================= */}
          <div className="privacy-acceptance">

            <span>
              Documento legal
            </span>

            <h3>
              Aviso de Privacidad Integral
            </h3>

            <p>
              El presente Aviso de Privacidad constituye la versión
              integral puesta a disposición de las personas titulares
              de los datos personales tratados por TARPON FIGHTERS.
            </p>

            <div className="privacy-version">
              <span>
                Versión 1.0
              </span>

              <span>
                •
              </span>

              <span>
                Entrada en vigor: [FECHA]
              </span>
            </div>

          </div>

        </article>
      </section>
    </main>
  );
};

export default Privacy;