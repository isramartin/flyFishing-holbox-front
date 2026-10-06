const API_URL = import.meta.env.VITE_API_URL;

export const crearReserva = async (reservaData) => {
  if (!reservaData) {
    throw new Error('No se proporcionaron los datos de la reserva');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_URL}/api/reservas/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservaData),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
          data.message ||
          `Error ${response.status}: ${response.statusText}`
      );
    }

    if (!data.reservaId || !data.orderId || !data.approveUrl) {
      throw new Error(
        'La reserva fue procesada, pero faltan los datos de PayPal.'
      );
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'La solicitud tardó demasiado. Comprueba el estado de tu reserva antes de intentarlo nuevamente.'
      );
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error('No fue posible conectar con el servidor.');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const capturarPagoPayPal = async (orderId, token) => {
  if (!orderId) {
    throw new Error('No se proporcionó el ID de la orden de PayPal');
  }

  if (!token) {
    throw new Error('Token de autenticación no proporcionado');
  }

  console.log('Capturando pago PayPal:', orderId);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `${API_URL}/api/reservas/paypal/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Error al capturar pago PayPal:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });

      throw new Error(
        data.message ||
          data.error ||
          `Error ${response.status}: ${
            response.statusText || 'No se pudo completar el pago'
          }`
      );
    }

    console.log('Pago PayPal capturado correctamente:', data);

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('Timeout al capturar pago PayPal');

      throw new Error(
        'La solicitud de pago tardó demasiado. Verifica el estado de tu reserva.'
      );
    }

    console.error('Error en capturarPagoPayPal:', error.message || error);

    throw error instanceof Error
      ? error
      : new Error('Error desconocido al capturar el pago');
  }
};
export const buscarReservaPorCodigo = async (codigo) => {
  if (!codigo) {
    throw new Error('Código de reserva no proporcionado');
  }

  console.log('Buscando reserva con código:', codigo);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `${API_URL}/api/reservas/codigo/${encodeURIComponent(codigo)}`,
      {
        method: 'GET',
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Respuesta del servidor no es JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Error al buscar reserva:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });

      throw new Error(
        data.message ||
          `Error ${response.status}: ${
            response.statusText || 'Error al buscar la reserva'
          }`
      );
    }

    console.log('Reserva encontrada:', data);

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Inténtalo nuevamente.');
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Problema de conexión. Verifica tu internet e intenta nuevamente.'
      );
    }

    throw error instanceof Error
      ? error
      : new Error('Error desconocido al buscar la reserva.');
  }
};

export const obtenerTodasLasReservas = async (token) => {
  if (!token) {
    throw new Error('Token de autenticación no proporcionado');
  }

  console.log('Consultando todas las reservas...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10s

  try {
    const response = await fetch(`${API_URL}/api/reservas`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Error al obtener reservas:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });

      throw new Error(
        data.message ||
          `Error ${response.status}: ${
            response.statusText || 'No se pudieron obtener las reservas'
          }`
      );
    }

    console.log('Reservas obtenidas correctamente:', data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('Timeout al obtener las reservas');
      throw new Error('La solicitud tardó demasiado. Intenta de nuevo.');
    }

    console.error('Error en obtenerTodasLasReservas:', error.message || error);
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al obtener las reservas');
  }
};

export const obtenerMisReservas = async (token) => {
  if (!token) {
    throw new Error('Token de autenticación no proporcionado');
  }

  console.log('Consultando las reservas del usuario...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10s

  try {
    const response = await fetch(`${API_URL}/api/reservas/misReservas`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Error al obtener reservas del usuario:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });

      throw new Error(
        data.message ||
          `Error ${response.status}: ${
            response.statusText ||
            'No se pudieron obtener las reservas del usuario'
          }`
      );
    }

    console.log('Reservas del usuario obtenidas correctamente:', data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('Timeout al obtener las reservas del usuario');
      throw new Error('La solicitud tardó demasiado. Intenta de nuevo.');
    }

    console.error('Error en obtenerMisReservas:', error.message || error);
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al obtener las reservas del usuario');
  }
};

export const FechasOcupadas = async () => {
  console.log('Consultando fechas ocupadas...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10s

  try {
    const response = await fetch(`${API_URL}/api/reservas/ocupadas`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Error al obtener fechas ocupadas:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });

      throw new Error(
        data.message ||
          `Error ${response.status}: ${
            response.statusText || 'No se pudieron obtener las fechas ocupadas'
          }`
      );
    }

    console.log('Fechas ocupadas:', data);
    return data; // <- [{ fecha: '2025-07-01', cantidad: 2 }, ...]
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('Timeout al obtener fechas ocupadas');
      throw new Error('La solicitud tardó demasiado. Intenta de nuevo.');
    }

    console.error('Error en obtenerFechasOcupadas:', error.message || error);
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al obtener fechas ocupadas');
  }
};

export const obtenerReservaPorId = async (reservaId, token) => {
  if (!reservaId || !token) {
    throw new Error('ID de reserva o token no proporcionados');
  }

  console.log('Consultando reserva con ID:', reservaId);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

  try {
    const response = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Error en respuesta al obtener reserva:', {
        status: response.status,
        statusText: response.statusText,
        errorData: data,
      });

      throw new Error(
        data.message ||
          `Error ${response.status}: ${
            response.statusText || 'No se pudo obtener la reserva'
          }`
      );
    }

    console.log('Reserva obtenida exitosamente:', data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('Timeout al obtener la reserva');
      throw new Error('La solicitud tardó demasiado. Intenta de nuevo.');
    }

    console.error('Error en obtenerReservaPorId:', error.message || error);
    throw error instanceof Error
      ? error
      : new Error('Error desconocido al obtener reserva');
  }
};
