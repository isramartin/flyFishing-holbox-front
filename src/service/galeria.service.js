const API_URL = import.meta.env.VITE_API_URL;
console.log('URL', API_URL);

export const getAllGaleria = async () => {
  try {
    const response = await fetch(`${API_URL}/api/galeria/All`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        // Si necesitas autenticación:
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener la galería');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllGaleria:', error);
    throw error;
  }
};

export const updateFavorito = async (id, favorito) => {
  try {
    const response = await fetch(
      `${API_URL}/api/galeria/favorito/${id}?favorito=${favorito}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar favorito');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateFavorito:', error);
    throw error;
  }
};

export const descargarImagen = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/galeria/downloadFile/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al descargar imagen');
    }

    const blob = await response.blob(); // Obtiene los bytes binarios
    const url = window.URL.createObjectURL(blob);

    // Extraer el nombre del archivo del header Content-Disposition
    const disposition = response.headers.get('Content-Disposition');
    let filename = 'imagen.jpg'; // default
    if (disposition && disposition.indexOf('filename=') !== -1) {
      filename = disposition.split('filename=')[1].replace(/"/g, '');
    }

    // Crear enlace invisible para forzar descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

     return true;
  } catch (error) {
    console.error('Error en descargarImagen:', error);
    throw error;
  }
};

export const uploadGalleryImage = async (imageData, token) => {
  try {
    const formData = new FormData();
    formData.append('file', imageData.file);
    formData.append('titulo', imageData.titulo);
    formData.append('descripcion', imageData.descripcion);
    formData.append('lugarCreacion', imageData.lugarCreacion);
    formData.append('favorito', imageData.favorito?.toString() || 'false');

    const response = await fetch(`${API_URL}/api/galeria/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error desde el backend al subir imagen:', errorData);
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en uploadGalleryImage:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/galeria/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al eliminar imagen:', errorData);
      throw new Error(errorData.message || 'Error al eliminar la imagen');
    }

    const result = await response.text(); // o .json() si el backend responde con JSON
    console.log('✅ Imagen eliminada:', result);
    return result;
  } catch (error) {
    console.error('🔴 Error en deleteGalleryImage:', error);
    throw error;
  }
};
