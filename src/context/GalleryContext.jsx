
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from 'react';

import { getAllGaleria } from '../service/galeria.service';

const GalleryContext = createContext(null);

export const useGallery = () => {
    const context = useContext(GalleryContext);

    if (!context) {
        throw new Error(
            'useGallery debe utilizarse dentro de GalleryProvider'
        );
    }

    return context;
};

export const GalleryProvider = ({ children }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);

    // Cargar galerías
    const fetchPhotos = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getAllGaleria();

            console.log('Galerías recibidas:', data);

            setPhotos(Array.isArray(data) ? data : []);
            setLoaded(true);

        } catch (error) {
            console.error('Error al obtener galerías:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Actualizar galerías después de registrar, editar o eliminar
    const refreshPhotos = async () => {
        await fetchPhotos();
    };

    // Carga inicial
    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    return (
        <GalleryContext.Provider
            value={{
                photos,
                setPhotos,
                loading,
                fetchPhotos,
                refreshPhotos,
                loaded
            }}
        >
            {children}
        </GalleryContext.Provider>
    );
};
