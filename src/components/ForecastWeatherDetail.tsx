/** @format */

import React from 'react';
import Container from './Container';
import WeatherIcon from './WeatherIcon';
import WeatherDetails from './WeatherDetails';

import { WeatherDetail } from '@/types/weather';

type Props = WeatherDetail & {
  temp?: number;
  feels_like?: number;
};



export default function ForecastWeatherDetail(props: Props) {
  const {
    weathericon,
    date,
    weekday,
    max,
    min,
    humidity,
    wind_speedy,
    sunrise,
    sunset,
    description,
    temp,
    rain_probability
  } = props;

  return (
    <Container className="gap-4">
      {/* left */}
      <section className="flex gap-4 items-center xl:px-4 pl-2">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weathericon} />
          <p>{date}</p>
          <p className="text-sm capitalize text-center font-semibold">
            {weekday}
          </p>
        </div>

        <div className="flex flex-col xl:px-4 gap-2">
          <span className="text-5xl">{max ?? temp ?? 0}°</span>
          <p className="text-xs space-x-1 whitespace-nowrap flex flex-col">
            <span>
              {`${min ?? 0}°C ↓ | ${max ?? 0}°C ↑`}
            </span>
          </p>
          <p className="capitalize font-semibold">{description}</p>
        </div>
      </section>
      {/* right */}
      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails
          humidity={`${humidity}`}
          windSpeed={wind_speedy}
          sunrise={sunrise}
          sunset={sunset}
          rainProbability={rain_probability}
        />
      </section>
    </Container>
  );
}