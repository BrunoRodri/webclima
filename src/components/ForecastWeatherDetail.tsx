/** @format */

import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails from "./WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelcius";
import { ForecastWeatherDetailProps } from "@/types/weather";


export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    
    description
  } = props;
  return (
    <Container className="gap-4">
      {/* left */}
      <section className=" flex gap-4 items-center xl:px-4 pl-2  ">
        <div className=" flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon.replace(/.$/, "d")} />
          <p>{date}</p>
          <p className="text-sm capitalize text-center font-semibold">{day} </p>
        </div>

        {/*  */}
        <div className="flex flex-col xl:px-4 gap-2">
          <span className="text-5xl">{convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span> Feels like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className="capitalize font-semibold"> {description}</p>
        </div>
      </section>
      {/* right */}
      <section className=" overflow-x-auto flex justify-between gap-4 px-4  w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}