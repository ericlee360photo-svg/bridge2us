"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Plus, Heart, Plane, Hotel, Utensils } from "lucide-react";
import { getTimeUntil, formatDate } from "@/lib/utils";

interface Meetup {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  status: 'PLANNED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  user1: {
    id: string;
    name: string;
  };
  user2: {
    id: string;
    name: string;
  };
}

export default function MeetupsPage() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);


  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    try {
      const response = await fetch('/api/meetups');
      if (response.ok) {
        const data = await response.json();
        setMeetups(data);
      }
    } catch (error) {
      console.error('Error fetching meetups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };



  const upcomingMeetups = meetups.filter(meetup => 
    new Date(meetup.startDate) > new Date() && meetup.status !== 'CANCELLED'
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const pastMeetups = meetups.filter(meetup => 
    new Date(meetup.startDate) < new Date() || meetup.status === 'COMPLETED'
  ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Meetups
          </h1>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Plan Meetup
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Plan and countdown to your next reunion
        </p>
      </header>

      {/* Next Meetup Countdown */}
      {upcomingMeetups.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Next Meetup
          </h2>
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {upcomingMeetups[0].title}
                </h3>
                {upcomingMeetups[0].description && (
                  <p className="text-pink-100 mb-2">
                    {upcomingMeetups[0].description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(upcomingMeetups[0].startDate, "PPP")}
                  </div>
                  {upcomingMeetups[0].location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {upcomingMeetups[0].location}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold mb-1">
                  {getTimeUntil(new Date(upcomingMeetups[0].startDate)).days}
                </div>
                <div className="text-sm text-pink-100">days to go</div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {getTimeUntil(new Date(upcomingMeetups[0].startDate)).hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-pink-100">Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {getTimeUntil(new Date(upcomingMeetups[0].startDate)).minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-pink-100">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {getTimeUntil(new Date(upcomingMeetups[0].startDate)).seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-pink-100">Seconds</div>
              </div>
              <div className="flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-200" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Meetups */}
      {upcomingMeetups.length > 1 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Upcoming Meetups
          </h2>
          <div className="space-y-4">
            {upcomingMeetups.slice(1).map(meetup => (
              <div
                key={meetup.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {meetup.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meetup.status)}`}>
                        {meetup.status}
                      </span>
                    </div>
                    {meetup.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {meetup.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(meetup.startDate, "MMM d, yyyy")}
                      </div>
                      {meetup.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {meetup.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-500">
                      {getTimeUntil(new Date(meetup.startDate)).days}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Meetups */}
      {pastMeetups.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Past Meetups
          </h2>
          <div className="space-y-4">
            {pastMeetups.slice(0, 5).map(meetup => (
              <div
                key={meetup.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {meetup.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meetup.status)}`}>
                        {meetup.status}
                      </span>
                    </div>
                    {meetup.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {meetup.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(meetup.startDate, "MMM d, yyyy")}
                      </div>
                      {meetup.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {meetup.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-gray-400">
                    <div className="text-sm">
                      {formatDate(meetup.startDate, "MMM d")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow text-center">
            <Plane className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Book Flights
            </div>
          </button>
          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow text-center">
            <Hotel className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Find Hotels
            </div>
          </button>
          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow text-center">
            <Utensils className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Plan Activities
            </div>
          </button>
          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow text-center">
            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Share Memories
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
