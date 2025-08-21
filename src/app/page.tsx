'use client';
import Container from '@/components/Container';
import Navbar from '@/components/Navbar';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherIcon from '@/components/WeatherIcon';
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelcius';
import { convertWindSpeed } from '@/utils/convertWindSpeed';
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import { metersToKilometers } from '@/utils/metersToKilometers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, fromUnixTime, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=joao%20pessoa&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56&lang=pt_br`
      );
      return data;
    }
  });

  const firstData = data?.list[0];
  console.log(data);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end capitalize">
              <p>
                {format(parseISO(firstData?.dt_txt ?? ''), 'EEEE', {
                  locale: ptBR
                })}
              </p>
              <p className="text-lg ">
                {' '}
                {format(parseISO(firstData?.dt_txt ?? ''), '(dd.MM.yyyy)')}
              </p>
            </h2>
            <Container className="gap-10 x-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°C
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  Sensação{' '}
                  {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°C
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°C ↓
                  </span>
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°C ↑
                  </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between bg-gray-200">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), 'H:mm')}
                    </p>

                    {/* <WeatherIcon iconName={d.weather[0].icon}/> */}
                    <WeatherIcon
                      iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                    />
                    <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°C</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* Left */}
            <Container className="w-fit justify-center flex-col px-4 items-center bg-amber-300">
              <p className="capitalize text-center">
                {firstData?.weather[0].description}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? '',
                  firstData?.dt_txt ?? ''
                )}
              />
            </Container>
            <Container className="px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visability={metersToKilometers(firstData?.visibility ?? 0)}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 0)}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), 'HH:mm')}
                sunset={format(fromUnixTime(data?.city.sunset ?? 0), 'HH:mm')}
              />
            </Container>
            {/* Right  */}
          </div>
        </section>

        <section className="flex flex-col gap-4 w-full">
          <p className="text-2xl ">Previsão (7 dias)</p>
        </section>
      </main>
    </div>
  );
}
