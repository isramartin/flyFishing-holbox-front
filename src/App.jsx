
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/menu';  // Importamos el menú
import Home from './views/home'; // Ya tienes este componente de Home
import Reservaciones from './views/reservaciones';
import Review from './views/reviewBox';
import Gallery from './views/galeria';
import Articles from './views/articules';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min"; 


function App() {

  return (
    <Router>
      <div className="App">
        <Menu />  {/* Agregamos el menú global */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pesca" element={<Articles/>} />
          <Route path="/reservaciones" element={<Reservaciones />} />
          <Route path="/galerias" element={<Gallery/>} />
          <Route path="/reseña" element={<Review/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
