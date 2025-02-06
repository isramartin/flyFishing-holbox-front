// src/components/Menu.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/menu.css'

const Menu = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top w-100">
  <div className="container-fluid">  {/* Cambié de `container` a `container-fluid` */}
    <div className="d-flex w-100">  {/* Contenedor flexible para alinear */}
      <Link className="navbar-brand me-3" to="/home">Mi App de Reservaciones</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link active" to="/home">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/pesca">Pesca</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reservaciones">Reservaciones</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/galerias">Galerias</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reseña">Reseñas</Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>


  );
};

export default Menu;
