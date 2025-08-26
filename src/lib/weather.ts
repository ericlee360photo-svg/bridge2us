import axios from 'axios';

export interface WeatherData {
  temperature: number;
  temperatureFahrenheit?: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windSpeedMph?: number;
  location: string;
  country: string;
  daily?: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface UserPreferences {
  measurementSystem: 'metric' | 'imperial';
  temperatureUnit: 'celsius' | 'fahrenheit';
  distanceUnit: 'km' | 'mi';
}

// Open-Meteo API configuration
const BASE_URL = 'https://api.open-meteo.com/v1';

// Weather code to condition mapping
const weatherCodes: { [key: number]: { condition: string; icon: string; description: string } } = {
  0: { condition: 'clear', icon: '☀️', description: 'Clear sky' },
  1: { condition: 'partly-cloudy', icon: '⛅', description: 'Mainly clear' },
  2: { condition: 'partly-cloudy', icon: '⛅', description: 'Partly cloudy' },
  3: { condition: 'cloudy', icon: '☁️', description: 'Overcast' },
  45: { condition: 'foggy', icon: '🌫️', description: 'Foggy' },
  48: { condition: 'foggy', icon: '🌫️', description: 'Depositing rime fog' },
  51: { condition: 'drizzle', icon: '🌦️', description: 'Light drizzle' },
  53: { condition: 'drizzle', icon: '🌦️', description: 'Moderate drizzle' },
  55: { condition: 'drizzle', icon: '🌦️', description: 'Dense drizzle' },
  61: { condition: 'rain', icon: '🌧️', description: 'Slight rain' },
  63: { condition: 'rain', icon: '🌧️', description: 'Moderate rain' },
  65: { condition: 'rain', icon: '🌧️', description: 'Heavy rain' },
  71: { condition: 'snow', icon: '🌨️', description: 'Slight snow' },
  73: { condition: 'snow', icon: '🌨️', description: 'Moderate snow' },
  75: { condition: 'snow', icon: '🌨️', description: 'Heavy snow' },
  77: { condition: 'snow', icon: '🌨️', description: 'Snow grains' },
  80: { condition: 'rain', icon: '🌧️', description: 'Slight rain showers' },
  81: { condition: 'rain', icon: '🌧️', description: 'Moderate rain showers' },
  82: { condition: 'rain', icon: '🌧️', description: 'Violent rain showers' },
  85: { condition: 'snow', icon: '🌨️', description: 'Slight snow showers' },
  86: { condition: 'snow', icon: '🌨️', description: 'Heavy snow showers' },
  95: { condition: 'thunderstorm', icon: '⛈️', description: 'Thunderstorm' },
  96: { condition: 'thunderstorm', icon: '⛈️', description: 'Thunderstorm with slight hail' },
  99: { condition: 'thunderstorm', icon: '⛈️', description: 'Thunderstorm with heavy hail' }
};

function getWeatherInfo(code: number) {
  return weatherCodes[code] || { condition: 'unknown', icon: '🌤️', description: 'Unknown' };
}

function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

function mmToInches(mm: number): number {
  return mm * 0.0393701;
}

export async function getWeatherByCity(city: string, country?: string, preferences?: UserPreferences): Promise<WeatherData> {
  try {
    // First, get coordinates for the city using geocoding
    const geocodeResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: city,
        count: 1,
        language: 'en',
        format: 'json'
      }
    });

    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      throw new Error('City not found');
    }

    const location = geocodeResponse.data.results[0];
    return await getWeatherByCoordinates(location.latitude, location.longitude, preferences);
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    
    // Return mock data if API fails
    return {
      temperature: 22,
      condition: 'clear',
      description: 'clear sky',
      icon: '☀️',
      humidity: 65,
      windSpeed: 12,
      location: city,
      country: country || 'Unknown'
    };
  }
}

export async function getWeatherByCoordinates(lat: number, lon: number, preferences?: UserPreferences): Promise<WeatherData> {
  try {
    const temperatureUnit = preferences?.temperatureUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = preferences?.measurementSystem === 'imperial' ? 'mph' : 'kmh';
    const precipitationUnit = preferences?.measurementSystem === 'imperial' ? 'inch' : 'mm';

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
        timezone: 'auto',
        temperature_unit: temperatureUnit,
        wind_speed_unit: windSpeedUnit,
        precipitation_unit: precipitationUnit
      }
    });

    const data = response.data;
    const current = data.current;
    const daily = data.daily;
    const location = data.location || { name: 'Unknown', country: 'Unknown' };

    // Get current weather info
    const currentWeather = getWeatherInfo(current.weather_code);
    
    // Process daily forecast
    const dailyForecast: DailyForecast[] = daily.time.map((date: string, index: number) => {
      const weather = getWeatherInfo(daily.weather_code[index]);
      return {
        date,
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        condition: weather.condition,
        icon: weather.icon,
        precipitation: daily.precipitation_sum[index]
      };
    }).slice(0, 7); // Get 7 days

    // Convert temperatures if needed
    let temperature = Math.round(current.temperature_2m);
    let temperatureFahrenheit: number | undefined;

    if (temperatureUnit === 'celsius') {
      temperatureFahrenheit = Math.round(celsiusToFahrenheit(temperature));
    } else {
      temperatureFahrenheit = temperature;
      temperature = Math.round(fahrenheitToCelsius(temperature));
    }

    // Convert wind speed if needed
    let windSpeed = Math.round(current.wind_speed_10m);
    let windSpeedMph: number | undefined;

    if (windSpeedUnit === 'kmh') {
      windSpeedMph = Math.round(kmhToMph(windSpeed));
    } else {
      windSpeedMph = windSpeed;
      windSpeed = Math.round(windSpeed / 0.621371);
    }

    return {
      temperature,
      temperatureFahrenheit,
      condition: currentWeather.condition,
      description: currentWeather.description,
      icon: currentWeather.icon,
      humidity: current.relative_humidity_2m,
      windSpeed,
      windSpeedMph,
      location: location.name,
      country: location.country,
      daily: dailyForecast
    };
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    
    // Return mock data if API fails
    return {
      temperature: 22,
      condition: 'clear',
      description: 'clear sky',
      icon: '☀️',
      humidity: 65,
      windSpeed: 12,
      location: 'Unknown',
      country: 'Unknown',
      daily: [
        {
          date: new Date().toISOString().split('T')[0],
          maxTemp: 25,
          minTemp: 18,
          condition: 'clear',
          icon: '☀️',
          precipitation: 0
        }
      ]
    };
  }
}

// Helper function to get weather icon based on condition
export function getWeatherIcon(condition: string): string {
  const iconMap: { [key: string]: string } = {
    'clear': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'foggy': '🌫️',
    'drizzle': '🌦️',
    'rain': '🌧️',
    'snow': '🌨️',
    'thunderstorm': '⛈️'
  };
  
  return iconMap[condition] || '🌤️';
}

// Helper function to get weather condition name
export function getWeatherConditionName(condition: string): string {
  const conditionMap: { [key: string]: string } = {
    'clear': 'Clear',
    'partly-cloudy': 'Partly Cloudy',
    'cloudy': 'Cloudy',
    'foggy': 'Foggy',
    'drizzle': 'Drizzle',
    'rain': 'Rainy',
    'snow': 'Snowy',
    'thunderstorm': 'Stormy'
  };
  
  return conditionMap[condition] || 'Unknown';
}
