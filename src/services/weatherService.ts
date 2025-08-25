import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;


export async function searchCities(query: string) {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}&lang=pt_br`
  );

  return response.data;
}

export async function getWeatherByCoords(latitude: number, longitude: number) {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=pt_br`
  );
  return response.data;
}

export async function getCitySuggestions(query: string) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}&lang=pt_br`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.list.map((item: any) => ({
      name: item.name,
      country: item.sys.country
    }));
  } catch {
    return [];
  }
}

export async function getForecastWeather(place: string) {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56&lang=pt_br`
  );
  return response.data;
}
