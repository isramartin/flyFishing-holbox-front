import React from "react";
import ArticleList from "../components/articleList"
import articulo1 from '../assets/image/image1.png';
import articulo2 from '../assets/image/image2.png';
import articulo3 from '../assets/image/image3.png';

const articles = [
    {
      id: 1,
      title: "🔹 Caña de Pesca",
      description: "Específica para lanzar líneas ligeras con precisión. Su flexibilidad y tamaño varían según el tipo de pesca y pez objetivo.",
      image: articulo1,
    },
    {
      id: 2,
      title: "🔹  Chaleco de Pesca",
      description: "Diseñado con múltiples bolsillos para llevar moscas, herramientas y accesorios sin necesidad de cargar una mochila.",
      image: articulo2,
    },
    {
      id: 3,
      title: "🔹 Gafas de Sol Polarizadas",
      description: "Reducen reflejos en el agua, permitiéndote ver mejor a los peces y protegiendo tus ojos del sol y anzuelos.",
      image: articulo3,
    },
  ];


 const Articles =()=>{
    return (
        <div>
          <ArticleList articles={articles} />
        </div>
      );


 };

 export default Articles;