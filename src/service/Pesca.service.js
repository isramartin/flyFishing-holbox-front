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
