"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart, Settings, Grid, User, Music, Star, Calendar, FileText, Shield, Trash2, Save, Eye, EyeOff, AlertTriangle, ChevronDown, X } from "lucide-react";
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
import LayoutEditor, { type WidgetConfig } from "@/components/LayoutEditor";
import { DataStorage } from "@/lib/storage";
import Link from "next/link";

interface UserSettings {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  timezone: string;
  country: string;
  language: string;
  
  // Preferences
  timeFormat: string;
  measurementSystem: string;
  temperatureUnit: string;
  distanceUnit: string;
  
  // Sharing Settings
  spotifySharing: boolean;
  horoscopeSharing: boolean;
  showHoroscope: boolean;
  shareHoroscope: boolean;
  
  // Weekly Schedule
  weeklySchedule: {
    [key: string]: {
      wakeUpTime: string;
      bedTime: string;
      workStartTime: string;
      workEndTime: string;
      gymTime: string;
      schoolTime: string;
    };
  };
}

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
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; email: string; timezone: string; country?: string; language?: string } | null>(null);
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
  
  // User Settings Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userSettingsTab, setUserSettingsTab] = useState('personal');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // User Settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    country: 'US',
    language: 'en',
    timeFormat: '12h',
    measurementSystem: 'imperial',
    temperatureUnit: 'F',
    distanceUnit: 'mi',
    spotifySharing: true,
    horoscopeSharing: true,
    showHoroscope: true,
    shareHoroscope: true,
    weeklySchedule: {
      monday: { wakeUpTime: '07:00', bedTime: '23:00', workStartTime: '09:00', workEndTime: '17:00', gymTime: '18:00', schoolTime: '08:00' },
      tuesday: { wakeUpTime: '07:00', bedTime: '23:00', workStartTime: '09:00', workEndTime: '17:00', gymTime: '18:00', schoolTime: '08:00' },
      wednesday: { wakeUpTime: '07:00', bedTime: '23:00', workStartTime: '09:00', workEndTime: '17:00', gymTime: '18:00', schoolTime: '08:00' },
      thursday: { wakeUpTime: '07:00', bedTime: '23:00', workStartTime: '09:00', workEndTime: '17:00', gymTime: '18:00', schoolTime: '08:00' },
      friday: { wakeUpTime: '07:00', bedTime: '23:00', workStartTime: '09:00', workEndTime: '17:00', gymTime: '18:00', schoolTime: '08:00' },
      saturday: { wakeUpTime: '08:00', bedTime: '24:00', workStartTime: '', workEndTime: '', gymTime: '10:00', schoolTime: '' },
      sunday: { wakeUpTime: '09:00', bedTime: '23:00', workStartTime: '', workEndTime: '', gymTime: '', schoolTime: '' }
    }
  });
  
  // Layout Editor State
  const [isLayoutEditorOpen, setIsLayoutEditorOpen] = useState(false);
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>([
    { 
      id: 'world-map', 
      type: 'World Map', 
      x: 0, 
      y: 0, 
      width: 800, 
      height: 400, 
      isStatic: true,
      minWidth: 600,
      minHeight: 300
    },
    { 
      id: 'progress-bars', 
      type: 'Progress Bars', 
      x: 0, 
      y: 420, 
      width: 800, 
      height: 120, 
      isStatic: true,
      minWidth: 600,
      minHeight: 100
    },
    { 
      id: 'partner-profile', 
      type: 'Partner Profile', 
      x: 820, 
      y: 0, 
      width: 400, 
      height: 300,
      minWidth: 300,
      maxWidth: 600,
      minHeight: 250,
      maxHeight: 400
    },
    { 
      id: 'shared-journal', 
      type: 'Shared Journal', 
      x: 0, 
      y: 560, 
      width: 400, 
      height: 350,
      minWidth: 300,
      maxWidth: 500,
      minHeight: 300,
      maxHeight: 500
    },
    { 
      id: 'schedule', 
      type: 'Synced Schedule', 
      x: 420, 
      y: 560, 
      width: 400, 
      height: 350,
      minWidth: 350,
      maxWidth: 600,
      minHeight: 300,
      maxHeight: 500
    },
    { 
      id: 'spotify', 
      type: 'Spotify', 
      x: 820, 
      y: 320, 
      width: 400, 
      height: 300,
      minWidth: 300,
      maxWidth: 500,
      minHeight: 250,
      maxHeight: 400
    }
  ]);
  
  // Layout Editor Functions
  const handleLayoutChange = (newWidgets: WidgetConfig[]) => {
    setWidgetConfigs(newWidgets);
  };

  const saveLayout = async () => {
    // Save layout using DataStorage
    await DataStorage.setData('dashboardLayout', widgetConfigs);
    setIsLayoutEditorOpen(false);
    // Remove the alert and just close the editor
  };

  const cancelLayoutEdit = async () => {
    // Revert to saved layout
    const savedLayout = await DataStorage.getData('dashboardLayout');
    if (savedLayout) {
      setWidgetConfigs(savedLayout);
    }
    setIsLayoutEditorOpen(false);
  };

  // Helper function to get widget config by id
  const getWidgetConfig = (id: string) => {
    return widgetConfigs.find(w => w.id === id) || { x: 0, y: 0, width: 400, height: 300 };
  };

  // Function to render widgets based on layout configuration
  const renderWidget = (widgetId: string) => {
    const config = getWidgetConfig(widgetId);
    const baseStyle = isLayoutEditorOpen ? {} : {
      position: 'absolute' as const,
      left: config.x,
      top: config.y,
      width: config.width,
      height: config.height,
      zIndex: 1
    };

    switch (widgetId) {
      case 'world-map':
        return (
          <div key={widgetId} style={baseStyle} className={isLayoutEditorOpen ? "mb-4 sm:mb-6" : ""}>
            <div ref={mapContainerRef} className="relative w-full h-full" style={{ minHeight: isLayoutEditorOpen ? '400px' : `${config.height}px` }}>
              <DotWorldMap 
                key={`map-${userLocation?.lat || homeLocation?.lat}-${userLocation?.lon || homeLocation?.lon}-${partnerLocation.lat}-${partnerLocation.lon}`}
                a={userLocation || homeLocation || { lat: 37.7749, lon: -122.4194 }}
                b={partnerLocation}
                label="mi"
                className="w-full h-full"
                landColor={mapColors.landColor}
                oceanColor={mapColors.oceanColor}
                backgroundColor={mapColors.backgroundColor}
                textColor={mapColors.textColor}
              />
              
              {/* Map Overlays */}
              <div 
                key="map-overlays"
                className="absolute inset-0 pointer-events-none" 
                style={{ zIndex: 10000 }}
              >
                <div className="absolute top-2 left-2 pointer-events-auto">
                  <MapColorSettings 
                    onColorsChange={setMapColors}
                    className="pointer-events-auto"
                  />
                </div>
                
                <div className="absolute top-2 right-2 pointer-events-auto">
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            const { latitude, longitude } = position.coords;
                            const newLocation = { lat: latitude, lon: longitude };
                            if (user) {
                              await DataStorage.setUserLocation(user.id, newLocation);
                            }
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
                    title="Alex's Time"
                    timezone={partner?.timezone || partnerTimezone}
                    location={partnerLocation ? `${partnerLocation.lat}, ${partnerLocation.lon}` : "New York, USA"}
                    textColor={mapColors.textColor}
                  />
                </div>

                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 translate-x-1 pt-2 pointer-events-none">
                  <div style={{ backgroundColor: 'transparent', height: '8px' }}>
                    <div className="text-center" style={{ color: mapColors.textColor }}>
                      {(() => {
                        const eventTime = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds (demo)
                        const days = Math.floor(eventTime / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((eventTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((eventTime % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((eventTime % (1000 * 60)) / 1000);
                        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center pointer-events-none" style={{ backgroundColor: 'transparent' }}>
                  <div style={{ color: mapColors.textColor }}>
                    DISTANCE<br />
                    <span className="text-3xl font-bold">2,566 mi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'progress-bars':
        return (
          <div key={widgetId} style={baseStyle} className={isLayoutEditorOpen ? "mb-4 sm:mb-6" : ""}>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Your Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                    <span>Daily Tasks</span>
                    <span>{dailyTasks.userCompleted}/{dailyTasks.totalTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full flex items-center justify-end pr-1"
                      style={{ width: `${(dailyTasks.userCompleted / dailyTasks.totalTasks) * 100}%` }}
                    >
                      {Array.from({ length: dailyTasks.totalTasks }, (_, i) => (
                        <div key={i} className="flex items-center">
                          {i < dailyTasks.userCompleted ? (
                            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center -ml-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            </div>
                          ) : i === dailyTasks.totalTasks - 1 ? (
                            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs -ml-1">🏆</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dailyTasks.userCompleted * 2} tokens earned today
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Alex&apos;s Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                    <span>Daily Tasks</span>
                    <span>{dailyTasks.partnerCompleted}/{dailyTasks.totalTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full flex items-center justify-end pr-1"
                      style={{ width: `${(dailyTasks.partnerCompleted / dailyTasks.totalTasks) * 100}%` }}
                    >
                      {Array.from({ length: dailyTasks.totalTasks }, (_, i) => (
                        <div key={i} className="flex items-center">
                          {i < dailyTasks.partnerCompleted ? (
                            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center -ml-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            </div>
                          ) : i === dailyTasks.totalTasks - 1 ? (
                            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs -ml-1">🏆</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dailyTasks.partnerCompleted * 2} tokens earned today
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // User Settings Functions
  const updateUserSetting = (key: keyof UserSettings, value: string | boolean | Record<string, unknown>) => {
    setUserSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSchedule = (day: string, field: string, value: string) => {
    setUserSettings(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          [field]: value
        }
      }
    }));
  };

  const saveUserSettings = async () => {
    if (!user) return;
    
    try {
      await DataStorage.setUserSettings(user.id, userSettings);
      
      // Update local user state
      const updatedUser = {
        ...user,
        firstName: userSettings.firstName,
        lastName: userSettings.lastName,
        email: userSettings.email,
        timezone: userSettings.timezone,
        country: userSettings.country,
        language: userSettings.language
      };
      await DataStorage.setUser(updatedUser);
      setUser(updatedUser);
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save user settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'delete my account') {
      alert('Please type exactly "delete my account" to confirm.');
      return;
    }

    setIsDeleting(true);
    
    try {
      // For production, implement actual account deletion API call here
      // For now, just clear all data
      await DataStorage.clearAll();
      router.push('/?burned=true');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Load saved layout and user settings on component mount
  React.useEffect(() => {
    const loadLayoutAndSettings = async () => {
      if (!user) return;
      
      try {
        const savedLayout = await DataStorage.getData('dashboardLayout');
        if (savedLayout) {
          setWidgetConfigs(savedLayout);
        }
        
        const savedSettings = await DataStorage.getUserSettings(user.id);
        if (savedSettings) {
          setUserSettings(savedSettings);
        } else {
          // Set default settings from user data
          setUserSettings(prev => ({
            ...prev,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            timezone: user.timezone || 'UTC',
            country: user.country || '',
            language: user.language || 'en',
            birthday: '',
            timeFormat: '12h',
            measurementSystem: 'imperial',
            temperatureUnit: 'fahrenheit',
            distanceUnit: 'mi',
            spotifySharing: true,
            horoscopeSharing: true,
            shareHoroscope: true,
            showHoroscope: true,
            weeklySchedule: {}
          }));
        }
      } catch (error) {
        console.error('Error loading layout and settings:', error);
      }
    };
    
    loadLayoutAndSettings();
  }, [user]);

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
    const loadUser = async () => {
      try {
        const userData = await DataStorage.getUser();
        if (!userData) {
          router.push('/signup');
          return;
        }

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

        // Load horoscope settings using DataStorage
        const savedHoroscopeSettings = await DataStorage.getData('horoscopeSettings');
        if (savedHoroscopeSettings) {
          try {
            setHoroscopeSettings(savedHoroscopeSettings);
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
      } catch (error) {
        console.error('Failed to load user data:', error);
        router.push('/signup');
      }
    };
    
    loadUser();
  }, [router]);

  // Load saved user location and home location on mount
  useEffect(() => {
    const loadLocations = async () => {
      if (!user) return;
      
      try {
        const savedLocation = await DataStorage.getUserLocation(user.id);
        if (savedLocation) {
          setUserLocation(savedLocation);
        }
        
        const savedHome = await DataStorage.getData('homeLocation');
        if (savedHome) {
          setHomeLocation(savedHome);
        } else {
          // Set default home location if none exists
          const defaultHome = { lat: 37.7749, lon: -122.4194 }; // San Francisco
          setHomeLocation(defaultHome);
          await DataStorage.setData('homeLocation', defaultHome);
        }
      } catch (error) {
        console.error('Error loading saved locations:', error);
      }
    };
    
    loadLocations();
  }, [user]);

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
      {/* User Settings Button - Top Right */}
      <div className="flex justify-end mb-4 sm:mb-6">
        <button 
          className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={() => setShowUserModal(true)}
          title="User Settings"
        >
          <User className="w-4 h-4" />
          {userSettings.firstName || 'User'}
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Main Dashboard Grid */}
      <LayoutEditor
        widgets={widgetConfigs}
        onLayoutChange={handleLayoutChange}
        onSave={saveLayout}
        onCancel={cancelLayoutEdit}
        isEditing={isLayoutEditorOpen}
      >
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
                        async (position) => {
                          const { latitude, longitude } = position.coords;
                          const newLocation = { lat: latitude, lon: longitude };
                          if (user) {
                            await DataStorage.setUserLocation(user.id, newLocation);
                          }
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
                      <div className="text-sm opacity-90 mb-1">Today&apos;s Horoscope</div>
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
            <div className="h-80 rounded-lg" style={{ minHeight: '320px' }}>
              <TwoVerticalBars
                date={new Date()}
                partnerA={{
                  name:'You', tz:'America/New_York',
                  blocks:[
                    {startMin:0,endMin:360,kind:'sleep'},
                    {startMin:540,endMin:1020,kind:'work'},
                    {startMin:1080,endMin:1200,kind:'gym'},
                  ]
                }}
                partnerB={{
                  name:'Partner', tz:'Asia/Tokyo',
                  blocks:[
                    {startMin:60,endMin:420,kind:'sleep'},
                    {startMin:540,endMin:960,kind:'work'},
                    {startMin:1140,endMin:1260,kind:'meal'},
                  ]
                }}
                aLoc={{lat:40.7128,lon:-74.0060}}
                bLoc={{lat:35.6764,lon:139.6500}}
                barHeight={280}
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

        {/* User Settings Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-pink-500" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    User Settings
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveUserSettings}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex h-[80vh]">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-600">
                  <nav className="space-y-2">
                    {[
                      { id: 'personal', label: 'Personal Info', icon: User },
                      { id: 'sharing', label: 'Sharing', icon: Music },
                      { id: 'schedule', label: 'Schedule', icon: Calendar },
                      { id: 'layout', label: 'Layout', icon: Grid },
                      { id: 'legal', label: 'Legal', icon: Shield },
                      { id: 'danger', label: 'Danger Zone', icon: Trash2 }
                    ].map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setUserSettingsTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                            userSettingsTab === tab.id 
                              ? 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300' 
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Personal Info Tab */}
                  {userSettingsTab === 'personal' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={userSettings.firstName}
                            onChange={(e) => updateUserSetting('firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={userSettings.lastName}
                            onChange={(e) => updateUserSetting('lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={userSettings.email}
                            onChange={(e) => updateUserSetting('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Birthday
                          </label>
                          <input
                            type="date"
                            value={userSettings.birthday}
                            onChange={(e) => updateUserSetting('birthday', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Timezone
                          </label>
                          <select
                            value={userSettings.timezone}
                            onChange={(e) => updateUserSetting('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Australia/Sydney">Sydney</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Country
                          </label>
                          <select
                            value={userSettings.country}
                            onChange={(e) => updateUserSetting('country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="JP">Japan</option>
                          </select>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Display Preferences</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Time Format
                            </label>
                            <select
                              value={userSettings.timeFormat}
                              onChange={(e) => updateUserSetting('timeFormat', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                              <option value="12h">12-hour (AM/PM)</option>
                              <option value="24h">24-hour</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Temperature Unit
                            </label>
                            <select
                              value={userSettings.temperatureUnit}
                              onChange={(e) => updateUserSetting('temperatureUnit', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                              <option value="F">Fahrenheit (°F)</option>
                              <option value="C">Celsius (°C)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Measurement System
                            </label>
                            <select
                              value={userSettings.measurementSystem}
                              onChange={(e) => updateUserSetting('measurementSystem', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                              <option value="imperial">Imperial</option>
                              <option value="metric">Metric</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Distance Unit
                            </label>
                            <select
                              value={userSettings.distanceUnit}
                              onChange={(e) => updateUserSetting('distanceUnit', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                              <option value="mi">Miles</option>
                              <option value="km">Kilometers</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sharing Tab */}
                  {userSettingsTab === 'sharing' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sharing Settings</h3>
                      
                      <div className="space-y-4">
                        {/* Spotify Sharing */}
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Music className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200">Spotify Sharing</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Share your music activity with your partner</p>
                            </div>
                          </div>
                          <button
                            onClick={() => updateUserSetting('spotifySharing', !userSettings.spotifySharing)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              userSettings.spotifySharing ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              userSettings.spotifySharing ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        {/* Horoscope Sharing */}
                        <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-purple-600" />
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200">Show Horoscope</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Display daily horoscope on your dashboard</p>
                            </div>
                          </div>
                          <button
                            onClick={() => updateUserSetting('showHoroscope', !userSettings.showHoroscope)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              userSettings.showHoroscope ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              userSettings.showHoroscope ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-purple-600" />
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200">Share Horoscope</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Let your partner see your horoscope</p>
                            </div>
                          </div>
                          <button
                            onClick={() => updateUserSetting('shareHoroscope', !userSettings.shareHoroscope)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              userSettings.shareHoroscope ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              userSettings.shareHoroscope ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Schedule Tab */}
                  {userSettingsTab === 'schedule' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Weekly Schedule</h3>
                      
                      <div className="space-y-4">
                        {Object.entries(userSettings.weeklySchedule).map(([day, schedule]) => (
                          <div key={day} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 capitalize">{day}</h4>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Wake Up
                                </label>
                                <input
                                  type="time"
                                  value={schedule.wakeUpTime}
                                  onChange={(e) => updateSchedule(day, 'wakeUpTime', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Bed Time
                                </label>
                                <input
                                  type="time"
                                  value={schedule.bedTime}
                                  onChange={(e) => updateSchedule(day, 'bedTime', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Work Start
                                </label>
                                <input
                                  type="time"
                                  value={schedule.workStartTime}
                                  onChange={(e) => updateSchedule(day, 'workStartTime', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Work End
                                </label>
                                <input
                                  type="time"
                                  value={schedule.workEndTime}
                                  onChange={(e) => updateSchedule(day, 'workEndTime', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Gym Time
                                </label>
                                <input
                                  type="time"
                                  value={schedule.gymTime}
                                  onChange={(e) => updateSchedule(day, 'gymTime', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  School Time
                                </label>
                                <input
                                  type="time"
                                  value={schedule.schoolTime}
                                  onChange={(e) => updateSchedule(day, 'schoolTime', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layout Tab */}
                  {userSettingsTab === 'layout' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Dashboard Layout</h3>
                        <button
                          onClick={() => setIsLayoutEditorOpen(!isLayoutEditorOpen)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isLayoutEditorOpen 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-pink-500 hover:bg-pink-600 text-white'
                          }`}
                        >
                          <Grid className="w-4 h-4" />
                          {isLayoutEditorOpen ? 'Exit Layout Editor' : 'Open Layout Editor'}
                        </button>
                      </div>
                      
                      {isLayoutEditorOpen ? (
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                          <LayoutEditor
                            widgets={widgetConfigs}
                            onLayoutChange={handleLayoutChange}
                            onSave={saveLayout}
                            onCancel={cancelLayoutEdit}
                            isEditing={isLayoutEditorOpen}
                          >
                            <div className="h-96 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                              <p className="text-gray-500 dark:text-gray-400">Layout Editor Preview</p>
                            </div>
                          </LayoutEditor>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">Click &quot;Open Layout Editor&quot; to customize your dashboard layout</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Legal Tab */}
                  {userSettingsTab === 'legal' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Legal & Privacy</h3>
                      
                      <div className="space-y-4">
                        <Link 
                          href="/terms" 
                          target="_blank"
                          className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200">Terms of Use</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Read our terms and conditions</p>
                            </div>
                          </div>
                          <FileText className="w-4 h-4 text-gray-400" />
                        </Link>

                        <Link 
                          href="/privacy" 
                          target="_blank"
                          className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200">Privacy Policy</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">How we protect your data</p>
                            </div>
                          </div>
                          <Shield className="w-4 h-4 text-gray-400" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Danger Zone Tab */}
                  {userSettingsTab === 'danger' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                      
                      <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                              Burn the Bridge
                            </h4>
                            <p className="text-red-600 dark:text-red-400 mb-4">
                              This action will permanently delete your account and all associated data. 
                              Your partner will be notified that you have burned the bridge. 
                              This cannot be undone.
                            </p>
                            
                            {!showDeleteConfirm ? (
                              <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Burn the Bridge
                              </button>
                            ) : (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                                    Type &quot;delete my account&quot; to confirm:
                                  </label>
                                  <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-red-900/30 dark:text-white"
                                    placeholder="delete my account"
                                  />
                                </div>
                                
                                <div className="flex gap-3">
                                  <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'delete my account' || isDeleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                  >
                                    {isDeleting ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="w-4 h-4" />
                                        Confirm Delete
                                      </>
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => {
                                      setShowDeleteConfirm(false);
                                      setDeleteConfirmText('');
                                    }}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </LayoutEditor>
      </div>
    </ErrorBoundary>
  );
}
