'use client';
import { cn } from '@/utils/cn';
import React from 'react';
import { MdSearch } from 'react-icons/md';

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn("flex relative items-center h-10 justify-center", props.className)}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Procurar localização..."
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none  focus:border-blue-500 h-full"
      />
      <button className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-600 cursor-pointer h-full">
        <MdSearch />
      </button>
    </form>
  );
}
