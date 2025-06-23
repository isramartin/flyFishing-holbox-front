import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllGaleria } from '../service/galeria.service';

const GalleryContext = createContext();

export const useGallery = () => useContext(GalleryContext);

export const GalleryProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const data = await getAllGaleria();
      setPhotos(data);
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <GalleryContext.Provider value={{ photos, setPhotos, loading, fetchPhotos }}>
      {children}
    </GalleryContext.Provider>
  );
};
