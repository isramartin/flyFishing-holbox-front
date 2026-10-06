import { useEffect, useState } from 'react';
import '../styles/Terms.css';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('proveedor');

  useEffect(() => {
    const sections = document.querySelectorAll('.terms-section');

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <main className='terms-page'>
      <section className='terms-hero'>
        <div className='terms-hero-content'>
          <span className='terms-eyebrow'>TARPON FIGHTERS</span>

          <h1>Términos y Condiciones</h1>

          <p>
            Información importante sobre el uso de nuestra plataforma y la
            contratación de nuestros servicios de pesca con mosca.
          </p>

          <span className='terms-date'>Última actualización: [FECHA]</span>
        </div>
      </section>

      <section className='terms-container'>
        <aside className='terms-sidebar'>
          <div className='terms-sidebar-card'>
            <span className='terms-sidebar-title'>Contenido</span>

            <a
              href='#proveedor'
              className={activeSection === 'proveedor' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'proveedor')}
            >
              01. Proveedor
            </a>

            <a
              href='#aceptacion'
              className={activeSection === 'aceptacion' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'aceptacion')}
            >
              02. Aceptación
            </a>

            <a
              href='#servicio'
              className={activeSection === 'servicio' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'servicio')}
            >
              03. Servicio
            </a>

            <a
              href='#cuenta'
              className={activeSection === 'cuenta' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'cuenta')}
            >
              04. Cuenta
            </a>

            <a
              href='#reservas'
              className={activeSection === 'reservas' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'reservas')}
            >
              05. Reservas
            </a>

            <a
              href='#actividad'
              className={activeSection === 'actividad' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'actividad')}
            >
              06. Actividad
            </a>

            <a
              href='#pagos'
              className={activeSection === 'pagos' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'pagos')}
            >
              07. Pagos
            </a>

            <a
              href='#cancelaciones'
              className={activeSection === 'cancelaciones' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'cancelaciones')}
            >
              08. Cancelaciones
            </a>

            <a
              href='#fotografias'
              className={activeSection === 'fotografias' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'fotografias')}
            >
              09. Fotografías
            </a>

            <a
              href='#usuarios'
              className={activeSection === 'usuarios' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'usuarios')}
            >
              10. Usuarios
            </a>

            <a
              href='#propiedad'
              className={activeSection === 'propiedad' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'propiedad')}
            >
              11. Propiedad intelectual
            </a>

            <a
              href='#plataforma'
              className={activeSection === 'plataforma' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'plataforma')}
            >
              12. Plataforma
            </a>

            <a
              href='#privacidad'
              className={activeSection === 'privacidad' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'privacidad')}
            >
              13. Privacidad
            </a>

            <a
              href='#comunicaciones'
              className={activeSection === 'comunicaciones' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'comunicaciones')}
            >
              14. Comunicaciones
            </a>

            <a
              href='#modificaciones'
              className={activeSection === 'modificaciones' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'modificaciones')}
            >
              15. Modificaciones
            </a>

            <a
              href='#legislacion'
              className={activeSection === 'legislacion' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'legislacion')}
            >
              16. Legislación
            </a>

            <a
              href='#contacto'
              className={activeSection === 'contacto' ? 'active' : ''}
              onClick={(e) => handleSectionClick(e, 'contacto')}
            >
              17. Contacto
            </a>
          </div>
        </aside>

        <article className='terms-content'>
          <div className='terms-intro'>
            <span className='section-label'>Información legal</span>

            <p>
              Estos Términos y Condiciones regulan el acceso y uso de la
              plataforma <strong>TARPON FIGHTERS</strong>, así como la
              contratación de servicios de pesca con mosca (fly fishing).
            </p>
          </div>

          <section id='proveedor' className='terms-section'>
            <span className='section-number'>01</span>

            <h2>Identificación del proveedor</h2>

            <p>
              El presente documento establece los términos y condiciones
              aplicables al uso de la plataforma{' '}
              <strong>TARPON FIGHTERS</strong>, así como a la contratación de
              servicios de pesca con mosca mediante la plataforma.
            </p>

            <p>El proveedor del servicio es:</p>

            <div className='provider-card'>
              <div>
                <span>Nombre comercial</span>
                <strong>TARPON FIGHTERS</strong>
              </div>

              <div>
                <span>nombre completo</span>
                <strong>ANGEL ANCONA</strong>
              </div>

              <div>
                <span>RFC</span>
                <strong>[RFC]</strong>
              </div>

              <div>
                <span>Domicilio</span>
                <strong>[DOMICILIO]</strong>
              </div>

              <div>
                <span>Correo electrónico</span>
                <strong>INFO@FLYFISHINGHOLBOX.COM.MX</strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong>+52 984 205 4246</strong>
              </div>

              <div>
                <span>Sitio web</span>
                <strong>FLYFISHINGHOLBOX.COM.MX</strong>
              </div>
            </div>
          </section>

          <section id='aceptacion' className='terms-section'>
            <span className='section-number'>02</span>

            <h2>Aceptación de los términos</h2>

            <p>
              El acceso y utilización de la plataforma, la creación de una
              cuenta, la realización de una reserva o el uso de cualquiera de
              los servicios ofrecidos implica la aceptación de estos Términos y
              Condiciones.
            </p>

            <p>
              Antes de completar una reserva, la persona usuaria deberá aceptar
              expresamente los documentos legales que correspondan.
            </p>

            <p>
              La persona usuaria declara que la información proporcionada es
              verdadera, completa y actualizada.
            </p>
          </section>

          <section id='servicio' className='terms-section'>
            <span className='section-number'>03</span>

            <h2>Descripción del servicio</h2>

            <p>
              TARPON FIGHTERS ofrece servicios de pesca deportiva con mosca (
              <em>fly fishing</em>) mediante reservas realizadas a través de su
              plataforma.
            </p>

            <p>
              Dependiendo del servicio contratado, la experiencia podrá incluir
              actividades de pesca, traslado, guía, embarcación, equipo,
              materiales u otros servicios expresamente indicados en la
              descripción de la reserva.
            </p>

            <div className='terms-note'>
              <strong>Importante</strong>

              <p>
                Los servicios incluidos serán aquellos especificados durante el
                proceso de contratación. Cualquier servicio que no aparezca
                expresamente incluido se considerará excluido.
              </p>
            </div>
          </section>

          <section id='cuenta' className='terms-section'>
            <span className='section-number'>04</span>

            <h2>Cuenta de usuario</h2>

            <p>
              Para utilizar determinadas funciones de la plataforma podrá ser
              necesario crear una cuenta.
            </p>

            <p>
              La persona usuaria será responsable de mantener la
              confidencialidad de sus credenciales de acceso y deberá notificar
              cualquier uso no autorizado de su cuenta.
            </p>

            <p>La cuenta deberá utilizarse exclusivamente por su titular.</p>

            <p>
              TARPON FIGHTERS podrá suspender temporalmente una cuenta cuando
              exista evidencia de uso fraudulento, acceso no autorizado,
              incumplimiento de estos Términos o una obligación legal que así lo
              requiera.
            </p>
          </section>

          <section id='reservas' className='terms-section'>
            <span className='section-number'>05</span>

            <h2>Reservas</h2>

            <p>
              La persona usuaria deberá seleccionar la fecha, horario, número de
              participantes y demás opciones disponibles.
            </p>

            <p>Antes de confirmar la reserva se mostrará:</p>

            <ul>
              <li>Servicio seleccionado.</li>
              <li>Fecha.</li>
              <li>Horario.</li>
              <li>Número de participantes.</li>
              <li>Precio.</li>
              <li>Servicios incluidos.</li>
              <li>Servicios adicionales, cuando existan.</li>
              <li>Condiciones de cancelación.</li>
              <li>Método de pago.</li>
            </ul>

            <p>
              La persona usuaria deberá revisar cuidadosamente esta información
              antes de confirmar.
            </p>

            <p>
              Una reserva será considerada confirmada cuando el sistema haya
              registrado correctamente la operación y, cuando corresponda, se
              haya confirmado el pago requerido.
            </p>
          </section>

          <section id='actividad' className='terms-section'>
            <span className='section-number'>06</span>

            <h2>Pesca con mosca y condiciones de la actividad</h2>

            <p>
              La persona usuaria reconoce que la pesca con mosca es una
              actividad realizada en un entorno natural y que puede estar sujeta
              a condiciones variables.
            </p>

            <p>
              Las condiciones climáticas, marítimas, ambientales, de navegación,
              de seguridad y de disponibilidad de especies pueden variar.
            </p>

            <p>
              La prestación del servicio no constituye una garantía de captura
              de una especie determinada ni de una cantidad determinada de
              peces.
            </p>

            <p>
              La experiencia podrá modificarse o suspenderse cuando las
              condiciones existentes puedan representar un riesgo para los
              participantes, guías, embarcaciones, equipo o terceros.
            </p>

            <h3>Seguridad</h3>

            <p>
              La persona usuaria deberá seguir en todo momento las instrucciones
              proporcionadas por los guías, capitanes o personal de TARPON
              FIGHTERS.
            </p>

            <p>
              Cuando la actividad se realice en embarcación, deberán cumplirse
              las instrucciones relacionadas con seguridad y navegación.
            </p>

            <p>
              TARPON FIGHTERS podrá suspender o modificar una actividad cuando
              existan condiciones que razonablemente puedan comprometer la
              seguridad de los participantes.
            </p>

            <h3>Equipo de pesca</h3>

            <p>
              Cuando el servicio incluya equipo de pesca, éste deberá utilizarse
              adecuadamente y siguiendo las instrucciones del personal.
            </p>

            <p>
              La persona usuaria podrá ser responsable por daños ocasionados al
              equipo cuando éstos sean consecuencia de un uso negligente,
              intencional o contrario a las instrucciones proporcionadas.
            </p>
          </section>

          <section id='pagos' className='terms-section'>
            <span className='section-number'>07</span>

            <h2>Pagos</h2>

            <p>
              Los pagos podrán realizarse mediante los métodos disponibles en la
              plataforma, incluyendo <strong>PayPal</strong>.
            </p>

            <p>
              El procesamiento de pagos podrá realizarse directamente mediante
              proveedores externos.
            </p>

            <p>
              TARPON FIGHTERS no solicitará ni almacenará directamente
              información financiera sensible que no resulte necesaria para
              gestionar la reserva.
            </p>

            <p>
              Los pagos estarán sujetos también a los términos y condiciones del
              proveedor de pagos correspondiente.
            </p>

            <h3>Confirmación del pago</h3>

            <p>
              El inicio de un proceso de pago no significa necesariamente que
              éste haya sido completado.
            </p>

            <p>
              Una reserva será considerada pagada cuando el sistema reciba y
              valide la confirmación correspondiente del proveedor de pagos.
            </p>
          </section>

          <section id='cancelaciones' className='terms-section'>
            <span className='section-number'>08</span>

            <h2>Cancelaciones y reembolsos</h2>

            <p>
              Las cancelaciones y reembolsos estarán sujetos a la Política de
              Cancelaciones y Reembolsos de TARPON FIGHTERS.
            </p>

            <p>
              Las condiciones aplicables deberán mostrarse a la persona usuaria
              antes de completar la reserva.
            </p>

            <p>
              Cuando proceda un reembolso, éste se procesará conforme al método
              y condiciones establecidos en dicha política.
            </p>

            <h3>Modificación de reservas</h3>

            <p>
              Cualquier modificación de una reserva estará sujeta a
              disponibilidad y podrá generar diferencias de precio cuando
              corresponda.
            </p>
          </section>

          <section id='fotografias' className='terms-section'>
            <span className='section-number'>09</span>

            <h2>Fotografías y galería</h2>

            <p>
              La sección de galería de <strong>TARPON FIGHTERS</strong> es
              administrada exclusivamente por personal autorizado.
            </p>

            <p>
              Los clientes y personas usuarias no cuentan con la facultad de
              cargar directamente fotografías a la galería mediante la
              plataforma.
            </p>

            <h3>Fotografías de las actividades</h3>

            <p>
              Durante las actividades de pesca con mosca, TARPON FIGHTERS podrá
              obtener fotografías relacionadas con la experiencia, incluyendo:
            </p>

            <ul>
              <li>Paisajes.</li>
              <li>Embarcaciones.</li>
              <li>Equipo de pesca.</li>
              <li>Peces y capturas.</li>
              <li>Guías y personal.</li>
              <li>Participantes de la actividad.</li>
            </ul>

            <p>
              Cuando una fotografía permita identificar claramente a una
              persona, TARPON FIGHTERS deberá considerar los derechos de imagen
              y privacidad que resulten aplicables antes de utilizarla con fines
              distintos a los necesarios para documentar la prestación del
              servicio.
            </p>

            <h3>Uso de fotografías</h3>

            <p>
              Las fotografías podrán utilizarse para documentar y mostrar las
              actividades y experiencias ofrecidas por TARPON FIGHTERS.
            </p>

            <p>Cuando corresponda, podrán aparecer en:</p>

            <ul>
              <li>Galería del sitio web.</li>
              <li>Redes sociales oficiales.</li>
              <li>Materiales promocionales.</li>
              <li>Publicidad.</li>
              <li>Materiales digitales.</li>
              <li>Materiales impresos relacionados con TARPON FIGHTERS.</li>
            </ul>

            <p>
              El uso de la imagen de una persona identificable para fines
              promocionales o publicitarios se realizará únicamente cuando
              exista la autorización correspondiente o cuando exista otra base
              jurídica que permita dicho uso.
            </p>

            <h3>Autorización para uso de imagen</h3>

            <p>
              Cuando TARPON FIGHTERS pretenda utilizar la imagen identificable
              de un cliente con fines promocionales o publicitarios, podrá
              solicitar una autorización específica.
            </p>

            <p>
              La participación en una actividad o la realización de una reserva
              no deberá interpretarse automáticamente como una autorización
              ilimitada para utilizar la imagen de la persona con fines
              publicitarios.
            </p>

            <h3>Fotografías de menores de edad</h3>

            <p>
              Cuando en una fotografía aparezca una persona menor de edad
              identificable, TARPON FIGHTERS deberá contar con la autorización
              correspondiente de su padre, madre, tutor o representante legal
              cuando resulte necesaria para el uso pretendido.
            </p>

            <h3>Almacenamiento</h3>

            <p>
              Las fotografías administradas por TARPON FIGHTERS podrán
              almacenarse mediante servicios tecnológicos utilizados por la
              plataforma, incluyendo servicios de almacenamiento en la nube.
            </p>

            <p>
              El almacenamiento y tratamiento de dichos archivos estará sujeto
              al Aviso de Privacidad de TARPON FIGHTERS.
            </p>

            <h3>Solicitud de retiro</h3>

            <p>
              Cuando una persona considere que una fotografía publicada por
              TARPON FIGHTERS afecta sus derechos de imagen, privacidad u otros
              derechos legalmente protegidos, podrá solicitar su revisión
              mediante:
            </p>

            <div className='terms-contact-box'>
              <span>Correo para solicitudes</span>
              <strong>INFO@FLYFISHINGHOLBOX.COM.MX</strong>
            </div>

            <p>
              La solicitud deberá proporcionar información suficiente para
              identificar la fotografía y explicar el motivo de la solicitud.
            </p>
          </section>

          <section id='usuarios' className='terms-section'>
            <span className='section-number'>10</span>

            <h2>Conducta del usuario</h2>

            <p>La persona usuaria se compromete a:</p>

            <ul>
              <li>Proporcionar información verdadera.</li>
              <li>No utilizar cuentas de terceros.</li>
              <li>No intentar acceder a información de otros usuarios.</li>
              <li>No alterar o manipular reservas.</li>
              <li>No intentar vulnerar la seguridad de la plataforma.</li>
              <li>No utilizar la plataforma para actividades ilícitas.</li>
              <li>
                Respetar las instrucciones de seguridad durante las actividades.
              </li>
            </ul>
          </section>

          <section id='propiedad' className='terms-section'>
            <span className='section-number'>11</span>

            <h2>Propiedad intelectual</h2>

            <p>
              El nombre <strong>TARPON FIGHTERS</strong>, logotipos, diseños,
              fotografías, textos, elementos gráficos, software y demás
              contenidos de la plataforma pertenecen a TARPON FIGHTERS o a sus
              respectivos titulares.
            </p>

            <p>
              Queda prohibida la reproducción, distribución, modificación o
              explotación comercial no autorizada.
            </p>
          </section>

          <section id='plataforma' className='terms-section'>
            <span className='section-number'>12</span>

            <h2>Disponibilidad de la plataforma</h2>

            <p>
              TARPON FIGHTERS realizará esfuerzos razonables para mantener
              disponible la plataforma.
            </p>

            <p>
              Sin embargo, pueden existir interrupciones por mantenimiento,
              problemas técnicos, conectividad, proveedores externos, servicios
              de infraestructura o circunstancias fuera del control razonable de
              TARPON FIGHTERS.
            </p>

            <h3>Servicios tecnológicos de terceros</h3>

            <p>
              La plataforma puede utilizar servicios tecnológicos externos para
              autenticación, almacenamiento, alojamiento, comunicaciones, pagos
              y otros procesos necesarios para su funcionamiento.
            </p>

            <p>
              Entre dichos servicios pueden encontrarse{' '}
              <strong>Firebase</strong> y <strong>PayPal</strong>.
            </p>
          </section>

          <section id='privacidad' className='terms-section'>
            <span className='section-number'>13</span>

            <h2>Protección de datos personales</h2>

            <p>
              Los datos personales serán tratados conforme al{' '}
              <strong>Aviso de Privacidad</strong> de TARPON FIGHTERS.
            </p>

            <p>
              La plataforma podrá utilizar servicios tecnológicos de terceros
              para almacenar y procesar información necesaria para proporcionar
              el servicio.
            </p>

            <div className='terms-link-card'>
              <div>
                <span>También puedes consultar</span>
                <strong>Aviso de Privacidad</strong>
              </div>

              <a href='/aviso-de-privacidad'>Consultar →</a>
            </div>
          </section>

          <section id='comunicaciones' className='terms-section'>
            <span className='section-number'>14</span>

            <h2>Comunicaciones</h2>

            <p>
              TARPON FIGHTERS podrá enviar comunicaciones relacionadas
              directamente con la reserva, incluyendo confirmaciones,
              recordatorios, cambios, cancelaciones, información de pago,
              comprobantes e información necesaria para la actividad.
            </p>

            <p>
              Las comunicaciones promocionales se gestionarán conforme al Aviso
              de Privacidad y las opciones disponibles para el usuario.
            </p>
          </section>

          <section id='modificaciones' className='terms-section'>
            <span className='section-number'>15</span>

            <h2>Modificaciones de los términos</h2>

            <p>
              TARPON FIGHTERS podrá modificar estos Términos y Condiciones
              cuando sea necesario.
            </p>

            <p>
              La versión vigente estará disponible en la plataforma e indicará
              la fecha de actualización.
            </p>

            <p>
              Cuando un cambio requiera una nueva aceptación conforme a la
              legislación aplicable, ésta será solicitada.
            </p>
          </section>

          <section id='legislacion' className='terms-section'>
            <span className='section-number'>16</span>

            <h2>Legislación aplicable</h2>

            <p>
              Estos Términos y Condiciones se regirán por las leyes aplicables
              de los Estados Unidos Mexicanos.
            </p>

            <p>
              En materia de protección al consumidor y protección de datos
              personales serán aplicables las disposiciones legales
              correspondientes.
            </p>
          </section>

          <section id='contacto' className='terms-section terms-final'>
            <span className='section-number'>17</span>

            <h2>Contacto</h2>

            <p>
              Para dudas, aclaraciones o cuestiones relacionadas con una
              reserva, puedes comunicarte con TARPON FIGHTERS mediante:
            </p>

            <div className='provider-card contact-card'>
              <div>
                <span>Correo electrónico</span>
                <strong>INFO@FLYFISHINGHOLBOX.COM.MX</strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong> +52 984 205 4246</strong>
              </div>

              <div>
                <span>Horario de atención</span>
                <strong>24 HORAS</strong>
              </div>
            </div>
          </section>

          <div className='terms-acceptance'>
            <span>Documento legal</span>

            <h3>Aceptación</h3>

            <p>
              Al marcar la casilla correspondiente y completar el proceso de
              reserva, la persona usuaria declara que ha leído y acepta estos
              Términos y Condiciones.
            </p>

            <div className='terms-version'>
              <span>Versión 1.0</span>
              <span>•</span>
              <span>Entrada en vigor: [FECHA]</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Terms;
