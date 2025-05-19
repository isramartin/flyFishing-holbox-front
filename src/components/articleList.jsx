import React from "react";
import "../styles/ArticleList.css"; // Importamos el CSS

const ArticleList = ({ articles }) => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📚 Lista de Artículos</h2>
      <div className="row">
        {articles.map((article) => (
          <div key={article.id} className="col-md-6 col-lg-4 mb-4">
            <div className="article-card">
              <div className="article-inner">
                {/* Lado Frontal */}
                <div className="article-front">
                  <div className="image-container">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <h5>{article.title}</h5>
                </div>
                {/* Lado Trasero */}
                <div className="article-back">
                  <p className="text-muted">{article.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
