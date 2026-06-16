import React from 'react';
import '../styles/ArticleList.css';

const ArticleList = ({ articles }) => {
  const sidebar = articles.slice(0, 4);
  const bottom  = articles.slice(4, 7);

  return (
    <div className='article-wrapper'>

      {/* ── Hero ── */}
      <div className='hero-header'>
        <div className='hero-content'>
          <p className='hero-eyebrow'>Conocimiento & Técnica</p>
          <h1>
            <strong>Mundo</strong> <span className='highlight'>Pesca</span>
          </h1>
          <p>
            Artículos que te ayudarán a planear, mejorar y disfrutar cada
            salida de pesca, con información clara, útil y probada por expertos.
          </p>
          <div className='hero-rule' />
        </div>
      </div>

      <div className='articles-section'>

        {/* ── Fila principal: featured fijo + sidebar dinámico ── */}
        <div className='mag-grid'>

          {/* Artículo destacado — contenido fijo */}
         <div className='feature-card'>
  <div className='article-image feature-img'>
    <span className='article-category'>¿Qué es el Fly Fishing?</span>
    <img
      src='\src\assets\image\image1.png'
      alt='Fly Fishing en Holbox'
    />
    <div className='feature-img-text'>
      <h2 className='feature-title'>
        Fly Fishing: el arte de pescar con mosca artificial
      </h2>
      <p className='feature-meta'>
        Guía introductoria · Por Equipo Tarpon Fighters
      </p>
    </div>
  </div>
  <div className='article-content'>
    <p className='article-description'>
      El fly fishing es una técnica de pesca deportiva que utiliza una caña
      flexible, un carrete especializado y una línea pesada para lanzar moscas
      artificiales — señuelos hechos de plumas, hilo y materiales naturales que
      imitan insectos o pequeños peces. A diferencia de la pesca convencional,
      el peso lo da la línea, no el señuelo. Es considerada una de las formas
      más elegantes y técnicas de pescar, muy popular en ríos, lagos y aguas
      costeras tropicales como las de Holbox.
    </p>
    <p     
      className='read-more'
    >
      En este apartado encontras todos los articulos que se usan a menudo.
    </p>
  </div>
</div>

          {/* Sidebar: artículos dinámicos del array */}
          <div className='small-stack'>
            {sidebar.map((article) => (
              <div className='small-card' key={article.id}>
                <div className='small-img'>
                  <img src={article.image} alt={article.title} />
                </div>
                <div className='small-body'>
                  {article.category && (
                    <span className='small-badge'>{article.category}</span>
                  )}
                  <p className='small-title'>{article.title}</p>
                  <p className='small-desc'>{article.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── Fila inferior: 3 cards medianas ── */}
        {bottom.length > 0 && (
          <div className='bottom-row'>
            {bottom.map((article) => (
              <div className='bottom-card' key={article.id}>
                <div className='article-image bottom-img'>
                  {article.category && (
                    <span className='article-category'>{article.category}</span>
                  )}
                  <img src={article.image} alt={article.title} />
                </div>
                <div className='bottom-body'>
                  <p className='bottom-title'>{article.title}</p>
                  <p className='bottom-desc'>{article.description}</p>
                  {article.link && (
                    <a href={article.link} className='read-more'>
                      Leer artículo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ArticleList;