import React, { useState, useEffect, useContext } from 'react';
import { Upload, X, Trash2, Edit3, Image } from 'lucide-react';
import '../../styles/admin/uploadImageGallery.css';
import { AuthContext } from '../../context/AuthContext';
import {
  uploadPesca,
  getAllPesca,
  deletePesca,
  updatePesca,
} from '../../service/Pesca.service';
import { useAlert } from '../AlertManager';

const uploadInfoPesca = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [lugarCreacion, setLugarCreacion] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addAlert } = useAlert();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [modalError, setModalError] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const authContext = useContext(AuthContext);
  const [authToken, setAuthToken] = useState(null);
  const { isAuthenticated, token } = useContext(AuthContext);
  const [localToken, setLocalToken] = useState('');

  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCancelUpload = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewImage(null);
    setTitulo('');
    setDescripcion('');
    setLugarCreacion('');
  };

  useEffect(() => {
    console.log(
      'Estado de autenticación imagen pesca PANEL ADMIN:',
      isAuthenticated
    );
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
    const fetchArticles = async () => {
      try {
        const data = await getAllPesca();
        const formattedArticles = data.map((item) => ({
          id: item.id,
          titulo: item.titulo || `🔹 ${item.tipo}`,
          descripcion: item.descripcion || 'Descripción no disponible',
          imageUrl: item.imageUrl || localImages[item.tipo?.toLowerCase()],
        }));
        setArticles(formattedArticles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [refreshFlag]);

  const handleConfirmUploadPesca = async () => {
    if (!selectedFile || !titulo.trim() || !descripcion.trim()) {
      addAlert('Completa todos los campos', 'warning');
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
      addAlert(
        'No se encontró token. Por favor, inicia sesión nuevamente.',
        'error'
      );
      return;
    }

    setUploading(true);

    try {
      const tempId = `temp-${Date.now()}`;
      const imageUrl = URL.createObjectURL(selectedFile);

      // Vista optimista
      setPhotos((prev) => [
        ...prev,
        {
          id: tempId,
          imageUrl,
          titulo,
          descripcion,
          isTemp: true,
        },
      ]);

      const uploadedPhoto = await uploadPesca(
        selectedFile,
        titulo,
        descripcion,
        token // ✅ sin lugarCreacion
      );

      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === tempId
            ? { ...uploadedPhoto, imageUrl: uploadedPhoto.imageUrl }
            : photo
        )
      );

      addAlert('Imagen subida correctamente', 'success');

      setSelectedFile(null);
      setPreviewImage(null);
      setTitulo('');
      setDescripcion('');
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error('Error al subir imagen de pesca:', error);
      setPhotos((prev) => prev.filter((photo) => photo.id !== tempId));
      addAlert('Error al subir la imagen de pesca', 'error');
    } finally {
      setUploading(false);
    }
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
      addAlert('No se encontró token. Inicia sesión nuevamente.', 'error');
      console.error('No se encontró token. Inicia sesión nuevamente.');
      return;
    }

    try {
      await deletePesca(id, token);
      // Luego puedes actualizar el estado local para quitar la imagen de la galería:
      addAlert('Imagen elimida correctamente', 'success');
      setArticles((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      addAlert('Error al eliminar la imagen', 'error');
    }
  };

  const openEditModal = (photo) => {
    setEditImage(null);
    setEditTitulo(photo.titulo || '');
    setEditDescripcion(photo.descripcion || '');
    setEditingPhoto(photo);
    setModalVisible(true);
  };

  const handleSaveChanges = async (id) => {
    // Validar campos requeridos
    const titulo = editTitulo.trim();
    const descripcion = editDescripcion.trim();

    if (!titulo || !descripcion) {
      addAlert('Completa todos los campos para actualizar.', 'warning');
      return;
    }

    // Obtener token desde múltiples fuentes
    const token =
      localStorage.getItem('authToken') ||
      authContext?.token ||
      JSON.parse(localStorage.getItem('auth'))?.token;

    if (!token) {
      addAlert('No se encontró token. Inicia sesión nuevamente.', 'error');
      return;
    }

    setUploading(true);

    try {
      console.log('📤 Enviando actualización:', {
        id,
        titulo,
        descripcion,
        editImage,
      });

      const updatedPesca = await updatePesca(
        id,
        editImage || null,
        titulo,
        descripcion,
        token
      );

      console.log('✅ Respuesta del servidor:', updatedPesca);

      const updatedImageUrl =
        updatedPesca.imageUrl || editingPhoto.imageUrl || '';

      // Actualizar el estado local
      setArticles((prevArticles) =>
        prevArticles.map((item) =>
          item.id === id
            ? {
                ...item,
                titulo,
                descripcion,
                imageUrl: `${updatedImageUrl}?t=${Date.now()}`,
              }
            : item
        )
      );

      // Limpiar estado y UI
      setModalVisible(false);
      setEditImage(null);
      setRefreshFlag((prev) => !prev);
      addAlert('Información de pesca actualizada correctamente.', 'success');
    } catch (error) {
      console.error(' Error al actualizar pesca:', error);
      addAlert(
        error?.message || 'Error al actualizar. Intenta nuevamente.',
        'error'
      );
    } finally {
      setUploading(false);
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
              <button className='remove-button' onClick={handleCancelUpload}>
                <X size={30} />
              </button>
              <p>
                {selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(2)}{' '}
                KB)
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
              </div>

              <button
                className='upload-button'
                onClick={handleConfirmUploadPesca}
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
        {loading && articles.length === 0 ? (
          <p className='text-muted'>Cargando imágenes...</p>
        ) : articles.length === 0 ? (
          <p className='text-muted'>No hay información de pesca.</p>
        ) : (
          <div className='gallery-masonry'>
            {articles.map((photo, index) => (
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

                    {photo.isTemp && (
                      <div className='uploading-indicator'>Subiendo...</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalVisible && editingPhoto && (
          <div className='modal-backdrop'>
            <div className='modal-card'>
              <h3>Editar Imagen</h3>

              <div className='modal-body'>
                <div className='image-section'>
                  <img
                    src={
                      editImage
                        ? URL.createObjectURL(editImage)
                        : editingPhoto.imageUrl
                    }
                    alt='Vista previa'
                  />
                  <label className='change-image-label'>
                    Cambiar Imagen
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => setEditImage(e.target.files[0])}
                    />
                  </label>
                </div>

                <div className='form-section'>
                  <label>Título</label>
                  <input
                    type='text'
                    placeholder='Título'
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                  />
                  <label>Descripción</label>
                  <textarea
                    placeholder='Descripción'
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                  />
                </div>

                {modalError && (
                  <div className='modal-error'>
                    <p style={{ color: 'red' }}>{modalError}</p>
                  </div>
                )}
              </div>

              <div className='modal-footer'>
                <button
                  className='btn-save'
                  onClick={() => handleSaveChanges(editingPhoto.id)}
                >
                  Guardar
                </button>
                <button
                  className='btn-cancel'
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

export default uploadInfoPesca;
