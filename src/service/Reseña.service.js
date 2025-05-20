const API_URL = import.meta.env.VITE_API_URL;

export const getAllResenas = async () => {
  try {
    const response = await fetch(`${API_URL}/api/resenas/All`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Si necesitas autenticación:
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las reseñas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAllResenas:", error);
    throw error;
  }
};
