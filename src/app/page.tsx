"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart, Calendar, Clock, MapPin, Users, MessageCircle, X } from "lucide-react";
import { getTimeUntil } from "@/lib/utils";
import { haversineKm, kmToMi } from "@/lib/geo";
import DotWorldMap from "@/components/DotWorldMap";
import TimeOverlay from "@/components/TimeOverlay";
import MapColorSettings from "@/components/MapColorSettings";
import CalendarImport from "@/components/CalendarImport";
import PersonalizedDashboard from "@/components/PersonalizedDashboard";
import PartnerTimeWidget from "@/components/PartnerTimeWidget";

export default function HomePage() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [locationSaved, setLocationSaved] = useState(false);
  const [showMeetupModal, setShowMeetupModal] = useState(false);
  const [meetupForm, setMeetupForm] = useState({
    date: '',
    time: '',
    location: '',
    travelType: 'both', // 'both', 'you', 'partner'
    description: '',
    duration: 1
  });
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: "sunny",
    location: "New York, NY",
    description: "clear sky",
    icon: "☀️",
    humidity: 65,
    windSpeed: 12
  });
  
  // Check if user is authenticated (mock for now)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; email: string } | null>(null);
  const [partner, setPartner] = useState<{ id: string; firstName: string; lastName: string; timezone: string; isAwake: boolean; currentActivity: string } | null>(null);
  
  // Mock data - replace with real data from your backend
  const nextMeetup = useMemo(() => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), []); // 15 days from now
  const partnerTimezone = "America/New_York"; // Mock partner timezone
  const partnerName = "Alex"; // Mock partner name

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
    oceanColor: 'rgba(42,47,58,.55)'
  });

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
      // setPartnerTime(getPartnerCurrentTime(partnerTimezone)); // This line is removed
    }, 1000);

    return () => clearInterval(timer);
  }, [nextMeetup, partnerTimezone]);

  // Fetch weather data for partner's location
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?lat=${partnerLocation.lat}&lon=${partnerLocation.lon}&measurementSystem=imperial&temperatureUnit=fahrenheit&distanceUnit=mi`);
        if (response.ok) {
          const weatherData = await response.json();
          setWeather({
            temperature: weatherData.temperature,
            condition: weatherData.condition,
            location: weatherData.location,
            description: weatherData.description,
            icon: weatherData.icon,
            humidity: weatherData.humidity,
            windSpeed: weatherData.windSpeed
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        // Keep default weather data if API fails
      }
    };

    fetchWeather();
  }, [partnerLocation]);



  const quickActions = [
    {
      icon: MessageCircle,
      title: "Send Message",
      color: "bg-blue-500 hover:bg-blue-600"
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
            key={`map-${userLocation?.lat || homeLocation?.lat}-${userLocation?.lon || homeLocation?.lon}-${partnerLocation.lat}-${partnerLocation.lon}`}
            a={userLocation || homeLocation || { lat: 37.7749, lon: -122.4194 }} // Use current location, then home location, then default
            b={partnerLocation}
            label="mi"
            className="w-full"
            landColor={mapColors.landColor}
            oceanColor={mapColors.oceanColor}
          />
            {/* Map Colors Button - Top Left */}
            <div className="absolute top-2 left-2 z-[10000]">
              <MapColorSettings 
                onColorsChange={setMapColors}
                className="pointer-events-auto"
              />
            </div>
            
            {/* Location Button - Top Right */}
            <div className="absolute top-2 right-2 z-[10000]">
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
            <TimeOverlay 
              position="bottom-4 left-4"
              title="My Time"
              timezone="America/Los_Angeles"
              location={userLocation ? 'Current Location' : (homeLocation ? 'Home Location' : 'San Francisco, USA')}
            />
            
            <TimeOverlay 
              position="bottom-4 right-4"
              title="Alex's Time"
              timezone={partnerTimezone}
              location="New York, USA"
              isPartner={true}
            />
            
            {/* Distance Display - Center Bottom */}
            {partnerLocation && (userLocation || homeLocation) && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[10000] pointer-events-none">
                <div className="bg-transparent backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-center min-w-[120px]">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Distance
                  </div>
                  <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
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
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
              {nextMeetup.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <button
              onClick={() => setShowMeetupModal(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
            >
              Plan Meetup
            </button>
          </div>

          {/* Partner Time Widget */}
          <PartnerTimeWidget 
            partnerName={partnerName}
            partnerTimezone={partnerTimezone}
          />
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
                <span className="text-4xl">{weather.icon}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
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
            
            {/* Calendar Import */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <CalendarImport 
                onImportSuccess={(data) => {
                  console.log('Calendar imported:', data);
                  // Handle calendar import success
                }}
              />
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

      {/* Meetup Planning Modal */}
      {showMeetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Plan Meetup
                </h2>
                <button
                  onClick={() => setShowMeetupModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                // Handle meetup creation here
                console.log('Meetup planned:', meetupForm);
                alert('Meetup planned successfully!');
                setShowMeetupModal(false);
                setMeetupForm({
                  date: '',
                  time: '',
                  location: '',
                  travelType: 'both',
                  description: '',
                  duration: 1
                });
              }}>
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={meetupForm.date}
                    onChange={(e) => setMeetupForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={meetupForm.time}
                    onChange={(e) => setMeetupForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={meetupForm.location}
                    onChange={(e) => setMeetupForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country or specific venue"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Travel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Who is traveling?
                  </label>
                  <select
                    value={meetupForm.travelType}
                    onChange={(e) => setMeetupForm(prev => ({ ...prev, travelType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="both">Both partners</option>
                    <option value="you">You travel to partner</option>
                    <option value="partner">Partner travels to you</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={meetupForm.duration}
                    onChange={(e) => setMeetupForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={meetupForm.description}
                    onChange={(e) => setMeetupForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What are your plans? Any special activities?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMeetupModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Plan Meetup
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
