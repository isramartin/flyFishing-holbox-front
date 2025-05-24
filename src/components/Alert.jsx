import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import "../styles/Alert.css"; // Crearemos este archivo después

const Alert = ({ message, type, onClose }) => {
  const alertConfig = {
    success: {
      icon: <CheckCircle size={20} />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    },
    error: {
      icon: <AlertCircle size={20} />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200",
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: <Info size={20} />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
    },
  };

  const { icon, bgColor, textColor, borderColor } = alertConfig[type] || alertConfig.info;

  return (
    <div
      className={`alert-container ${bgColor} ${textColor} ${borderColor}`}
      role="alert"
    >
      <div className="alert-content">
        <div className="alert-icon">{icon}</div>
        <p className="alert-message">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="alert-close-button"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;