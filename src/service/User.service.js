const API_URL = import.meta.env.VITE_API_URL;

export const getUsuarioById = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('🔴 Error al obtener el usuario:', errorData);
      throw new Error(errorData.message || 'Error al obtener el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    throw error;
  }
};
