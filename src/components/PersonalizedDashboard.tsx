"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart, Calendar, MessageCircle, User, Gift } from "lucide-react";
import { getTimeUntil, getPartnerCurrentTime, formatInTimezone } from "@/lib/utils";
import { getWeatherIcon, getWeatherConditionName, WeatherData } from "@/lib/weather";
import DotWorldMap from "@/components/DotWorldMap";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  timezone: string;
  birthday?: string;
  address?: string;
  country?: string;
  language?: string;
  measurementSystem?: "metric" | "imperial";
  temperatureUnit?: "celsius" | "fahrenheit";
  distanceUnit?: "km" | "mi";
}

interface Partner {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  timezone: string;
  isAwake: boolean;
  currentActivity: string;
  latitude?: number;
  longitude?: number;
  country?: string;
}

interface PersonalizedDashboardProps {
  user: User;
  partner?: Partner;
}

export default function PersonalizedDashboard({ user, partner }: PersonalizedDashboardProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [partnerTime, setPartnerTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Mock data - replace with real data from your backend
  const nextMeetup = useMemo(() => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), []); // 15 days from now

  // Mock user locations - replace with real GPS data
  const user1 = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    latitude: 37.7749, // San Francisco
    longitude: -122.4194,
    timezone: user.timezone
  };

  const user2 = partner ? {
    id: partner.id,
    name: `${partner.firstName} ${partner.lastName}`,
    latitude: partner.latitude ?? 40.7128, // Fallback: New York
    longitude: partner.longitude ?? -74.0060,
    timezone: partner.timezone
  } : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntil(nextMeetup));
      if (partner) {
        setPartnerTime(getPartnerCurrentTime(partner.timezone));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextMeetup, partner]);

  // Fetch partner weather with user preferences
  useEffect(() => {
    const fetchWeather = async () => {
      if (!user2) return;
      try {
        const params = new URLSearchParams({
          lat: String(user2.latitude),
          lon: String(user2.longitude),
          measurementSystem: user.measurementSystem || "metric",
          temperatureUnit: user.temperatureUnit || "celsius",
          distanceUnit: user.distanceUnit || "km"
        });
        const res = await fetch(`/api/weather?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setWeather(data as WeatherData);
        }
      } catch {
        // noop - widget will show fallback
      }
    };
    fetchWeather();
  }, [user.measurementSystem, user.temperatureUnit, user.distanceUnit, user2?.latitude, user2?.longitude]);

  const getPartnerActivity = () => {
    if (!partner) return "Not connected";
    
    const hour = partnerTime.getHours();
    if (hour >= 6 && hour < 12) return "🌅 Morning routine";
    if (hour >= 12 && hour < 17) return "☀️ Afternoon activities";
    if (hour >= 17 && hour < 21) return "🌆 Evening time";
    if (hour >= 21 || hour < 6) return "🌙 Sleeping";
    return "💭 Unknown";
  };

  const quickActions = [
    { icon: MessageCircle, label: "Send Message", href: "#", color: "bg-blue-500" },
    
    { icon: Calendar, label: "Plan Meetup", href: "/meetups", color: "bg-purple-500" },
    { icon: Gift, label: "Send Gift", href: "#", color: "bg-pink-500" },
  ];

  const relationshipStats = [
    { label: "Days Together", value: "365", icon: Heart },
    { label: "Meetups", value: "8", icon: Calendar },
    { label: "Messages", value: "1,247", icon: MessageCircle },
    
  ];

  const recentActivity = [
    { type: "message", content: "Sent a message", time: "2 min ago", icon: MessageCircle },
    
    { type: "meetup", content: "Planned next meetup", time: "3 hours ago", icon: Calendar },
    { type: "gift", content: "Received a gift", time: "1 day ago", icon: Gift },
  ];

  const upcomingEvents = [
    { title: "Date Night", date: "Tomorrow", time: "8:00 PM", type: "virtual" },
    { title: "Weekend Trip", date: "Next Week", time: "All day", type: "in-person" },
    { title: "Birthday Celebration", date: "Dec 15", time: "7:00 PM", type: "virtual" },
  ];

  const preferredTemp = (w: WeatherData | null) => {
    if (!w) return "--";
    if ((user.temperatureUnit || "celsius") === "fahrenheit") {
      return `${w.temperatureFahrenheit ?? Math.round((w.temperature * 9) / 5 + 32)}°F`;
    }
    return `${w.temperature}°C`;
  };

  const preferredWind = (w: WeatherData | null) => {
    if (!w) return "--";
    const useMph = (user.distanceUnit || (user.measurementSystem === "imperial" ? "mi" : "km")) === "mi";
    if (useMph) return `${w.windSpeedMph ?? Math.round(w.windSpeed * 0.621371)} mph`;
    return `${w.windSpeed} km/h`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Welcome back, {user.firstName}! 💕
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {partner ? `Connected with ${partner.firstName}` : "Ready to connect with your partner"}
            </p>
          </div>
        </div>
      </div>

      {/* World Map */}
      {user2 && (
        <div className="mb-8">
          <DotWorldMap user1={user1} user2={user2} />
        </div>
      )}

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
            {partner ? `${partner.firstName}'s Time` : "Partner's Time"}
          </h2>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {partner ? formatInTimezone(partnerTime, partner.timezone, "HH:mm") : "--:--"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {partner ? formatInTimezone(partnerTime, partner.timezone, "EEEE, MMMM d") : "Not connected"}
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${partner?.isAwake ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {partner ? (partner.isAwake ? 'Awake' : 'Sleeping') : 'Unknown'}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getPartnerActivity()}
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Weather
          </h2>
          <div className="text-center">
            <div className="flex justify-center mb-2 text-2xl">
              {weather ? getWeatherIcon(weather.icon) : '🌤️'}
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {preferredTemp(weather)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
              {weather ? getWeatherConditionName(weather.condition) : 'Loading...'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {weather ? `${weather.location}, ${weather.country}` : '...'}
            </div>
            {weather && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Wind: {preferredWind(weather)} · Humidity: {weather.humidity}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
              {action.label}
            </p>
          </button>
        ))}
      </div>

      {/* Stats and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Relationship Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Relationship Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {relationshipStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {activity.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {event.title}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {event.date} • {event.time}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {event.type === 'virtual' ? '📱 Virtual' : '🤝 In-person'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


