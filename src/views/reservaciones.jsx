import React, { useState, useEffect } from 'react';
import Reservaciones from '../components/reservaciones';
import '../styles/globalContainer.css'


const Reserva = () => {
    const handleReservation = (name, date) => {
        console.log(`Reserva confirmada por ${name} para el día ${date}`);
      };
    
    return (
        <div >
<Reservaciones onReserve={handleReservation} />

        </div>

    );
};

export default Reserva;