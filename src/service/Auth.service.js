const API_URL = 'http://localhost:8081'


export const loginWithEmail = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/loginEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el inicio de sesión");
    }

    const data = await response.json();
    console.log("data", data);
    
    return data;
  } catch (error) {
    console.error("Error en loginWithEmail:", error);
    throw error;
  }
};

export const registerWithEmail = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        nombre: userData.nombre,
        edad: userData.edad,
        sexo: userData.sexo
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro");
    }

    const data = await response.json();
    console.log("Registro exitoso, datos:", data);
    
    return data;
  } catch (error) {
    console.error("Error en registerWithEmail:", error);
    throw error;
  }
};

export const loginWithGoogle = async (idToken) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en autenticación con Google');
    }

    return await response.json(); // Retorna los datos del backend (ej: { user, token })
  } catch (error) {
    console.error("Error en loginWithGoogle (service):", error);
    throw error;
  }
};