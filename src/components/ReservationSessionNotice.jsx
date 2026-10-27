import { Clock } from 'lucide-react';
import '../styles/ReservationSessionNotice.css';

export default function ReservationSessionNotice({
  type = 'info',
  message,
  visible = false,

  // Control independiente del panel que oculta el formulario
  showStartPanel = false,
  onStart,
  starting = false,
  sessionError = '',
}) {
  // Si ninguno de los dos debe mostrarse, no renderizamos nada.
  if (!visible && !showStartPanel) return null;

  return (
    <>
      {/* Aviso independiente */}
      {visible && message && (
        <div
          className={`reservation-session-notice reservation-session-notice--${type}`}
          role="status"
          aria-live="polite"
        >
          <span className="reservation-session-notice__icon">
            {type === 'error' ? '!' : 'i'}
          </span>

          <span>{message}</span>
        </div>
      )}

      {/* Panel que reemplaza el formulario */}
      {showStartPanel && (
        <div className="reservation-start-panel">
          <div className="reservation-start-panel-icon">
            <Clock size={28} />
          </div>

          <span className="reservation-start-label">
            ANTES DE COMENZAR
          </span>

          <h2>Dispones de 10 minutos para reservar</h2>

          <p>
            Cuando pulses «Iniciar reserva», comenzará el contador.
            Completa tus datos y confirma tu reservación dentro de ese
            tiempo.
          </p>

          {sessionError && (
            <p className="reservation-start-error">{sessionError}</p>
          )}

          <button
            type="button"
            className="reservation-start-button"
            onClick={onStart}
            disabled={starting}
          >
            {starting ? 'Iniciando...' : 'Iniciar reserva'}
          </button>
        </div>
      )}
    </>
  );
}