/** @format */

import React from "react";
import { LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { WeatherDetailProps } from "@/types/weather";


export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    humidity, 
    windSpeed, 
    sunrise ,
    sunset ,
    rainProbability
  } = props;

  return (
    <div className="flex gap-6 md:gap-12 lg:gap-20 py-4 text-center w-full  justify-between">
      <SingleWeatherDetail
        icon={<FiDroplet />}
        information="Humidade"
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<FiDroplet />}
        information="Prob. de Chuva"
        value={rainProbability ?? 0}
      />
      <SingleWeatherDetail
        icon={<MdAir />}
        information="Vento"
        value={windSpeed}
      />
      <SingleWeatherDetail
        icon={<LuSunrise />}
        information="Nascer do sol"
        value={sunrise}
      />
      <SingleWeatherDetail
        icon={<LuSunset />}
        information="Por do sol"
        value={sunset}
      />
    </div>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: number | string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}