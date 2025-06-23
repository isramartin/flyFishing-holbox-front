import React, { useState, useRef, useEffect } from 'react';
import {
  getAllGaleria,
  updateFavorito,
  descargarImagen,
} from '../service/galeria.service';
import { X, ArrowDownToLine, Heart, HeartOff, Link } from 'lucide-react';
import { useAlert } from './AlertManager';
import { useGallery } from '../context/GalleryContext'; 

const PhotoGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const isScrolling = useRef(false);
  const { addAlert } = useAlert();
  const [skeletonHeights, setSkeletonHeights] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setSkeletonHeights(
          Array.from(
            { length: 12 },
            () => Math.floor(Math.random() * 150) + 200 // alturas entre 200 y 350px
          )
        );
        const data = await getAllGaleria();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleToggleFavorito = async (photoId, currentFavorito) => {
    try {
      // Actualizar el favorito en backend
      await updateFavorito(photoId, !currentFavorito);
      // Actualizar estado local para refrescar la UI
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === photoId
            ? { ...photo, favorito: !currentFavorito }
            : photo
        )
      );
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      // Puedes agregar alertas o notificaciones aquí si quieres
    }
  };

  const handleDescarga = async (id) => {
    try {
      await descargarImagen(id);
      addAlert('Descarga completada con éxito', 'success'); // o cualquier otra forma que uses para mostrar mensajes
    } catch (error) {
      addAlert('Error al descargar imagen: ' + error.message);
    }
  };

  const handleImageClick = (index, e) => {
    e.stopPropagation();
    setActiveIndex(index);
    setShowModal(true);
  };

  const centerThumbnail = (index) => {
    if (!containerRef.current || isScrolling.current || photos.length === 0)
      return;

    isScrolling.current = true;
    const container = containerRef.current;
    const thumb = container.children[index];

    if (!thumb) return;

    const containerWidth = container.offsetWidth;
    const thumbWidth = thumb.offsetWidth;
    const thumbOffset = thumb.offsetLeft;
    const scrollTo = thumbOffset - containerWidth / 2 + thumbWidth / 2;

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  useEffect(() => {
    centerThumbnail(activeIndex);
  }, [activeIndex, photos]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="gallery-masonry">
          {Array.from({ length: 8 }).map((_, i) => {
            // Generamos alturas aleatorias para simular el layout masonry
            const randomHeight = Math.floor(Math.random() * 200) + 200; // Entre 200px y 400px

            return (
              <div className="gallery-item skeleton-item" key={i}>
                <div
                  className="skeleton-image"
                  style={{ height: `${randomHeight}px` }}
                />
                <div className="skeleton-overlay">
                  <div className="skeleton-actions">
                    <div className="skeleton-button" />
                    <div className="skeleton-button" />
                    <div className="skeleton-button" />
                  </div>
                  <div className="skeleton-info">
                    <div className="skeleton-title" />
                    <div className="skeleton-description" />
                    <div className="skeleton-location" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return <div className="empty">No hay fotos disponibles</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-masonry">
        {photos.map((photo, index) => (
          <div
            className="gallery-item"
            key={photo.id}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={(e) => handleImageClick(index, e)}
          >
            <img
              src={photo.imageUrl}
              alt={photo.titulo || `Foto ${index + 1}`}
              className="gallery-image"
            />
            {hoverIndex === index && (
              <div className="gallery-overlay">
                <div className="gallery-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorito(photo.id, photo.favorito);
                    }}
                  >
                    {photo.favorito ? <HeartOff /> : <Heart />}
                  </button>

                  {/* <button>
                    <Link />
                  </button> */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDescarga(photo.id);
                    }}
                  >
                    <ArrowDownToLine />
                  </button>
                </div>
                <div className="gallery-info">
                  <h3>{photo.titulo || 'Sin título'}</h3>
                  <p>{photo.descripcion || 'Sin descripción'}</p>
                  <span className="gallery-location">
                    {photo.lugarCreacion || 'Holbox, Q. Roo, MX'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && photos.length > 0 && (
        <div className="gallery-modal-overlay">
          <div className="modal-content">
            <X className="close-button-close" onClick={handleCloseModal} />
            <ArrowDownToLine
              className="close-button-dowload"
              onClick={(e) => {
                e.stopPropagation();
                handleDescarga(photos[activeIndex].id);
              }}
            />
            {photos[activeIndex].favorito ? (
              <HeartOff
                className="close-button-favorite"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorito(photos[activeIndex].id, true);
                }}
              />
            ) : (
              <Heart
                className="close-button-favorite"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorito(photos[activeIndex].id, false);
                }}
              />
            )}

            {/* <Link className="close-button-link" /> */}

            <button onClick={handlePrev} className="arrow-left">
              &#10094;
            </button>
            <img
              src={photos[activeIndex].imageUrl}
              alt={photos[activeIndex].titulo || 'Imagen ampliada'}
              className="modal-image"
            />
            <button onClick={handleNext} className="arrow-right">
              &#10095;
            </button>

            <div className="thumbnails-wrapper">
              <div className="thumbnail-container" ref={containerRef}>
                {photos.map((photo, index) => (
                  <img
                    key={photo.id}
                    src={photo.imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`thumbnail ${
                      index === activeIndex ? 'active' : 'inactive'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
