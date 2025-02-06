import React from 'react';
import '../styles/infoPeces.css'; // Asegúrate de crear este archivo para los estilos
import pezPayaso from '../assets/image/image1.png';
import pezBetta from '../assets/image/image2.png';
import pezDorado from '../assets/image/image3.png';

const peces = [
  {
    nombre: 'Pez Payaso',
    imagen: pezPayaso,
    descripcion: 'Es un pez pequeño y colorido, famoso por su relación con las anémonas marinas.',
  },
  {
    nombre: 'Pez Betta',
    imagen: pezBetta,
    descripcion: 'Conocido por sus colores vibrantes y su comportamiento territorial.',
  },
  {
    nombre: 'Pez Dorado',
    imagen: pezDorado,
    descripcion: 'Un pez de agua dulce muy popular en acuarios domésticos.',
  },
  {
    nombre: 'Pez Payaso',
    imagen: pezPayaso,
    descripcion: 'Es un pez pequeño y colorido, famoso por su relación con las anémonas marinas.',
  },
  {
    nombre: 'Pez Betta',
    imagen: pezBetta,
    descripcion: 'Conocido por sus colores vibrantes y su comportamiento territorial.',
  },
  
];

const InfoPeces = () => {
  return (
    <div className="info-peces-container">
      <h2 className="info-title">Información sobre Peces</h2>
      <div className="peces-list">
        {peces.map((pez, index) => (
          <div key={index} className="pez-card">
            <img src={pez.imagen} alt={pez.nombre} className="pez-image" />
            <h3 className="pez-name">{pez.nombre}</h3>
            <p className="pez-description">{pez.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoPeces;
