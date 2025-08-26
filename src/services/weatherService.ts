// Busca previsão do tempo por nome da cidade
export async function getForecastWeather(place: string) {
  const response = await fetch(`/api/weather?place=${encodeURIComponent(place)}`);
  const data = await response.json();
  return data;
}

// Sugestão de cidades
export async function getCitySuggestions(query: string) {
  const response = await fetch(`/api/weather?place=${encodeURIComponent(query)}`);
  const data = await response.json();

  if (!data.results || !data.results.city_name) {
    return [];
  }

  const [name, state] = data.results.city_name.split(',').map((s: string) => s.trim());

  // Só mostra sugestão se o nome bater com o que foi digitado (ignorando acentos e caixa)
  if (name.toLowerCase() !== query.toLowerCase()) {
    return [];
  }

  // Retorna apenas cidade e estado
  return [{ name, state }];
}

// Busca previsão do tempo por coordenadas
export async function getWeatherByCoords(latitude: number, longitude: number) {
  const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
  const data = await response.json();
  return data;
}
