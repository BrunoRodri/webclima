export function windSpeedToKmH(windSpeed: string): string {
  const value = parseFloat(windSpeed);
  // Sempre converte de m/s para km/h e arredonda para inteiro
  const kmh = Math.round(value * 3.6);
  return `${kmh} km/h`;
}