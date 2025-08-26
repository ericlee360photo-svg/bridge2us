"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart, Calendar, Clock, MapPin, Users, Cloud, Sun, CloudRain, CloudSnow, MessageCircle, Video } from "lucide-react";
import { getTimeUntil, getPartnerCurrentTime, formatInTimezone } from "@/lib/utils";
import DotWorldMap from "@/components/DotWorldMap";
import TimeOverlay from "@/components/TimeOverlay";
import MapColorSettings from "@/components/MapColorSettings";
import PersonalizedDashboard from "@/components/PersonalizedDashboard";

export default function HomePage() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [partnerTime, setPartnerTime] = useState(new Date());
  const [locationSaved, setLocationSaved] = useState(false);
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: "sunny",
    location: "New York, NY"
  });
  
  // Check if user is authenticated (mock for now)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  
  // Mock data - replace with real data from your backend
  const nextMeetup = useMemo(() => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), []); // 15 days from now
  const partnerTimezone = "America/New_York"; // Mock partner timezone
  const partnerName = "Alex"; // Mock partner name

  // User location state
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [partnerLocation, setPartnerLocation] = useState<{lat: number, lon: number}>({
    lat: 40.7128, // New York (partner's location)
    lon: -74.0060
  });

  // Map colors state
  const [mapColors, setMapColors] = useState({
    landColor: '#cfd6ff',
    oceanColor: 'rgba(42,47,58,.55)'
  });

  // Load saved user location or home location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedHome = localStorage.getItem('homeLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    } else if (savedHome) {
      setUserLocation(JSON.parse(savedHome));
    }
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    // Mock authentication check - replace with real auth logic
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Mock partner data - replace with real partner fetch
      setPartner({
        id: "2",
        firstName: "Alex",
        lastName: "Smith",
        timezone: "America/New_York",
        isAwake: true,
        currentActivity: "Working"
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntil(nextMeetup));
      setPartnerTime(getPartnerCurrentTime(partnerTimezone));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextMeetup, partnerTimezone]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-6 h-6 text-blue-300" />;
      default:
        return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Send Message",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Video,
      title: "Video Call",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Calendar,
      title: "Add Event",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: MapPin,
      title: "Plan Meetup",
      color: "bg-pink-500 hover:bg-pink-600"
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Calendar",
      description: "Sync schedules",
      href: "/calendar"
    },
    {
      icon: Clock,
      title: "Time Zones",
      description: "Partner time",
      href: "/timezone"
    },
    {
      icon: MapPin,
      title: "Meetups",
      description: "Plan reunions",
      href: "/meetups"
    },
    {
      icon: Users,
      title: "Profile",
      description: "Settings",
      href: "/profile"
    }
  ];

  // If user is authenticated, show personalized dashboard
  if (isAuthenticated && user) {
    return <PersonalizedDashboard user={user} partner={partner} />;
  }

  // Public homepage for non-authenticated users
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="text-center mb-6">
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
        <div className="mb-6">
          <div className="relative">
                      <DotWorldMap 
            a={userLocation || { lat: 37.7749, lon: -122.4194 }} // Use saved location or default to SF
            b={partnerLocation}
            label="both"
            className="w-full"
            landColor={mapColors.landColor}
            oceanColor={mapColors.oceanColor}
          />
            {/* Floating buttons (inside map container) */}
            <div className="absolute top-2 right-2 z-[10000] flex gap-2">
              <MapColorSettings 
                onColorsChange={setMapColors}
                className="pointer-events-auto"
              />
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
                        alert('Unable to get your location. Please check your browser settings.');
                      }
                    );
                  } else {
                    alert('Geolocation is not supported by your browser.');
                  }
                }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-2 py-1.5 rounded-md shadow-md transition-colors pointer-events-auto text-sm"
              >
                {locationSaved ? 'Saved ✓' : (userLocation ? 'Update Location' : 'Use Current Location')}
              </button>
            </div>
            
            {/* Time Overlays */}
            <TimeOverlay 
              position="bottom-4 left-4"
              title="My Time"
              timezone="America/Los_Angeles"
              location={userLocation ? 'Current Location, Country' : 'San Francisco, USA'}
            />
            
            <TimeOverlay 
              position="bottom-4 right-4"
              title="Alex's Time"
              timezone={partnerTimezone}
              location="New York, USA"
              isPartner={true}
            />
          </div>
        </div>

        {/* Top Row - Countdown and Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Countdown Widget */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Next Meetup
            </h2>
            <div className="flex items-center justify-center gap-1 mb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-pink-500">
                  {countdown.days.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">D</div>
              </div>
              <div className="text-xl font-bold text-gray-400">:</div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-500">
                  {countdown.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">H</div>
              </div>
              <div className="text-xl font-bold text-gray-400">:</div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-500">
                  {countdown.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">M</div>
              </div>
              <div className="text-xl font-bold text-gray-400">:</div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-500">
                  {countdown.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">S</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              {nextMeetup.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Partner Time Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {partnerName}&apos;s Time
            </h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                {formatInTimezone(partnerTime, partnerTimezone, "HH:mm")}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {formatInTimezone(partnerTime, partnerTimezone, "MMM d")}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {partnerTimezone.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Weather and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Weather Widget */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  {partnerName}&apos;s Weather
                </h2>
                <div className="text-2xl font-bold mb-1">
                  {weather.temperature}°F
                </div>
                <div className="text-sm opacity-90">
                  {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  {weather.location}
                </div>
              </div>
              <div>
                {getWeatherIcon(weather.condition)}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className={`${action.color} text-white rounded-lg p-3 flex items-center gap-2 transition-colors`}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row - Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <feature.icon className="w-6 h-6 text-pink-500 mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Fourth Row - Stats and Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Relationship Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Relationship Stats
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Days together:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">365</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Meetups:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Messages:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">1,247</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Recent Activity
            </h2>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                • Last message: 2 hours ago
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                • Video call: Yesterday
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                • Event added: 3 days ago
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Upcoming Events
            </h2>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="font-medium text-gray-800 dark:text-gray-200">Date Night</div>
                <div className="text-gray-600 dark:text-gray-300">Tomorrow, 8 PM</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-800 dark:text-gray-200">Weekend Trip</div>
                <div className="text-gray-600 dark:text-gray-300">Next week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
