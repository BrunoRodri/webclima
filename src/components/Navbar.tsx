'use client';
import React from 'react';
import { MdLocationOn, MdMyLocation, MdWbSunny } from 'react-icons/md';
import SearchBox from './SearchBox';

type Props = { location?: string };

export default function Navbar({}: Props) {
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <span className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">WebClima</h2>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
        </span>
        {/* */}
        <section className="flex items-center gap-2">
          <MdMyLocation className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'/>
          <MdLocationOn className='text-2xl'/>
          <p className='text-slate-900/80 text-sm'> Brasil </p>
          <div>
            <SearchBox />
          </div>
        </section>
      </div>
    </nav>
  );
}
