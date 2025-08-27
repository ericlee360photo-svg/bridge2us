// Weather API caching to prevent excessive API calls
// Caches weather data for 10 minutes to reduce API usage

interface WeatherData {
  temperature: number;
  temperatureFahrenheit: number;
  condition: string;
  location: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windSpeedMph: number;
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    icon: string;
    precipitation: number;
  }>;
}

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
  location: string;
}

class WeatherCache {
  private cache = new Map<string, CachedWeather>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private generateKey(lat: number, lon: number, units: string): string {
    return `${lat.toFixed(4)},${lon.toFixed(4)},${units}`;
  }

  get(lat: number, lon: number, units: string): WeatherData | null {
    const key = this.generateKey(lat, lon, units);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    console.log(`Weather cache hit for ${cached.location}`);
    return cached.data;
  }

  set(lat: number, lon: number, units: string, data: WeatherData, location: string): void {
    const key = this.generateKey(lat, lon, units);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      location
    });
    console.log(`Weather cached for ${location} (${units})`);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache status for debugging
  getStatus(): Array<{key: string, location: string, age: number}> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, cached]) => ({
      key,
      location: cached.location,
      age: Math.round((now - cached.timestamp) / 1000) // age in seconds
    }));
  }
}

export const weatherCache = new WeatherCache();
