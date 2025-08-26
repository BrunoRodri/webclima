/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Container from '@/components/Container';
import ForecastWeatherDetail from '@/components/ForecastWeatherDetail';
import Navbar from '@/components/Navbar';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherIcon from '@/components/WeatherIcon';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from './atom';
import { useEffect } from 'react';
import { getForecastWeather } from '@/services/weatherService';
import { ForecastDay } from '@/types/weather';
import { getWeekdayFromDate } from '@/utils/getWeekdayFromDate';
import { windSpeedToKmH } from '@/utils/metersToKilometers';

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['repoData', place],
    queryFn: async () => {
      return await getForecastWeather(place);
    }
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  // Dados principais
  const mainData = data?.results;
  const forecastList: ForecastDay[] = mainData?.forecast ?? [];
  // console.log(forecastList);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="flex flex-col gap-4 bg-blue-300 min-h-screen">
      <Navbar location={`${mainData?.city}`} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end capitalize font-semibold">
                  <p>{getWeekdayFromDate(mainData.date)}</p>
                  <p className="text-lg ">{mainData?.date}</p>
                </h2>
                <Container className="gap-10 x-6 items-center">
                  <div className="flex flex-col px-4 text-center items-center">
                    <span className="text-5xl">{mainData?.temp}°C</span>

                    <p className="text-xs space-x-2">
                      <span>{forecastList[0]?.min}°C ↓</span>
                      <span>{forecastList[0]?.max}°C ↑</span>
                    </p>
                  </div>
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between bg-blue-200v scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200 custom-scroll">
                    {forecastList.map((d: ForecastDay, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">{d.date}</p>
                        <WeatherIcon iconName={d.condition} />
                        <p>
                          <span className='text-[16px] font-bold'>↓</span>{d.min}°C / <span className='text-[16px] font-bold'>↑</span>{d.max}°C
                        </p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                {/* Left */}
                <Container className="w-fit justify-center flex-col px-4 items-center bg-amber-300">
                  <p className="capitalize text-center font-semibold">
                    {mainData?.description}
                  </p>
                  <WeatherIcon iconName={mainData?.condition_slug} />
                </Container>
                <Container className="px-6 gap-4 justify-between overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200 custom-scroll">
                  <WeatherDetails
                    humidity={`${mainData?.humidity}%`}
                    rainProbability={`${forecastList[0]?.rain_probability} %`}
                    windSpeed={`${windSpeedToKmH(mainData?.wind_speedy)}`}
                    sunrise={mainData?.sunrise}
                    sunset={mainData?.sunset}
                  />
                </Container>
              </div>
            </section>

            <section className="flex flex-col gap-4 w-full">
              <p className="text-2xl font-semibold">Previsão (14 dias)</p>
              {forecastList.map((d: ForecastDay, i: number) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d.description}
                  weathericon={d.condition}
                  date={d.date}
                  weekday={d.weekday}
                  temp={d.max}
                  max={d.max}
                  min={d.min}
                  humidity={`${d?.humidity}%`}
                  sunrise={d?.sunrise}
                  sunset={d?.sunset}
                  wind_speedy={windSpeedToKmH(d?.wind_speedy)}
                  full_date={d.full_date}
                  cloudiness={d.cloudiness}
                  rain={d.rain}
                  rain_probability={`${d.rain_probability}%`}
                  moon_phase={d.moon_phase}
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
