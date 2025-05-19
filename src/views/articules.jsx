import React, { useState, useEffect } from "react";
import ArticleList from "../components/articleList";
import { getAllPesca } from "../service/Pesca.service";
// Importa tus imágenes locales
import articulo1 from '../assets/image/image1.png';
import articulo2 from '../assets/image/image2.png';
import articulo3 from '../assets/image/image3.png';


const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Objeto para mapear tipos de artículo a imágenes locales
  const localImages = {
    'caña': articulo1,
    'chaleco': articulo2,
    'gafas': articulo3
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllPesca();
        
        const formattedArticles = data.map(item => ({
          id: item.id,
          title: item.titulo || `🔹 ${item.tipo}`,
          description: item.descripcion || "Descripción no disponible",
          // Usa imagen de la API si existe, sino usa una local según el tipo
          image: item.imageUrl || localImages[item.tipo?.toLowerCase()] 
        }));
        
        setArticles(formattedArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando artículos...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (articles.length === 0) return <div className="text-center py-8">No hay artículos disponibles</div>;

  return (
    <div className="articles-container">
      <ArticleList articles={articles} />
    </div>
  );
};

export default Articles;