"use client";

import { useState, useEffect } from "react";
import { Clock, Globe, Sun, Moon, Coffee, Bed } from "lucide-react";
import { getPartnerCurrentTime, formatInTimezone, isPartnerAwake, getTimezoneDifference } from "@/lib/utils";

export default function TimezonePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [partnerTime, setPartnerTime] = useState(new Date());
  
  // Mock data - replace with real data from your backend
  const userTimezone = "America/Los_Angeles";
  const partnerTimezone = "America/New_York";
  const partnerName = "Alex";

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setPartnerTime(getPartnerCurrentTime(partnerTimezone));
    }, 1000);

    return () => clearInterval(timer);
  }, [partnerTimezone]);

  // Accurate time difference using Intl-based calculation
  const tzDiff = getTimezoneDifference(partnerTimezone, userTimezone);
  const timeDifference = Math.round(tzDiff.hours);

  const partnerAwake = isPartnerAwake(partnerTimezone);

  const getTimeOfDay = (time: Date) => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return { icon: Sun, label: "Morning", color: "text-yellow-500" };
    if (hour >= 12 && hour < 17) return { icon: Sun, label: "Afternoon", color: "text-orange-500" };
    if (hour >= 17 && hour < 21) return { icon: Sun, label: "Evening", color: "text-red-500" };
    return { icon: Moon, label: "Night", color: "text-blue-500" };
  };

  const userTimeOfDay = getTimeOfDay(currentTime);
  const partnerTimeOfDay = getTimeOfDay(partnerTime);

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Time Zones
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Stay connected across different time zones
        </p>
      </header>

      {/* Current Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Your Time */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Your Time
            </h2>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {formatInTimezone(currentTime, userTimezone, "HH:mm")}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {formatInTimezone(currentTime, userTimezone, "EEEE, MMMM d")}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {userTimezone.replace('_', ' ')}
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <userTimeOfDay.icon className={`w-5 h-5 ${userTimeOfDay.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {userTimeOfDay.label}
              </span>
            </div>
          </div>
        </div>

        {/* Partner's Time */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {partnerName}&apos;s Time
            </h2>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {formatInTimezone(partnerTime, partnerTimezone, "HH:mm")}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {formatInTimezone(partnerTime, partnerTimezone, "EEEE, MMMM d")}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {partnerTimezone.replace('_', ' ')}
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <partnerTimeOfDay.icon className={`w-5 h-5 ${partnerTimeOfDay.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {partnerTimeOfDay.label}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              {partnerAwake ? (
                <>
                  <Coffee className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Likely Awake
                  </span>
                </>
              ) : (
                <>
                  <Bed className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Likely Sleeping
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Time Difference */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <h2 className="text-xl font-semibold mb-4">Time Difference</h2>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {Math.abs(timeDifference)} hours
          </div>
          <div className="text-lg">
            {timeDifference > 0 
              ? `${partnerName} is ${Math.abs(timeDifference)} hours ahead`
              : `${partnerName} is ${Math.abs(timeDifference)} hours behind`
            }
          </div>
        </div>
      </div>

      {/* Best Times to Connect */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Best Times to Connect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Morning</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {timeDifference > 0 
                ? `Your ${partnerName} is ${Math.abs(timeDifference)} hours ahead`
                : `Your ${partnerName} is ${Math.abs(timeDifference)} hours behind`
              }
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Afternoon</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Both of you are likely available during this time
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Evening</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Perfect time for longer conversations
            </p>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Time Zone Tips
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <span>Set reminders for important times in your partner&apos;s timezone</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Plan video calls when both of you are likely to be awake</span>
            </li>
            <li className="flex items-start gap-3">
              <Sun className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Share your daily schedules to find overlapping free time</span>
            </li>
            <li className="flex items-start gap-3">
              <Moon className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span>Be mindful of sleep schedules when sending messages</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
