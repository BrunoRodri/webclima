/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import { MdLocationOn, MdMyLocation, MdWbSunny } from 'react-icons/md';
import SearchBox from './SearchBox';
import { useAtom } from 'jotai';
import { placeAtom, loadingCityAtom } from '@/app/atom';
import {
  getWeatherByCoords,
  getCitySuggestions
} from '@/services/weatherService';
import { useRouter } from 'next/navigation';

type Props = { location?: string };

export default function Navbar({}: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (showSuggestions && suggestions.length > 0) {
      setSelectedIndex(0);
    }
  }, [showSuggestions, suggestions]);

  async function handleInputChange(value: string) {
  setCity(value);
  if (value.length >= 2) {
    try {
      const suggestions = await getCitySuggestions(value);
      setSuggestions(suggestions);
      setShowSuggestions(true);
      setError(suggestions.length === 0 ? 'Cidade não encontrada' : '');
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
      setError('Erro ao buscar sugestões');
    }
  } else {
    setSuggestions([]);
    setShowSuggestions(false);
    setError('');
  }
}

  function handleSuggestionClick(value: string) {
    const selected = suggestions.find(
      item => `${item.name}` === value
    );
    if (selected) {
      setPlace(`${selected.name}`);
      setCity(selected.name);
    } else {
      setPlace(value);
      setCity(value);
    }
    setShowSuggestions(false);
  }


  function handleSubmitSearch(e: React.FormEvent) {
  e.preventDefault();
  // Se há erro, não faz nada
  if (error) return;
  if (city.length > 1) {
    const selected = suggestions.find(
      item => item.name.toLowerCase() === city.toLowerCase()
    );
    if (selected) {
      setPlace(selected.name);
    } else {
      setPlace(city);
    }
    setShowSuggestions(false);
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
            setPlace(`${data.results.city}`);
          }, 500);
        } catch {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-blue-500">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <span className="flex items-center justify-center gap-2">
            <h2 className="text-gray-900 text-3xl font-bold">WebClima</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </span>
          {/* */}
          <section className="flex items-center gap-2">
            <MdMyLocation
              onClick={handleCurrentLocation}
              className="text-2xl text-gray-600 hover:opacity-80 cursor-pointer"
            />
            <MdLocationOn className="text-2xl" />
            <p className="text-slate-900/80 text-sm font-semibold capitalize">
              {' '}
              {place}{' '}
            </p>
            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={e => {
                  if (showSuggestions && suggestions.length > 0) {
                    if (e.key === 'ArrowDown') {
                      setSelectedIndex(prev =>
                        Math.min(prev + 1, suggestions.length - 1)
                      );
                    }
                    if (e.key === 'ArrowUp') {
                      setSelectedIndex(prev => Math.max(prev - 1, 0));
                    }
                    if (e.key === 'Enter') {
                      handleSuggestionClick(suggestions[selectedIndex].name);
                      setShowSuggestions(false);
                      e.preventDefault();
                    }
                  }
                }}
              />
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                  selectedIndex
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
              error,
              selectedIndex
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
  error,
  selectedIndex
}: {
  showSuggestions: boolean;
  suggestions: { name: string }[];
  handleSuggestionClick: (item: string) => void;
  error: string;
  selectedIndex: number;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 0) || error) && (
        <ul className="mb-4 bg-blue-400 absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1 "> {error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item.name)}
              className={`cursor-pointer p-1 rounded hover:bg-gray-200 ${
                selectedIndex === i ? 'bg-blue-200 font-bold' : ''
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
