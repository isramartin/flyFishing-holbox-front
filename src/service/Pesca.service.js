const API_URL = import.meta.env.VITE_API_URL;

export const getAllPesca = async () => {
  try {
    const response = await fetch(`${API_URL}/api/pesca/All`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error al obtener datos de pesca');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getAllPesca:', error);
    throw error; // Re-lanzamos el error para manejarlo donde se llame a la función
  }
};

export const uploadPesca = async (file, titulo, descripcion, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file); // archivo tipo File
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    const response = await fetch(`${API_URL}/api/pesca/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del backend:', errorData);
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en uploadPesca:', error);
    throw error;
  }
};

export const updatePesca = async (id, file, titulo, descripcion, token) => {
  try {
    const formData = new FormData();

    if (file) {
      formData.append('file', file); // archivo tipo File
    }

    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    const response = await fetch(`${API_URL}/api/pesca/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // NUNCA pongas Content-Type con FormData: el navegador lo gestiona
      },
      body: formData,
    });

    // Manejo defensivo de la respuesta
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const raw = await response.text();

    if (!response.ok) {
      console.error('🔴 Error del backend al actualizar:', raw);
      throw new Error(raw || 'Error al actualizar la pesca');
    }

    // Parseamos si es JSON
    if (isJson) {
      return JSON.parse(raw);
    }

    // Si no es JSON, devolvemos datos mínimos para actualizar el estado local
    return {
      id,
      titulo,
      descripcion,
      imageUrl: null, // fallback si no vino imagen
    };
  } catch (error) {
    console.error('❌ Error en updatePesca:', error);
    throw error;
  }
};


export const deletePesca = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/pesca/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('🔴 Error del backend al eliminar:', errorData);
      throw new Error(errorData.message || 'Error al eliminar la pesca');
    }

    return await response.json(); // o `response.text()` si no devuelve JSON
  } catch (error) {
    console.error('Error en deletePesca:', error);
    throw error;
  }
};
