"use client";

import { useState } from "react";
import { Calendar, ExternalLink, CheckCircle, XCircle, Clock, Users } from "lucide-react";

interface CalendarIntegrationProps {
  userId: string;
  partnerId: string;
  userCalendarSyncEnabled: boolean;
  partnerCalendarSyncEnabled: boolean;
}

export default function CalendarIntegration({ 
  userId, 
  partnerId, 
  userCalendarSyncEnabled, 
  partnerCalendarSyncEnabled 
}: CalendarIntegrationProps) {
  const [selectedCalendar, setSelectedCalendar] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncData, setSyncData] = useState<any>(null);

  const calendarProviders = [
    {
      id: "google",
      name: "Google Calendar",
      icon: "📅",
      description: "Connect your Google Calendar",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      id: "outlook",
      name: "Outlook Calendar",
      icon: "📧",
      description: "Connect your Outlook Calendar",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      id: "apple",
      name: "Apple Calendar",
      icon: "🍎",
      description: "Connect your Apple Calendar",
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ];

  const handleCalendarConnect = async (provider: string) => {
    setIsConnecting(true);
    setSelectedCalendar(provider);

    try {
      // In a real app, this would redirect to OAuth flow
      // For now, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          partnerId,
          calendarSource: provider,
          calendarId: `mock-${provider}-calendar-id`
        }),
      });

      if (response.ok) {
        // Refresh sync data
        await fetchSyncData();
      } else {
        console.error('Failed to connect calendar');
      }
    } catch (error) {
      console.error('Calendar connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchSyncData = async () => {
    try {
      const response = await fetch(`/api/calendar/sync?userId=${userId}&partnerId=${partnerId}`);
      if (response.ok) {
        const data = await response.json();
        setSyncData(data);
      }
    } catch (error) {
      console.error('Failed to fetch sync data:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-pink-500" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Calendar Sync
        </h2>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {userCalendarSyncEnabled ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">You</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {userCalendarSyncEnabled ? 'Connected' : 'Not connected'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {partnerCalendarSyncEnabled ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Partner</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {partnerCalendarSyncEnabled ? 'Connected' : 'Not connected'}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Providers */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Connect Your Calendar
        </h3>
        
        {calendarProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleCalendarConnect(provider.id)}
            disabled={isConnecting}
            className={`w-full ${provider.color} text-white rounded-lg p-4 flex items-center justify-between transition-colors disabled:opacity-50`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{provider.icon}</span>
              <div className="text-left">
                <div className="font-medium">{provider.name}</div>
                <div className="text-sm opacity-90">{provider.description}</div>
              </div>
            </div>
            {isConnecting && selectedCalendar === provider.id ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <ExternalLink className="w-5 h-5" />
            )}
          </button>
        ))}
      </div>

      {/* Overlapping Free Times */}
      {syncData && syncData.overlappingFreeTimes && syncData.overlappingFreeTimes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Best Times to Connect
            </h3>
          </div>
          
          <div className="space-y-2">
            {syncData.overlappingFreeTimes.map((time: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Both Free
                  </span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {time.startTime} - {time.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Summary */}
      {syncData && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Schedule Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-blue-700 dark:text-blue-300 font-medium">You</div>
              <div>Wake: {syncData.user.schedule.wakeUpTime}</div>
              <div>Bed: {syncData.user.schedule.bedTime}</div>
              <div>Work: {syncData.user.schedule.workStartTime} - {syncData.user.schedule.workEndTime}</div>
            </div>
            <div>
              <div className="text-blue-700 dark:text-blue-300 font-medium">Partner</div>
              <div>Wake: {syncData.partner.schedule.wakeUpTime}</div>
              <div>Bed: {syncData.partner.schedule.bedTime}</div>
              <div>Work: {syncData.partner.schedule.workStartTime} - {syncData.partner.schedule.workEndTime}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
