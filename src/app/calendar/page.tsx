"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, MapPin, User, Heart } from "lucide-react";
import { format } from "date-fns";
import CalendarIntegration from "@/components/CalendarIntegration";

interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  allDay: boolean;
  user: {
    id: string;
    name: string;
  };
}

interface Relationship {
  id: string;
  partner: {
    id: string;
    name: string;
    email: string;
    timezone: string;
    calendarSyncEnabled: boolean;
    schedule: {
      wakeUpTime: string;
      bedTime: string;
      workStartTime: string;
      workEndTime: string;
      gymTime: string;
      schoolTime: string;
    };
  };
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);

  // Mock user ID - in real app, this would come from authentication
  const currentUserId = "mock-user-id";

  useEffect(() => {
    fetchEvents();
    fetchRelationships();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelationships = async () => {
    try {
      const response = await fetch(`/api/relationships/link?userId=${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setRelationships(data);
        if (data.length > 0) {
          setSelectedRelationship(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching relationships:', error);
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Calendar
          </h1>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            ← Previous
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            Next →
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-gray-700 ${
                    !day ? 'bg-gray-50 dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        day.toDateString() === new Date().toDateString()
                          ? 'text-pink-500 font-bold'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {getEventsForDate(day).map(event => (
                          <div
                            key={event.id}
                            className="text-xs p-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded truncate cursor-pointer hover:bg-pink-200 dark:hover:bg-pink-800"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <section className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {events
                .filter(event => new Date(event.startTime) > new Date())
                .slice(0, 5)
                .map(event => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(event.startTime), 'MMM d, h:mm a')}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {event.user.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Partner Info */}
          {selectedRelationship && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedRelationship.partner.name}
                </h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Timezone:</span>
                  <span className="ml-2 text-gray-800 dark:text-gray-200">
                    {selectedRelationship.partner.timezone}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
                  <div className="mt-1 space-y-1 text-xs">
                    <div>Wake: {selectedRelationship.partner.schedule.wakeUpTime}</div>
                    <div>Bed: {selectedRelationship.partner.schedule.bedTime}</div>
                    <div>Work: {selectedRelationship.partner.schedule.workStartTime} - {selectedRelationship.partner.schedule.workEndTime}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Integration */}
          {selectedRelationship && (
            <CalendarIntegration
              userId={currentUserId}
              partnerId={selectedRelationship.partner.id}
              userCalendarSyncEnabled={false} // This would come from user data
              partnerCalendarSyncEnabled={selectedRelationship.partner.calendarSyncEnabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
