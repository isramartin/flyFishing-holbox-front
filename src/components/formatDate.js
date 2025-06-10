// formatDate.js

export function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('es-MX', options).format(date);
}
