import React, { createContext, useContext, useState, useEffect } from 'react';

// Clave en el localStorage
const LOCAL_STORAGE_KEY = 'reservaDatos';

const ReservaContext = createContext();

export const ReservaProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    // Al cargar el componente, intenta leer desde localStorage
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData
      ? JSON.parse(savedData)
      : {
          date: '',
          time: '09:00',
          guests: '1',
          name: '',
          email: '',
          phone: '',
          alquilarEquipo: false,
        };
  });

  // Cada vez que cambie 'data', actualiza localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Función para borrar los datos guardados en localStorage
  const clearReserva = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData({
      date: '',
      time: '09:00',
      guests: '1',
      name: '',
      email: '',
      phone: '',
      alquilarEquipo: false,
    });
  };

  return (
    <ReservaContext.Provider value={{ data, setData, clearReserva }}>
      {children}
    </ReservaContext.Provider>
  );
};

export const useReserva = () => useContext(ReservaContext);
