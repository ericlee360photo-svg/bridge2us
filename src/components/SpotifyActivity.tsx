'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, ExternalLink, Clock, Music } from 'lucide-react';
import { spotifyConnectionCache } from '@/lib/spotifyConnectionCache';
import { spotifyRateLimit } from '@/lib/simpleRateLimit';

interface Track {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
  duration?: number;
  progress?: number;
}

interface SpotifyActivityProps {
  userId: string;
  partnerName: string;
}

export default function SpotifyActivity({ userId, partnerName }: SpotifyActivityProps) {
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastFailedCheck, setLastFailedCheck] = useState<number>(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      // Check cache to see if we should skip this request
      if (spotifyConnectionCache.shouldSkipRequest(userId)) {
        console.log(`Skipping Spotify activity request for user ${userId} due to cache`);
        const cachedStatus = spotifyConnectionCache.isConnected(userId);
        setIsConnected(cachedStatus);
        if (!cachedStatus) {
          setActivity(null);
        }
        setLoading(false);
        return;
      }

      // Additional rate limiting check
      if (!spotifyRateLimit.canMakeRequest(`spotify-activity-${userId}`)) {
        console.log(`Rate limit prevented Spotify activity request for user ${userId}`);
        setLoading(false);
        return;
      }

      console.log(`Making Spotify activity request for user ${userId}`);

      try {
        const response = await fetch(`/api/spotify/activity?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setActivity(data);
          setIsConnected(true);
          spotifyConnectionCache.recordSuccess(userId);
        } else if (response.status === 404) {
          // User not connected to Spotify
          setIsConnected(false);
          setActivity(null);
          spotifyConnectionCache.recordFailure(userId);
        }
      } catch (error) {
        console.error('Error fetching Spotify activity:', error);
        setIsConnected(false);
        setActivity(null);
        spotifyConnectionCache.recordFailure(userId);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  // Separate useEffect for setting up the interval
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(async () => {
      // Check cache before making request
      if (spotifyConnectionCache.shouldSkipRequest(userId)) {
        console.log(`Skipping Spotify activity polling for user ${userId} due to cache`);
        return;
      }

      // Additional rate limiting check for polling
      if (!spotifyRateLimit.canMakeRequest(`spotify-activity-poll-${userId}`)) {
        console.log(`Rate limit prevented Spotify activity polling for user ${userId}`);
        return;
      }

      console.log(`Polling Spotify activity for user ${userId}`);

      try {
        const response = await fetch(`/api/spotify/activity?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setActivity(data);
          spotifyConnectionCache.recordSuccess(userId);
        } else if (response.status === 404) {
          // Connection lost
          setIsConnected(false);
          setActivity(null);
          spotifyConnectionCache.recordFailure(userId);
        }
      } catch (error) {
        console.error('Error fetching Spotify activity:', error);
        setIsConnected(false);
        setActivity(null);
        spotifyConnectionCache.recordFailure(userId);
      }
    }, 300000); // Poll every 5 minutes only if connected

    return () => clearInterval(interval);
  }, [isConnected, userId]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {partnerName}'s Music Activity
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading partner's music...</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {partnerName}'s Music Activity
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Partner not connected to Spotify</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {partnerName}'s Music Activity
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {activity.currentlyPlaying?.isPlaying ? 'Currently playing' : 'Recently played'}
          </p>
        </div>
      </div>

      {/* Currently Playing */}
      {activity.currentlyPlaying?.isPlaying && (
        <div className="mb-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <img 
              src={activity.currentlyPlaying.track.albumArt} 
              alt={activity.currentlyPlaying.track.album}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {activity.currentlyPlaying.track.name}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {activity.currentlyPlaying.track.artist}
              </p>
              {activity.currentlyPlaying.track.progress && activity.currentlyPlaying.track.duration && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(activity.currentlyPlaying.track.progress / activity.currentlyPlaying.track.duration) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{formatTime(activity.currentlyPlaying.track.progress)}</span>
                    <span>{formatTime(activity.currentlyPlaying.track.duration)}</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => window.open(activity.currentlyPlaying.track.spotifyUrl, '_blank')}
              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Recently Played */}
      {activity.recentlyPlayed && activity.recentlyPlayed.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recently Played
          </h4>
          <div className="space-y-2">
            {activity.recentlyPlayed.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <img 
                  src={item.track.albumArt} 
                  alt={item.track.album}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {item.track.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {item.track.artist} • {formatTimeAgo(item.playedAt)}
                  </p>
                </div>
                <button
                  onClick={() => window.open(item.track.spotifyUrl, '_blank')}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
