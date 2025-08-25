/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { MdLocationOn, MdMyLocation, MdWbSunny } from 'react-icons/md';
import SearchBox from './SearchBox';
import { useAtom } from 'jotai';
import { placeAtom, loadingCityAtom } from '@/app/atom';
import {
  getWeatherByCoords,
  getCitySuggestions
} from '@/services/weatherService';

type Props = { location?: string };

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const [suggestions, setSuggestions] = useState<
    { name: string; country: string }[]
  >([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 2) {
      try {
        const suggestions = await getCitySuggestions(value);
        setSuggestions(suggestions);
        setError('');
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
  const selected = suggestions.find(item => item.name === value);
  if (selected) {
    setPlace(`${selected.name}, ${selected.country}`);
    setCity(selected.name);
  } else {
    setPlace(value);
    setCity(value);
  }
  setShowSuggestions(false);
}

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError('Location not found');
      setLoadingCity(false);
    } else {
      setError('');
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 1000);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          const data = await getWeatherByCoords(latitude, longitude);
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(`${data.name}, ${data.sys.country}`);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <span className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">WebClima</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </span>
          {/* */}
          <section className="flex items-center gap-2">
            <MdMyLocation
              onClick={handleCurrentLocation}
              className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdLocationOn className="text-2xl" />
            <p className="text-slate-900/80 text-sm"> {place} </p>
            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={e => handleInputChange(e.target.value)}
              />
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative">
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={e => handleInputChange(e.target.value)}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: { name: string; country: string }[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1 "> {error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item.name)}
              className="cursor-pointer p-1 rounded   hover:bg-gray-200"
            >
              {`${item.name}, ${item.country}`}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
