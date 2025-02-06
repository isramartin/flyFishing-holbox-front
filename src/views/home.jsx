import React, { useState, useEffect } from 'react';
import Portada from '../components/portada';
import InfoPeces from '../components/infoPeces';
import '../styles/globalContainer.css'




const Home = () => {
 

  return (

    <div className="home-container">
        <div><Portada /></div>
    


    <div><InfoPeces /></div>
        
    

    </div>

    

   
  );
};

export default Home;
