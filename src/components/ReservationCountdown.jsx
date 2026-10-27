import { useEffect, useRef, useState } from 'react';
import '../styles/ReservationCountdown.css';

function obtenerVencimiento(expiresAt) {
  // Primero usamos la fecha recibida por props.
  const recibido = Number(expiresAt);

  if (Number.isFinite(recibido) && recibido > 0) {
    return recibido;
  }

  // Respaldo: recuperar la fecha directamente de la sesión guardada.
  const token = sessionStorage.getItem('reservationToken');
  const guardado = Number(sessionStorage.getItem('reservationExpiresAt'));

  if (token && Number.isFinite(guardado) && guardado > 0) {
    return guardado;
  }

  return null;
}

function calcularSegundos(vencimiento) {
  if (!vencimiento) return null;

  return Math.max(0, Math.ceil((vencimiento - Date.now()) / 1000));
}

export default function ReservationCountdown({
  expiresAt,
  onExpire,
  idle = false,
  label = 'Tiempo restante para completar tu reserva',
}) {
  // Recupera el tiempo desde el primer render, si ya existe una sesión.
  const [secondsLeft, setSecondsLeft] = useState(() =>
    calcularSegundos(obtenerVencimiento(expiresAt))
  );

  const [ready, setReady] = useState(false);

  const onExpireRef = useRef(onExpire);
  const expiredAtRef = useRef(null);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    let vencimiento = obtenerVencimiento(expiresAt);

    // No existe ninguna sesión guardada.
    if (!vencimiento) {
      setSecondsLeft(null);
      setReady(true);
      expiredAtRef.current = null;
      return;
    }

    setReady(false);

    const actualizar = () => {
      // Si el componente se remonta, vuelve a consultar el vencimiento.
      const vencimientoActual = obtenerVencimiento(expiresAt);
      vencimiento = vencimientoActual;

      if (!vencimientoActual) {
        setSecondsLeft(null);
        setReady(true);
        return;
      }

      const restante = calcularSegundos(vencimientoActual);

      setSecondsLeft(restante);
      setReady(true);

      if (restante === 0 && expiredAtRef.current !== vencimientoActual) {
        expiredAtRef.current = vencimientoActual;
        onExpireRef.current?.();
      }
    };

    actualizar();

    const intervalId = setInterval(actualizar, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const tieneSesion = secondsLeft !== null;
  const tiempo = secondsLeft ?? 0;

  const minutes = String(Math.floor(tiempo / 60)).padStart(2, '0');
  const seconds = String(tiempo % 60).padStart(2, '0');

  const isExpired = ready && tieneSesion && tiempo === 0;
  const isUrgent = ready && tieneSesion && tiempo > 0 && tiempo <= 60;

  // "idle" no debe ocultar una sesión que todavía está guardada.
  const mostrarIdle = idle && !tieneSesion && ready;
  const mostrandoEspera = !ready && !tieneSesion;

  return (
    <div
      className={`reservation-countdown ${
        mostrarIdle
          ? 'reservation-countdown--idle'
          : isExpired
            ? 'reservation-countdown--expired'
            : isUrgent
              ? 'reservation-countdown--urgent'
              : ''
      }`}
      role='status'
      aria-live='polite'
    >
      <div className='reservation-countdown__main'>
        <div className='reservation-countdown__icon' aria-hidden='true'>
          {isExpired ? '!' : '◷'}
        </div>

        <div className='reservation-countdown__content'>
          <span className='reservation-countdown__label'>
            {mostrarIdle
              ? 'TIEMPO DE RESERVA'
              : isExpired
                ? 'SESIÓN VENCIDA'
                : 'TIEMPO PARA RESERVAR'}
          </span>

          <strong className='reservation-countdown__time'>
            {mostrarIdle
              ? '--:--'
              : mostrandoEspera
                ? 'Cargando...'
                : `${minutes}:${seconds}`}
          </strong>
        </div>
      </div>

      <div className='reservation-countdown__progress'>
        <div
          className='reservation-countdown__progress-fill'
          style={{
            width:
              !tieneSesion || mostrarIdle
                ? '0%'
                : `${Math.min(100, Math.max(0, (tiempo / 600) * 100))}%`,
          }}
        />
      </div>

      <span className='reservation-countdown__message'>
        {mostrarIdle
          ? 'El contador comenzará cuando inicies tu reserva.'
          : mostrandoEspera
            ? 'Recuperando tiempo de reserva...'
            : isExpired
              ? 'Inicia una nueva sesión para continuar.'
              : isUrgent
                ? '¡Queda poco tiempo para completar tu reserva!'
                : label}
      </span>
    </div>
  );
}
