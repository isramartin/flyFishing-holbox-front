const API_URL = import.meta.env.VITE_API_URL;

export const crearReserva = async (reservaData, token) => {
  if (!reservaData || !token) {
    throw new Error('Datos de reserva o token no proporcionados');
  }

  console.log('Iniciando creación de reserva con datos:', {
    ...reservaData,
    token: token ? `...${token.slice(-4)}` : 'none',
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10s

  try {
    // Asegúrate que esta URL coincide con la ruta de tu backend
    const response = await fetch(`${API_URL}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservaData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Respuesta del servidor no es JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Error en respuesta:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });

      throw new Error(
        data.message ||
          `Error ${response.status}: ${
            response.statusText || 'Error al crear reserva'
          }`
      );
    }

    if (!data.sessionId || !data.sessionUrl || !data.reservaId) {
      console.error('Respuesta inválida del servidor:', data);
      throw new Error(
        'La respuesta del servidor no contiene los datos esperados'
      );
    }

    console.log('Reserva creada exitosamente:', {
      reservaId: data.reservaId,
      sessionId: data.sessionId,
      sessionUrl: data.sessionUrl,
    });

    return {
      reservaId: data.reservaId,
      sessionId: data.sessionId,
      sessionUrl: data.sessionUrl,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('Timeout al crear reserva: La solicitud tardó demasiado');
      throw new Error(
        'La solicitud tardó demasiado. Por favor intenta nuevamente'
      );
    }

    console.error('Error en crearReserva:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Problema de conexión. Verifica tu internet e intenta nuevamente'
      );
    }

    throw error instanceof Error
      ? error
      : new Error('Error desconocido al crear reserva');
  }
};
