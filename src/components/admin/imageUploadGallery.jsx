import React, { useState, useEffect } from "react";
import '../../styles/admin/uploadImageGallery.css';
import { Image, Upload, X, Trash2 } from 'lucide-react';

const ImageUploadPanel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
    setGalleryImages(savedImages);
  }, []);

  useEffect(() => {
    localStorage.setItem("galleryImages", JSON.stringify(galleryImages));
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
    if (!selectedFile) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    setUploading(true);

    setTimeout(() => {
      const imageUrl = URL.createObjectURL(selectedFile);
      setGalleryImages((prevImages) => [
        ...prevImages,
        { url: imageUrl, name: selectedFile.name },
      ]);
      setSelectedFile(null);
      setPreviewImage(null);
      setUploading(false);
    }, 1000);
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleRemoveImage = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  return (
    <div className="image-upload-gallery-container">
      <h4>Subir Nueva Imagen</h4>
      <div className="image-upload-gallery">
        <div
          className={`drag-drop-area ${previewImage ? "has-preview" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-input").click()}
        >
          {previewImage ? (
            <>
              <img src={previewImage} alt="Previsualización" className="preview-image" />
              <button className="remove-image-button" onClick={handleCancelUpload}>
                <X />
              </button>
              <p>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>
              <button onClick={handleConfirmUpload} className="upload-button" disabled={uploading}>
                <Upload /> {uploading ? "Subiendo..." : " Subir Imagen"}
              </button>
            </>
          ) : (
            <>
              <Image />
              <p>Arrastra y suelta tu imagen aquí</p>
              <span>o</span>
              <button className="select-image-button">Seleccionar Imagen</button>
            </>
          )}
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
          />
        </div>
      </div>

      <div className="gallery-container-preview">
        {galleryImages.length === 0 ? (
          <p className="text-muted">No hay imágenes subidas todavía.</p>
        ) : (
          <div className="row">
            {galleryImages.map((image, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="image-card">
                  <img src={image.url} alt={`Imagen ${index + 1}`} className="img-fluid" />
                  <div className="image-info">
                    <p>{image.name}</p>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image-button"
                    >
                      <Trash2 />
                    </button>
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
