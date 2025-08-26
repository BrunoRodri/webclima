/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getForecastWeather(place: string) {
  const response = await fetch(`/api/weather?place=${encodeURIComponent(place)}`);
  const data = await response.json();
  return data;
}

// Sugestão de cidades
export async function getCitySuggestions(query: string) {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
  const cidades = await response.json();
  return cidades
    .filter((cidade: any) =>
      cidade.nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
    )
    .slice(0, 10)
    .map((cidade: any) => ({
      name: `${cidade.nome}, ${cidade.microrregiao.mesorregiao.UF.sigla}`
    }));
}

// Busca previsão do tempo por coordenadas
export async function getWeatherByCoords(latitude: number, longitude: number) {
  const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
  const data = await response.json();
  return data;
}
