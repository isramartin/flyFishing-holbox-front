const API_URL = import.meta.env.VITE_API_URL;

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

export const loginWithGoogle = async (googleToken) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: googleToken
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el inicio de sesión con Google");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en loginWithGoogle:", error);
    throw error;
  }
};