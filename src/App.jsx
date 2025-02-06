
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/menu';  // Importamos el menú
import Home from './views/home'; // Ya tienes este componente de Home
import Reservaciones from './views/reservaciones';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <Router>
      <div className="App">
        <Menu />  {/* Agregamos el menú global */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/reservaciones" element={<Reservaciones />} />
          <Route path="/contacto" element={<div>Contacto</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
