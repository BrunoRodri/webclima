'use client';
import Container from '@/components/Container';
import ForecastWeatherDetail from '@/components/ForecastWeatherDetail';
import Navbar from '@/components/Navbar';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherIcon from '@/components/WeatherIcon';
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelcius';
import { convertWindSpeed } from '@/utils/convertWindSpeed';
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import { metersToKilometers } from '@/utils/metersToKilometers';
import { useQuery } from '@tanstack/react-query';
import { format, fromUnixTime, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from './atom';
import { useEffect } from 'react';
import { getForecastWeather } from '@/services/weatherService';
import type { WeatherData } from '@/types/weather';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [place, setPlace] = useAtom(placeAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ['repoData', place],
    queryFn: async () => {
      return await getForecastWeather(place);
    }
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        entry => new Date(entry.dt * 1000).toISOString().split('T')[0]
      )
    )
  ];

  function formatLocalHour(dt: number, timezone: number) {
    // dt = timestamp em segundos
    // timezone = diferença em segundos do UTC
    const localTimestamp = dt + timezone;
    return format(fromUnixTime(localTimestamp), 'H:mm');
  }

  const firstDataForEachDate = uniqueDates.map(date => {
    return data?.list.find(entry => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="flex flex-col gap-4 bg-blue-300 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end capitalize font-semibold">
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
                  <div className="flex flex-col px-4 text-center items-center">
                    <span className="text-5xl">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°C
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      Sensação{' '}
                      {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}
                      °C
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °C ↓
                      </span>
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °C ↑
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between bg-blue-200v scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200 custom-scroll">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {formatLocalHour(d.dt, data?.city.timezone ?? 0)}
                        </p>

                        {/* <WeatherIcon iconName={d.weather[0].icon}/> */}
                        <WeatherIcon
                          iconName={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
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
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 0),
                      'HH:mm'
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 0),
                      'HH:mm'
                    )}
                  />
                </Container>
                {/* Right  */}
              </div>
            </section>

            <section className="flex flex-col gap-4 w-full">
              <p className="text-2xl font-semibold">Previsão (7 dias)</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ''}
                  weatherIcon={d?.weather[0].icon ?? '01d'}
                  date={d ? format(parseISO(d.dt_txt), 'dd.MM') : ''}
                  day={
                    d
                      ? format(parseISO(d.dt_txt), 'EEEE', { locale: ptBR })
                      : ''
                  }
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    'H:mm'
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    'H:mm'
                  )}
                  visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(index => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map(index => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
