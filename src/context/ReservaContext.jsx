import React, { createContext, useContext, useState } from 'react';

const ReservaContext = createContext();

export const ReservaProvider = ({ children }) => {
  const [data, setData] = useState({
    date: '',
    time: '09:00',
    guests: '1',
    name: '',
    email: '',
    phone: '',
    alquilarEquipo: false,
  });

  return (
    <ReservaContext.Provider value={{ data, setData }}>
      {children}
    </ReservaContext.Provider>
  );
};

export const useReserva = () => useContext(ReservaContext);
