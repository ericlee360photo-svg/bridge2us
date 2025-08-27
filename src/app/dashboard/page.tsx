"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart, Settings } from "lucide-react";
import { getTimeUntil, getTimezoneDifference } from "@/lib/utils";
import { haversineKm, kmToMi } from "@/lib/geo";
import DotWorldMap from "@/components/DotWorldMap";
import TimeOverlay from "@/components/TimeOverlay";
import MapColorSettings from "@/components/MapColorSettings";

import SpotifyIntegration from "@/components/SpotifyIntegration";
import SpotifyActivity from "@/components/SpotifyActivity";
import SpotifyPlaylists from "@/components/SpotifyPlaylists";
import TwoVerticalBars from "@/sharedschedule/TwoVerticalBars";
import SharedJournal from "@/components/SharedJournal";
import type { PartnerSchedule } from "@/sharedschedule/types";
import { getZodiacSign, getDailyHoroscope, formatZodiacDisplay, type DailyHoroscope } from "@/lib/horoscope";
import HoroscopeSettings from "@/components/HoroscopeSettings";
import { weatherCache } from "@/lib/weatherCache";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [locationSaved, setLocationSaved] = useState(false);


  const [weather, setWeather] = useState({
    temperature: 72,
    temperatureFahrenheit: 72,
    condition: "sunny",
    location: "New York, NY",
    description: "clear sky",
    icon: "☀️",
    humidity: 65,
    windSpeed: 12,
    windSpeedMph: 7.5,
    daily: [] as Array<{
      date: string;
      maxTemp: number;
      minTemp: number;
      condition: string;
      icon: string;
      precipitation: number;
    }>
  });
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; email: string; timezone: string } | null>(null);
  const [partner, setPartner] = useState<{ id: string; firstName: string; lastName: string; timezone: string; isAwake: boolean; currentActivity: string; birthday?: Date } | null>(null);
  const [partnerMood, setPartnerMood] = useState<string | null>(null);
  const [dailyTasks, setDailyTasks] = useState({
    userCompleted: 0,
    partnerCompleted: 3, // Demo data for partner
    totalTasks: 5
  });
  const [partnerHoroscope, setPartnerHoroscope] = useState<DailyHoroscope | null>(null);
  const [horoscopeSettings, setHoroscopeSettings] = useState({
    showHoroscope: true,
    shareHoroscope: true
  });
  const [relationshipStats] = useState({
    daysTogether: 365,
    meetups: 8,
    messages: 1247
  });
  const [recentActivity] = useState([
    'Last message: 2 hours ago',
    'Event added: 3 days ago'
  ]);
  const [upcomingEvents] = useState([
    { name: 'Date Night', time: 'Tomorrow, 8 PM' },
    { name: 'Weekend Trip', time: 'Next week' }
  ]);
  const [showHoroscopeSettings, setShowHoroscopeSettings] = useState(false);
  
  // Mock data - replace with real data from your backend
  const nextMeetup = useMemo(() => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), []); // 15 days from now
  const partnerTimezone = "America/New_York"; // Mock partner timezone
  const partnerName = "Alex"; // Mock partner name

  // Demo schedule data
  const demoUserSchedule: PartnerSchedule = {
    name: "You",
    tz: "America/Los_Angeles",
    blocks: [
      { startMin: 0, endMin: 420, kind: 'sleep' },     // 12am-7am sleep
      { startMin: 540, endMin: 1020, kind: 'work' },   // 9am-5pm work  
      { startMin: 1080, endMin: 1140, kind: 'gym' },   // 6pm-7pm gym
      { startMin: 1320, endMin: 1440, kind: 'sleep' }  // 10pm-12am sleep
    ]
  };

  const demoPartnerSchedule: PartnerSchedule = {
    name: "Alex", 
    tz: "America/New_York",
    blocks: [
      { startMin: 0, endMin: 480, kind: 'sleep' },     // 12am-8am sleep
      { startMin: 570, endMin: 1050, kind: 'work' },   // 9:30am-5:30pm work
      { startMin: 1110, endMin: 1170, kind: 'gym' },   // 6:30pm-7:30pm gym  
      { startMin: 1380, endMin: 1440, kind: 'sleep' }  // 11pm-12am sleep
    ]
  };

  // User location state
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [homeLocation, setHomeLocation] = useState<{lat: number, lon: number} | null>(null);
  const [partnerLocation] = useState<{lat: number, lon: number}>({
    lat: 40.7128, // New York (partner's location)
    lon: -74.0060
  });

  // Map colors state
  const [mapColors, setMapColors] = useState({
    landColor: '#cfd6ff',
    oceanColor: 'rgba(42,47,58,.55)',
    backgroundColor: '#0f1115',
    textColor: '#3b82f6'
  });

  // Map container ref for overlay positioning
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/signup');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Mock partner data - replace with real partner fetch
    const partnerData = {
      id: "2",
      firstName: "Alex",
      lastName: "Smith",
      timezone: "America/New_York",
      isAwake: true,
      currentActivity: "Working",
      birthday: new Date(1995, 6, 15) // July 15, 1995 (Cancer)
    };
    setPartner(partnerData);

    // Load horoscope settings
    const savedHoroscopeSettings = localStorage.getItem('horoscopeSettings');
    if (savedHoroscopeSettings) {
      try {
        setHoroscopeSettings(JSON.parse(savedHoroscopeSettings));
      } catch (e) {
        console.error('Error parsing horoscope settings:', e);
      }
    }

    // Fetch partner's horoscope if birthday is available and settings allow
    if (partnerData.birthday) {
      const zodiacSign = getZodiacSign(partnerData.birthday);
      getDailyHoroscope(zodiacSign).then(horoscope => {
        setPartnerHoroscope(horoscope);
      }).catch(error => {
        console.error('Error fetching horoscope:', error);
      });
    }
  }, [router]);

  // Load saved user location and home location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedHome = localStorage.getItem('homeLocation');
    
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    }
    
    if (savedHome) {
      setHomeLocation(JSON.parse(savedHome));
    } else {
      // Set default home location if none exists
      const defaultHome = { lat: 37.7749, lon: -122.4194 }; // San Francisco
      setHomeLocation(defaultHome);
      localStorage.setItem('homeLocation', JSON.stringify(defaultHome));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntil(nextMeetup));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextMeetup, partnerTimezone]);

  // Fetch weather data for partner's location (once per hour when online)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Check if user is online
        if (!navigator.onLine) {
          console.log('User is offline, skipping weather fetch');
          return;
        }

        // Check cache for existing weather data
        const cachedWeather = localStorage.getItem('weatherCache');
        const cacheTime = localStorage.getItem('weatherCacheTime');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

        // If we have cached data and it's less than 1 hour old, use it
        if (cachedWeather && cacheTime && (now - parseInt(cacheTime)) < oneHour) {
          const weatherData = JSON.parse(cachedWeather);
          setWeather(weatherData);
          console.log('Using cached weather data');
          return;
        }

        // Get user preferences from localStorage or use defaults
        const userData = localStorage.getItem('user');
        const userPreferences = userData ? JSON.parse(userData) : {};
        const measurementSystem = userPreferences.measurementSystem || 'imperial';
        const temperatureUnit = userPreferences.temperatureUnit || 'fahrenheit';
        const distanceUnit = userPreferences.distanceUnit || 'mi';
        
        const response = await fetch(`/api/weather?lat=${partnerLocation.lat}&lon=${partnerLocation.lon}&measurementSystem=${measurementSystem}&temperatureUnit=${temperatureUnit}&distanceUnit=${distanceUnit}`);
        if (response.ok) {
          const weatherData = await response.json();
          const newWeatherData = {
            temperature: weatherData.temperature,
            temperatureFahrenheit: weatherData.temperatureFahrenheit || weatherData.temperature,
            condition: weatherData.condition,
            location: weatherData.location,
            description: weatherData.description,
            icon: weatherData.icon,
            humidity: weatherData.humidity,
            windSpeed: weatherData.windSpeed,
            windSpeedMph: weatherData.windSpeedMph || weatherData.windSpeed,
            daily: weatherData.daily || []
          };
          
          // Cache the new weather data
          localStorage.setItem('weatherCache', JSON.stringify(newWeatherData));
          localStorage.setItem('weatherCacheTime', now.toString());
          
          setWeather(newWeatherData);
          console.log('Fetched fresh weather data');
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        // Try to use cached data if available, even if expired
        const cachedWeather = localStorage.getItem('weatherCache');
        if (cachedWeather) {
          setWeather(JSON.parse(cachedWeather));
          console.log('Using expired cached weather data due to API error');
        }
      }
    };

    fetchWeather();
  }, [partnerLocation]);



  // If not authenticated, show loading
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-pink-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Bridge2Us
          </h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Bridging the distance, one moment at a time
        </p>
      </header>

      {/* Main Dashboard Grid */}
      <div className="max-w-6xl mx-auto">
        {/* World Map - Full Width */}
        <div className="mb-4 sm:mb-6">
          <div ref={mapContainerRef} className="relative w-full" style={{ minHeight: '400px' }}>
            <DotWorldMap 
              key={`map-${userLocation?.lat || homeLocation?.lat}-${userLocation?.lon || homeLocation?.lon}-${partnerLocation.lat}-${partnerLocation.lon}`}
              a={userLocation || homeLocation || { lat: 37.7749, lon: -122.4194 }} // Use current location, then home location, then default
              b={partnerLocation}
              label="mi"
              className="w-full"
              landColor={mapColors.landColor}
              oceanColor={mapColors.oceanColor}
              backgroundColor={mapColors.backgroundColor}
              textColor={mapColors.textColor}
            />
            
            {/* Map Overlays - Positioned relative to map container */}
            <div 
              key="map-overlays"
              className="absolute inset-0 pointer-events-none" 
              style={{ zIndex: 10000 }}
            >
              {/* Map Colors Button - Top Left */}
              <div className="absolute top-2 left-2 pointer-events-auto">
                <MapColorSettings 
                  onColorsChange={setMapColors}
                  className="pointer-events-auto"
                />
              </div>
              
              {/* Location Button - Top Right */}
              <div className="absolute top-2 right-2 pointer-events-auto">
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          const newLocation = { lat: latitude, lon: longitude };
                          localStorage.setItem('userLocation', JSON.stringify(newLocation));
                          setUserLocation(newLocation);
                          setLocationSaved(true);
                          window.setTimeout(() => setLocationSaved(false), 1800);
                        },
                        (error) => {
                          console.error('Error getting location:', error);
                          let errorMessage = 'Unable to get your location. ';
                          
                          switch (error.code) {
                            case error.PERMISSION_DENIED:
                              errorMessage += 'Location permission was denied. Please allow location access in your browser settings.';
                              break;
                            case error.POSITION_UNAVAILABLE:
                              errorMessage += 'Location information is unavailable. Please try again.';
                              break;
                            case error.TIMEOUT:
                              errorMessage += 'Location request timed out. Please try again.';
                              break;
                            default:
                              errorMessage += 'Please check your browser settings and try again.';
                          }
                          
                          alert(errorMessage);
                        },
                        {
                          enableHighAccuracy: true,
                          timeout: 10000,
                          maximumAge: 60000
                        }
                      );
                    } else {
                      alert('Geolocation is not supported by your browser.');
                    }
                  }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-2 py-1.5 rounded-md shadow-md transition-colors pointer-events-auto text-sm"
                >
                  {locationSaved ? 'Saved ✓' : (userLocation ? 'Update Location' : 'Set Current Location')}
                </button>
              </div>
              
              {/* Time Overlays */}
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <TimeOverlay 
                  position=""
                  title="My Time"
                  timezone={user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                  location={userLocation ? 'Current Location' : (homeLocation ? 'Home Location' : 'San Francisco, USA')}
                  textColor={mapColors.textColor}
                />
              </div>
              
              <div className="absolute bottom-2 right-2 pointer-events-none">
                <TimeOverlay 
                  position=""
                  title={`${partner?.firstName || 'Partner'}'s Time`}
                  timezone={partner?.timezone || partnerTimezone}
                  location="New York, USA"
                  isPartner={true}
                  textColor={mapColors.textColor}
                />
              </div>
              
              {/* Countdown Clock - Top Center */}
              <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none" style={{ top: '8px' }}>
                <div 
                  style={{
                    background: 'transparent',
                    height: '8px',
                    textAlign: 'center',
                    minWidth: '200px'
                  }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: mapColors.textColor }}>
                        {countdown.days.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs" style={{ color: mapColors.textColor }}>D</div>
                    </div>
                    <div className="text-lg font-bold" style={{ color: mapColors.textColor }}>:</div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: mapColors.textColor }}>
                        {countdown.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs" style={{ color: mapColors.textColor }}>H</div>
                    </div>
                    <div className="text-lg font-bold" style={{ color: mapColors.textColor }}>:</div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: mapColors.textColor }}>
                        {countdown.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs" style={{ color: mapColors.textColor }}>M</div>
                    </div>
                    <div className="text-lg font-bold" style={{ color: mapColors.textColor }}>:</div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: mapColors.textColor }}>
                        {countdown.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs" style={{ color: mapColors.textColor }}>S</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distance Display - Center Bottom */}
              {partnerLocation && (userLocation || homeLocation) && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  <div 
                    style={{
                      background: 'transparent',
                      textAlign: 'center',
                      minWidth: '120px'
                    }}
                    className="text-center min-w-[120px]"
                  >
                    <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: mapColors.textColor }}>
                      Distance
                    </div>
                    <div className="text-xl font-bold" style={{ color: mapColors.textColor }}>
                      {(() => {
                        const userCoords = userLocation || homeLocation;
                        const distance = Math.round(kmToMi(haversineKm([userCoords!.lon, userCoords!.lat], [partnerLocation.lon, partnerLocation.lat])));
                        return `${distance.toLocaleString()} mi`;
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Task Progress Bars */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Daily Tasks
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete tasks to earn 10 tokens each
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{(dailyTasks.userCompleted + dailyTasks.partnerCompleted) * 10}</div>
                <div className="text-xs text-gray-500">total tokens</div>
              </div>
            </div>
            
            {/* User Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Y</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {dailyTasks.userCompleted} / {dailyTasks.totalTasks} completed
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dailyTasks.userCompleted / dailyTasks.totalTasks) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{Math.round((dailyTasks.userCompleted / dailyTasks.totalTasks) * 100)}%</div>
            </div>
            
            {/* Partner Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{partner?.firstName || partnerName}&apos;s Progress</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {dailyTasks.partnerCompleted} / {dailyTasks.totalTasks} completed
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dailyTasks.partnerCompleted / dailyTasks.totalTasks) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{Math.round((dailyTasks.partnerCompleted / dailyTasks.totalTasks) * 100)}%</div>
            </div>
            
            {/* Progress Markers */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
              {/* Checkmarks at 20% intervals */}
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mb-1">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {(i + 1) * 20}%
                  </div>
                </div>
              ))}
              
              {/* Trophy at the end */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center mb-1">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  100%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Enhanced Partner Profile and Shared Journal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Enhanced Partner Profile Widget with Weather & Horoscope */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <h2 className="text-lg font-semibold mb-3">
              {partner?.firstName || partnerName}&apos;s Profile
            </h2>
            
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {(partner?.firstName || partnerName).charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    {partner?.firstName || partnerName} {partner?.lastName || ''}
                  </div>
                  <div className="text-sm opacity-90">
                    New York, NY
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {partner?.timezone || 'America/New_York'}
                  </div>
                  {partnerMood && (
                    <div className="text-sm opacity-90 mt-1 flex items-center space-x-1">
                      <span>Feeling</span>
                      <span className="font-semibold capitalize">
                        {partnerMood === 'missing' ? 'Missing You' : 
                         partnerMood === 'grateful' ? 'Grateful' :
                         partnerMood === 'hopeful' ? 'Hopeful' :
                         partnerMood === 'lonely' ? 'Lonely' :
                         partnerMood}
                      </span>
                      <span>today</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status & Last Seen (moved above divider) */}
              <div className="text-right text-xs">
                <div className="opacity-75">Status</div>
                <div className="font-semibold text-sm">Online</div>
                <div className="opacity-75 mt-1">Last Seen</div>
                <div className="font-semibold text-sm">2 min ago</div>
              </div>
            </div>

            <div className="border-t border-white border-opacity-20 pt-3">
              {/* Weather Section */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm opacity-90 mb-1">Current Weather</div>
                  <div className="text-xl font-bold">
                    {(() => {
                      const userData = localStorage.getItem('user');
                      const userPreferences = userData ? JSON.parse(userData) : {};
                      const temperatureUnit = userPreferences.temperatureUnit || 'fahrenheit';
                      return temperatureUnit === 'fahrenheit' ? 
                        `${weather.temperatureFahrenheit}°F` : 
                        `${weather.temperature}°C`;
                    })()}
                  </div>
                  <div className="text-xs opacity-75">
                    {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
                  </div>
                  {weather.daily.length > 0 && (
                    <div className="text-xs opacity-75 mt-1">
                      H: {(() => {
                        const userData = localStorage.getItem('user');
                        const userPreferences = userData ? JSON.parse(userData) : {};
                        const temperatureUnit = userPreferences.temperatureUnit || 'fahrenheit';
                        const todayWeather = weather.daily[0];
                        if (temperatureUnit === 'fahrenheit') {
                          return `${Math.round(todayWeather.maxTemp * 9/5 + 32)}°`;
                        }
                        return `${Math.round(todayWeather.maxTemp)}°`;
                      })()} L: {(() => {
                        const userData = localStorage.getItem('user');
                        const userPreferences = userData ? JSON.parse(userData) : {};
                        const temperatureUnit = userPreferences.temperatureUnit || 'fahrenheit';
                        const todayWeather = weather.daily[0];
                        if (temperatureUnit === 'fahrenheit') {
                          return `${Math.round(todayWeather.minTemp * 9/5 + 32)}°`;
                        }
                        return `${Math.round(todayWeather.minTemp)}°`;
                      })()}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-3xl">{weather.icon}</span>
                  <div className="text-xs opacity-75 mt-1">
                    H: {weather.humidity}% | W: {(() => {
                      const userData = localStorage.getItem('user');
                      const userPreferences = userData ? JSON.parse(userData) : {};
                      const measurementSystem = userPreferences.measurementSystem || 'imperial';
                      return measurementSystem === 'imperial' ? 
                        `${weather.windSpeedMph} mph` : 
                        `${weather.windSpeed} km/h`;
                    })()}
                  </div>
                </div>
              </div>

              {/* Horoscope Section */}
              {partner?.birthday && horoscopeSettings.showHoroscope && horoscopeSettings.shareHoroscope && (
                <div className="border-t border-white border-opacity-20 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90 mb-1">Today's Horoscope</div>
                      <div className="text-lg font-bold">
                        {(() => {
                          const zodiacSign = getZodiacSign(partner.birthday);
                          return formatZodiacDisplay(zodiacSign);
                        })()}
                      </div>
                      <div className="text-xs opacity-75 mt-1 max-w-sm leading-relaxed">
                        {partnerHoroscope ? 
                          partnerHoroscope.horoscope :
                          'Loading horoscope...'
                        }
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      {partnerHoroscope && (
                        <div>
                          <div className="opacity-75">Lucky #</div>
                          <div className="font-bold text-sm">{partnerHoroscope.luckyNumber || 'N/A'}</div>
                          <div className="opacity-75 mt-1">Element</div>
                          <div className="font-bold text-sm">
                            {(() => {
                              const zodiacSign = getZodiacSign(partner.birthday);
                              return zodiacSign.element;
                            })()}
                          </div>
                          {partnerHoroscope.mood && (
                            <>
                              <div className="opacity-75 mt-1">Mood</div>
                              <div className="font-bold text-sm capitalize">{partnerHoroscope.mood}</div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shared Journal Widget */}
          <SharedJournal
            currentUserId={user?.id || 'user-default'}
            currentUserName={user?.firstName || 'You'}
            partnerId={partner?.id || 'partner-default'}
            partnerName={partner?.firstName || partnerName}
            onPartnerMoodUpdate={setPartnerMood}
            onJournalEntryCreated={(userId) => {
              // Update daily task progress when user creates a journal entry
              if (userId === (user?.id || 'user-default')) {
                setDailyTasks(prev => ({
                  ...prev,
                  userCompleted: Math.min(prev.userCompleted + 1, prev.totalTasks)
                }));
              }
            }}
          />
        </div>

        {/* Third Row - Synced Schedule and Spotify */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
          {/* Synced Schedule Widget */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
            <h2 className="text-lg font-semibold mb-3">
              Synced Schedule
            </h2>
            
            {/* Timezone Info */}
            <div className="text-xs mb-2 opacity-80">
              {(() => {
                const userTimezone = user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                const partnerTz = partner?.timezone || partnerTimezone;
                const timezoneDiff = getTimezoneDifference(partnerTz, userTimezone);
                const diffHours = Math.abs(timezoneDiff.hours);
                const diffDirection = timezoneDiff.hours > 0 ? 'ahead' : 'behind';
                return `${partner?.firstName || partnerName} is ${diffHours}h ${diffDirection}`;
              })()}
            </div>
            
            {/* TwoVerticalBars Component - Fixed Container */}
            <div className="h-56 rounded-lg" style={{ minHeight: '220px' }}>
              <TwoVerticalBars 
                date={new Date()}
                partnerA={demoUserSchedule}
                partnerB={demoPartnerSchedule}
                barHeight={200}
                aLoc={{ lat: 34.0522, lon: -118.2437 }}   // Los Angeles
                bLoc={{ lat: 40.7128, lon: -74.0060 }}   // New York
              />
            </div>
          </div>

          {/* Spotify Widget - Compact */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
            <h2 className="text-lg font-semibold mb-3">
              {partner?.firstName || partnerName}&apos;s Music
            </h2>
            
            {/* Spotify Integration - Compact */}
            <div className="mb-3">
              <SpotifyIntegration 
                userId={user?.id || 'user-default'}
                onConnect={() => {
                  console.log('Spotify connected');
                }}
                onDisconnect={() => {
                  console.log('Spotify disconnected');
                }}
              />
            </div>

            {/* Currently Playing - Compact */}
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-2 opacity-90">Currently Playing</h3>
              <SpotifyActivity 
                userId={partner?.id || 'partner-default'}
                partnerName={partner?.firstName || partnerName}
              />
            </div>

            {/* Playlists - Compact */}
            <div>
              <h3 className="text-sm font-medium mb-2 opacity-90">Playlists</h3>
              <SpotifyPlaylists 
                userId={partner?.id || 'partner-default'}
                partnerName={partner?.firstName || partnerName}
              />
            </div>
          </div>
        </div>



        {/* Fourth Row - User Profile Widget */}
        <div className="grid grid-cols-1 gap-4">
          {/* User Profile Widget with Stats */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                Your Profile
              </h2>
              <button
                onClick={() => setShowHoroscopeSettings(true)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Horoscope Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {(user?.firstName || 'You').charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    {user?.firstName || 'You'} {user?.lastName || ''}
                  </div>
                  <div className="text-sm opacity-90">
                    {user?.email || 'user@example.com'}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </div>
                </div>
              </div>
              
              {/* Relationship Stats (moved from widget) */}
              <div className="text-right text-xs">
                <div className="opacity-75">Days Together</div>
                <div className="font-semibold text-lg">{relationshipStats.daysTogether}</div>
                <div className="opacity-75 mt-1">Meetups</div>
                <div className="font-semibold text-sm">{relationshipStats.meetups}</div>
              </div>
            </div>

            <div className="border-t border-white border-opacity-20 pt-3">
              {/* Recent Activity Section */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm opacity-90 mb-1">Recent Activity</div>
                  <div className="space-y-1">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="text-xs opacity-75">
                        • {activity}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs opacity-75 mt-2">
                    Messages sent: {relationshipStats.messages.toLocaleString()}
                  </div>
                </div>
                
                {/* Upcoming Events Section */}
                <div className="text-right text-xs">
                  <div className="opacity-90 mb-1 text-sm">Upcoming Events</div>
                  <div className="space-y-2">
                    {upcomingEvents.map((event, index) => (
                      <div key={index}>
                        <div className="font-bold text-sm">{event.name}</div>
                        <div className="opacity-75">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horoscope Settings Modal */}
        <HoroscopeSettings
          isOpen={showHoroscopeSettings}
          onClose={() => setShowHoroscopeSettings(false)}
          settings={horoscopeSettings}
          onSettingsChange={(newSettings) => {
            setHoroscopeSettings(newSettings);
            // Re-fetch horoscope if settings changed and partner has birthday
            if (newSettings.showHoroscope && newSettings.shareHoroscope && partner?.birthday) {
              const zodiacSign = getZodiacSign(partner.birthday);
              getDailyHoroscope(zodiacSign).then(horoscope => {
                setPartnerHoroscope(horoscope);
              }).catch(error => {
                console.error('Error fetching horoscope:', error);
              });
            }
          }}
        />
      </div>
      </div>
    </ErrorBoundary>
  );
}
