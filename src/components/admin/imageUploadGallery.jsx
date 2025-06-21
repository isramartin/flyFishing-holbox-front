import React, { useState, useEffect, useContext } from 'react';
import '../../styles/admin/uploadImageGallery.css';
import { Image, Upload, X, Trash2, Edit3 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import {
  uploadGalleryImage,
  getAllGaleria,
  deleteGalleryImage,
} from '../../service/galeria.service';

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

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null); // objeto con los datos
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editLugarCreacion, setEditLugarCreacion] = useState('');
  const [editImage, setEditImage] = useState(null);

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setEditTitulo(photo.titulo || '');
    setEditDescripcion(photo.descripcion || '');
    setEditLugarCreacion(photo.lugarCreacion || '');
    setEditImage(null); // limpiar
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const data = await getAllGaleria();

        // Mantener las fotos temporales (si las hay) durante la recarga
        setPhotos((prev) => {
          const tempPhotos = prev.filter((p) => p.isTemp);
          return [...tempPhotos, ...data];
        });
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

    if (!token) {
      console.error('No se encontró token. Inicia sesión nuevamente.');
      return;
    }

    setUploading(true);

    try {
      // Crear objeto temporal para la vista optimista
      const tempId = `temp-${Date.now()}`; // ID temporal
      const imageUrl = URL.createObjectURL(selectedFile);

      // Actualización optimista
      setPhotos((prev) => [
        ...prev,
        {
          id: tempId,
          imageUrl,
          titulo,
          descripcion,
          lugarCreacion,
          favorito: false,
          isTemp: true, // Marcar como temporal
        },
      ]);

      // Subir al servidor
      const uploadedPhoto = await uploadGalleryImage(
        {
          file: selectedFile,
          titulo,
          descripcion,
          lugarCreacion,
          favorito: false,
        },
        token
      );

      // Reemplazar el temporal con el real
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === tempId
            ? { ...uploadedPhoto, imageUrl: uploadedPhoto.imageUrl }
            : photo
        )
      );

      // Limpieza
      setSelectedFile(null);
      setPreviewImage(null);
      setTitulo('');
      setDescripcion('');
      setLugarCreacion('');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      // Revertir la actualización optimista en caso de error
      setPhotos((prev) => prev.filter((photo) => photo.id !== tempId));
      alert('Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleRemovePhoto = async (id) => {
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

    // const token = localStorage.getItem('authToken'); // o de tu auth context

    try {
      await deleteGalleryImage(id, token);
      // Luego puedes actualizar el estado local para quitar la imagen de la galería:
      setPhotos((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      alert('Error al eliminar la imagen');
    }
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
        {loading && photos.length === 0 ? (
          <p className='text-muted'>Cargando imágenes...</p>
        ) : photos.length === 0 ? (
          <p className='text-muted'>No hay imágenes en la galería.</p>
        ) : (
          <div className='gallery-masonry'>
            {photos.map((photo, index) => (
              <div className='image-card' key={photo.id || index}>
                <div className='image-container'>
                  <img
                    src={photo.imageUrl}
                    alt={photo.titulo || `Imagen ${index + 1}`}
                    className={`img-fluid w-100 ${
                      photo.isTemp ? 'uploading-image' : ''
                    }`}
                  />
                  {!photo.isTemp && (
                    <button
                      className='remove-button-admin position-absolute'
                      onClick={() => handleRemovePhoto(photo.id)}
                    >
                      <Trash2 />
                    </button>
                  )}

                  <button
                    className='edit-button-admin position-absolute'
                    onClick={() => openEditModal(photo)}
                  >
                    <Edit3 />
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
                    {photo.isTemp && (
                      <div className='uploading-indicator'>Subiendo...</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalVisible && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <h5>Editar Imagen</h5>
              <img
                src={
                  editImage
                    ? URL.createObjectURL(editImage)
                    : editingPhoto.imageUrl
                }
                alt='Vista previa'
                className='preview-image'
              />

              <input
                type='file'
                accept='image/*'
                onChange={(e) => setEditImage(e.target.files[0])}
              />

              <input
                type='text'
                placeholder='Título'
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
              />
              <textarea
                placeholder='Descripción'
                value={editDescripcion}
                onChange={(e) => setEditDescripcion(e.target.value)}
              />
              <input
                type='text'
                placeholder='Lugar de creación'
                value={editLugarCreacion}
                onChange={(e) => setEditLugarCreacion(e.target.value)}
              />

              <div className='modal-actions'>
                <button
                  className='btn btn-primary'
                  onClick={() => handleSaveChanges(editingPhoto.id)}
                >
                  Guardar cambios
                </button>
                <button
                  className='btn btn-secondary'
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadPanel;
