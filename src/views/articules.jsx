import React, { useState, useEffect } from "react";
import ArticleList from "../components/articleList";
import { getAllPesca } from "../service/Pesca.service";
import ArticleSkeletonCard from "../components/Skeleton/ArticleSkeletonCard";
import articulo1 from '../assets/image/image1.png';
import articulo2 from '../assets/image/image2.png';
import articulo3 from '../assets/image/image3.png';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="container">
        <h2 className="mb-4 text-center">📚 Lista de Artículos</h2>
        <div className="row">
          {[...Array(6)].map((_, index) => (
            <ArticleSkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (articles.length === 0) return <div className="text-center py-8">No hay artículos disponibles</div>;

  return (
    <div className="articles-container">
      <ArticleList articles={articles} />
    </div>
  );
};

export default Articles;
