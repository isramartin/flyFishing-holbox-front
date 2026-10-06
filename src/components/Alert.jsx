import React, { useEffect, useRef } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import "../styles/Alert.css";

const DURATION = 4000;

const alertConfig = {
  success: {
    icon: <CheckCircle size={17} />,
    title: "Éxito",
  },
  error: {
    icon: <AlertCircle size={17} />,
    title: "Error",
  },
  warning: {
    icon: <AlertTriangle size={17} />,
    title: "Advertencia",
  },
  info: {
    icon: <Info size={17} />,
    title: "Información",
  },
};

const Alert = ({ message, type = "info", onClose }) => {
  const barRef  = useRef(null);
  const rafRef  = useRef(null);
  const startRef = useRef(null);

  const { icon, title } = alertConfig[type] || alertConfig.info;

  // barra de progreso con requestAnimationFrame
  useEffect(() => {
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / DURATION, 1);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${1 - progress})`;
      }
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className={`ac ac-${type}`} role="alert">
      <div className="ac-ico">{icon}</div>
      <div className="ac-text">
        <p className="ac-title">{title}</p>
        <p className="ac-desc">{message}</p>
      </div>
      {onClose && (
        <button className="ac-x" onClick={onClose} aria-label="Cerrar">
          <X size={14} />
        </button>
      )}
      <div className="ac-bar" ref={barRef} />
    </div>
  );
};

export default Alert;