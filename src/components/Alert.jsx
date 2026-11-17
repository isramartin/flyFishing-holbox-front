import React, { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

import '../styles/Alert.css';

const DURATION = 4000;

const alertConfig = {
  success: {
    icon: <CheckCircle size={17} />,
    title: 'Éxito',
  },
  error: {
    icon: <AlertCircle size={17} />,
    title: 'Error',
  },
  warning: {
    icon: <AlertTriangle size={17} />,
    title: 'Advertencia',
  },
  info: {
    icon: <Info size={17} />,
    title: 'Información',
  },
};

const Alert = ({
  message,
  type = 'info',
  onClose,
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Rechazar',
}) => {
  const barRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const { icon, title } = alertConfig[type] || alertConfig.info;

  // Si existe onConfirm, se trata de una confirmación.
  const isConfirmation = typeof onConfirm === 'function';

  useEffect(() => {
    // Las confirmaciones no deben cerrarse automáticamente.
    if (isConfirmation) return;

    const step = (ts) => {
      if (startRef.current === null) {
        startRef.current = ts;
      }

      const progress = Math.min((ts - startRef.current) / DURATION, 1);

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${1 - progress})`;
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        onClose?.();
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isConfirmation, onClose]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose?.();
    }
  };

  return (
   <div
    className={
      isConfirmation
        ? "ac-confirmation-overlay"
        : undefined
    }
  >
    <div
      className={`ac ac-${type} ${
        isConfirmation ? "ac-confirmation" : ""
      }`}
      role={isConfirmation ? "alertdialog" : "alert"}
      aria-modal={isConfirmation ? "true" : undefined}
    >


      <div className='ac-ico'>{icon}</div>

      <div className='ac-text'>
        <p className='ac-title'>{title}</p>
        <p className='ac-desc'>{message}</p>
      </div>

      {isConfirmation ? (
        <div className='ac-actions'>
          <button
            type='button'
            className='ac-btn ac-btn-cancel'
            onClick={handleCancel}
          >
            {cancelText}
          </button>

          <button
            type='button'
            className='ac-btn ac-btn-confirm'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      ) : (
        <>
          {onClose && (
            <button
              type='button'
              className='ac-x'
              onClick={onClose}
              aria-label='Cerrar'
            >
              <X size={14} />
            </button>
          )}

          <div className='ac-bar' ref={barRef} />
        </>
      )}
    </div>
    </div>
  );
};

export default Alert;
