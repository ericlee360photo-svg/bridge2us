import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCity, getWeatherByCoordinates } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const country = searchParams.get('country');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const measurementSystem = searchParams.get('measurementSystem') as 'metric' | 'imperial' || 'metric';
  const temperatureUnit = searchParams.get('temperatureUnit') as 'celsius' | 'fahrenheit' || 'celsius';
  const distanceUnit = searchParams.get('distanceUnit') as 'km' | 'mi' || 'km';

  const preferences = {
    measurementSystem,
    temperatureUnit,
    distanceUnit
  };

  try {
    let weatherData;

    if (lat && lon) {
      // Use coordinates if available
      weatherData = await getWeatherByCoordinates(parseFloat(lat), parseFloat(lon), preferences);
    } else if (city) {
      // Use city name
      weatherData = await getWeatherByCity(city, country || undefined, preferences);
    } else {
      return NextResponse.json(
        { error: 'Missing location parameters. Provide either city or lat/lon coordinates.' },
        { status: 400 }
      );
    }

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
