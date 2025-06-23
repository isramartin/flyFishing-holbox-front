import React, { useState } from 'react';
import { Upload, X, Trash2, Edit3, Image } from 'lucide-react';
import '../../styles/admin/uploadImageGallery.css';

const uploadInfoPesca = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [lugarCreacion, setLugarCreacion] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editLugarCreacion, setEditLugarCreacion] = useState('');

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

  const handleConfirmUpload = () => {
    if (!selectedFile) return;
    // Aquí se puede simular la carga
    const newPhoto = {
      id: Date.now(),
      imageUrl: previewImage,
      titulo,
      descripcion,
      lugarCreacion,
      isTemp: false,
    };
    setPhotos([...photos, newPhoto]);
    handleCancelUpload();
  };

  const handleRemovePhoto = (id) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setEditImage(null);
    setEditTitulo(photo.titulo);
    setEditDescripcion(photo.descripcion);
    setEditLugarCreacion(photo.lugarCreacion);
    setModalVisible(true);
  };

  const handleSaveChanges = (id) => {
    setPhotos(
      photos.map((photo) =>
        photo.id === id
          ? {
              ...photo,
              titulo: editTitulo,
              descripcion: editDescripcion,
              lugarCreacion: editLugarCreacion,
              imageUrl: editImage
                ? URL.createObjectURL(editImage)
                : photo.imageUrl,
            }
          : photo
      )
    );
    setModalVisible(false);
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
          <p className='text-muted'>No hay información de pesca.</p>
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
                </div>
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
