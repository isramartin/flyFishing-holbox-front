const API_URL = import.meta.env.VITE_API_URL;
console.log("URL", API_URL);

export const getAllGaleria = async () => {
  try {
    const response = await fetch(`${API_URL}/api/galeria/All`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Si necesitas autenticación:
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener la galería");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAllGaleria:", error);
    throw error;
  }
};
