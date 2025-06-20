import React, { useState, useEffect, useContext } from 'react';
import '../../styles/admin/uploadImageGallery.css';
import { Image, Upload, X, Trash2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { uploadGalleryImage } from '../../service/galeria.service';
import { getAllGaleria } from '../../service/galeria.service';

const ImageUploadPanel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [lugarCreacion, setLugarCreacion] = useState('');

  const authContext = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const { isAuthenticated, token } = useContext(AuthContext);
  const [localToken, setLocalToken] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        // setSkeletonHeights(
        //   Array.from(
        //     { length: 12 },
        //     () => Math.floor(Math.random() * 150) + 200 // alturas entre 200 y 350px
        //   )
        // );
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

  console.log('📸 Fotos cargadas:', photos);

  useEffect(() => {
    console.log('Estado de autenticación imagen PANEL ADMIN:', isAuthenticated);
    console.log(
      'Token disponible:',
      token ? '***' + token.slice(-4) : 'No hay token'
    );

    if (!isAuthenticated || !token) {
      console.error('Usuario no autenticado o token faltante');
      // Redirigir al login o mostrar error
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('authToken');
    setLocalToken(tokenFromStorage || '');
  }, []);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    setGalleryImages(savedImages);
  }, []);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || !titulo || !descripcion || !lugarCreacion) {
      alert('Completa todos los campos');
      return;
    }

    const tokenSources = [
      localStorage.getItem('authToken'),
      authContext?.token,
      JSON.parse(localStorage.getItem('auth'))?.token,
    ].filter(Boolean);

    const token = tokenSources[0];
    console.log(
      '🔑 Token seleccionado:',
      token ? `***${token.slice(-4)}` : 'NO TOKEN'
    );

    if (!token) {
      console.error('No se encontró token. Inicia sesión nuevamente.');
      return;
    }

    setUploading(true);

    try {
      await uploadGalleryImage(
        {
          file: selectedFile,
          titulo,
          descripcion,
          lugarCreacion,
          favorito: false,
        },
        token
      );

      const imageUrl = URL.createObjectURL(selectedFile);
      setGalleryImages((prev) => [
        ...prev,
        { url: imageUrl, name: selectedFile.name },
      ]);

      // Limpieza
      setSelectedFile(null);
      setPreviewImage(null);
      setTitulo('');
      setDescripcion('');
      setLugarCreacion('');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleRemoveImage = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  return (
    <div className='image-upload-gallery-container'>
      <h4>Subir Nueva Imagen</h4>
      <div className='image-upload-gallery'>
        <div
          className={`drag-drop-area ${previewImage ? 'has-preview' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => {
            if (!previewImage) {
              document.getElementById('file-input').click();
            }
          }}
        >
          {previewImage ? (
            <>
              <img
                src={previewImage}
                alt='Previsualización'
                className='preview-image'
              />
              <button
                className='remove-button-admin'
                onClick={handleCancelUpload}
              >
                <X size={30} />
              </button>
              <p>
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>

              <div className='upload-fields'>
                <input
                  type='text'
                  placeholder='Título'
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
                <textarea
                  placeholder='Descripción'
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                <input
                  type='text'
                  placeholder='Lugar de creación'
                  value={lugarCreacion}
                  onChange={(e) => setLugarCreacion(e.target.value)}
                />
              </div>

              <button
                className='upload-button'
                onClick={handleConfirmUpload}
                disabled={
                  !selectedFile ||
                  !titulo ||
                  !descripcion ||
                  !lugarCreacion ||
                  uploading
                }
              >
                <Upload /> {uploading ? 'Subiendo...' : 'Subir Imagen'}
              </button>
            </>
          ) : (
            <>
              <Image />
              <p>Arrastra y suelta tu imagen aquí</p>
              <span>o</span>
              <button className='select-image-button'>
                Seleccionar Imagen
              </button>
            </>
          )}
          <input
            id='file-input'
            type='file'
            onChange={handleFileChange}
            accept='image/*'
            className='file-input'
          />
        </div>
      </div>

      <div className='gallery-container-preview'>
        {loading ? (
          <p className='text-muted'>Cargando imágenes...</p>
        ) : photos.length === 0 ? (
          <p className='text-muted'>No hay imágenes en la galería.</p>
        ) : (
          <div className='gallery-masonry'>
            {photos.map((photo, index) => (
              <div className='image-card' key={photo.id || index}>
                <div className='image-container position-relative'>
                  <img
                    src={photo.imageUrl}
                    alt={photo.titulo || `Imagen ${index + 1}`}
                    className='img-fluid w-100'
                  />
                  <button
                    className='remove-button-admin position-absolute'
                    onClick={() => handleRemovePhoto(photo.id)}
                  >
                    <Trash2 />
                  </button>
                </div>

                <div className='image-overlay'>
                  <div className='image-info'>
                    <p className='image-title'>
                      <strong>{photo.titulo}</strong>
                    </p>
                    <p className='image-description'>{photo.descripcion}</p>
                    <small className='image-location'>
                      {photo.lugarCreacion}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadPanel;
