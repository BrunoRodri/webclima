export interface WeatherDetail {
  date: string;
  full_date: string;
  weekday: string;
  max: number;
  min: number;
  humidity: string;
  cloudiness: number;
  rain: number;
  rain_probability: number | string;
  wind_speedy: string;
  sunrise: string;
  sunset: string;
  moon_phase: string;
  description: string;
  weathericon: string;
}

export interface WeatherData {
  results: {
    temp: number;
    date: string;
    time: string;
    condition_code: string;
    description: string;
    currently: string;
    cid: string;
    city: string;
    img_id: string;
    humidity: number;
    cloudiness: number;
    rain: number;
    wind_speedy: string;
    wind_direction: number;
    wind_cardinal: string;
    sunrise: string;
    sunset: string;
    moon_phase: string;
    condition_slug: string;
    city_name: string;
    timezone: string;
    forecast: WeatherDetail[];
  };
}

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export interface WeatherDetailProps {
  humidity: string;
  windSpeed: string;
  sunrise: string;
  sunset: string;
  rainProbability?: string | number;

}

export type ForecastDay = {
  cloudiness: number;
  condition: string;
  date: string;
  description: string;
  full_date: string;
  humidity: string;
  max: number;
  min: number;
  moon_phase: string;
  rain: number;
  rain_probability: number;
  sunrise: string;
  sunset: string;
  weekday: string;
  wind_speedy: string;
};