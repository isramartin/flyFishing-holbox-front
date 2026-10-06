import React from 'react';
import '../styles/ArticleList.css';
import PageHeader from './PageHeader';
import imagen1 from '../assets/image/image1.png';

const ArticleList = ({ articles }) => {
  return (
    <div className='article-wrapper'>

      <PageHeader
        image={imagen1}
        eyebrow='Conocimiento & Técnica'
        title='Mundo Pesca'
        subtitle='Artículos que te ayudarán a planear, mejorar y disfrutar cada salida de pesca, con información clara, útil y probada por expertos.'
      />

      <section className='articles-section'>

        {/* ── INTRO informativa — sin imagen ── */}
        <div className='article-intro-block'>
          <div className='article-intro-left'>
            <span className='article-intro-eye'>¿Qué es el Fly Fishing?</span>
            <h2 className='article-intro-title'>
              El arte de pescar<br />con mosca artificial
            </h2>
            <div className='article-intro-rule' />
          </div>
          <div className='article-intro-right'>
            <p className='article-intro-text'>
              El fly fishing es una técnica de pesca deportiva que utiliza una
              caña flexible, un carrete especializado y una línea pesada para
              lanzar moscas artificiales — señuelos hechos de plumas, hilo y
              materiales naturales que imitan insectos o pequeños peces.
              A diferencia de la pesca convencional, el peso lo da la línea,
              no el señuelo. Es considerada una de las formas más elegantes
              y técnicas de pescar.
            </p>
            <p className='article-intro-text'>
              En este apartado encontrarás todos los artículos y elementos
              que se usan con mayor frecuencia en el fly fishing. Conocer
              el equipo es tan importante como la técnica — cada pieza
              tiene un propósito específico que puede marcar la diferencia
              en tu experiencia sobre el agua.
            </p>
            <span className='article-intro-note'>
              EN ESTE APARTADO ENCONTRAS TODOS LOS ARTÍCULOS QUE SE USAN A MENUDO.
            </span>
          </div>
        </div>

        {/* ── TODOS LOS ARTÍCULOS ── */}
        {articles.length > 0 && (
          <div className='articles-more'>

            <div className='articles-more-heading'>
              <div>
                <span className='articles-eyebrow'>Equipo & Referencias</span>
                <h2>Artículos de Fly Fishing</h2>
              </div>
              <span className='articles-more-count'>
                {articles.length} ARTÍCULOS
              </span>
            </div>

            <div className='articles-cards'>
              {articles.map((article, index) => (
                <article className='article-card' key={article.id}>

                  <div className='article-card-image'>
                    <img src={article.image} alt={article.title} />
                    <div className='article-card-scrim' />
                    <div className='article-card-image-top'>
                      <span className='article-card-num'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className='article-card-cat'>
                        Tarpon Fighters
                      </span>
                    </div>
                  </div>

                  <div className='article-card-body'>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div className='article-card-footer'>
                      <span className='article-card-author'>
                        Tarpon Fighters
                      </span>
                      {article.link && (
                        <a href={article.link} className='article-link'>
                          Leer <span>→</span>
                        </a>
                      )}
                    </div>
                  </div>

                </article>
              ))}
            </div>

          </div>
        )}

      </section>
    </div>
  );
};

export default ArticleList;