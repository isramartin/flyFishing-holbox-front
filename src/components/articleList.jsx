import React from 'react';
import '../styles/ArticleList.css';

const ArticleList = ({ articles }) => {
  return (
    <div className='article-wrapper'>
      {/* Encabezado Hero */}
      <div className='hero-header'>
        <div className='hero-content'>
          <h1>
            🎣 <strong>Mundo</strong> <span className='highlight'>Pesca</span>
          </h1>
          <p>
            Artículos que te ayudarán a planear, mejorar y disfrutar cada salida
            de pesca, con información clara, útil y probada por expertos.
          </p>
        </div>
      </div>

      {/* Artículos */}
      <div className='container mt-5'>
        <div className='row'>
          {articles.map((article) => (
            <div key={article.id} className='col-sm-12 col-md-6 col-lg-4 mb-4'>
              <div className='article-card'>
                <div className='article-image'>
                  <img src={article.image} alt={article.title} />
                </div>
                <div className='article-content'>
                  <h5 className='article-title'>{article.title}</h5>
                  <p className='article-description'>{article.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
