import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get('place');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;

  let url = '';
  if (lat && lon) {
    url = `https://api.hgbrasil.com/weather?key=${apiKey}&lat=${lat}&lon=${lon}`;
  } else if (place) {
    url = `https://api.hgbrasil.com/weather?key=${apiKey}&city_name=${encodeURIComponent(place)}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}