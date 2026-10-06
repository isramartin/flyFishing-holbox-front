import React, { useState, useCallback } from "react";
import Alert from "./Alert";

export const AlertContext = React.createContext();

const DURATION = 4000;

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, leaving: true } : a))
    );
    // esperar la animación de salida antes de eliminar del DOM
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 400);
  }, []);

  const addAlert = useCallback(
    (message, type = "info") => {
      const id = Date.now();
      setAlerts((prev) => [...prev, { id, message, type, leaving: false }]);
      setTimeout(() => removeAlert(id), DURATION);
    },
    [removeAlert]
  );

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      <div className="alert-global-container" aria-live="polite">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={alert.leaving ? "alert-wrapper leaving" : "alert-wrapper"}
          >
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => removeAlert(alert.id)}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
};