const API_URL = import.meta.env.VITE_API_URL;

export const getAllPesca = async () => {
  try {
    // Si el endpoint requiere autenticación, descomenta:
    // const token = localStorage.getItem("authToken");
    // if (!token) throw new Error("No hay token de autenticación");

    const response = await fetch(
      `${API_URL}/api/pesca/All`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          // Si necesita autorización:
          // Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del servidor:", errorData);
      throw new Error(errorData.message || "Error al obtener datos de pesca");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getAllPesca:", error);
    throw error; // Re-lanzamos el error para manejarlo donde se llame a la función
  }
};