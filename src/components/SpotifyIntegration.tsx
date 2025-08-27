'use client';

import React, { useState, useEffect } from 'react';
import { Music, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface SpotifyIntegrationProps {
  userId: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export default function SpotifyIntegration({ userId, onConnect, onDisconnect }: SpotifyIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // In real app, check from database

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`/api/spotify/activity?userId=${userId}`);
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };
    
    checkConnection();
  }, [userId]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Redirect to Spotify OAuth
      window.location.href = `/api/spotify/auth?userId=${userId}`;
    } catch (error) {
      console.error('Error connecting to Spotify:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // In real app, remove tokens from database
      setIsConnected(false);
      onDisconnect?.();
    } catch (error) {
      console.error('Error disconnecting from Spotify:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Connect Your Spotify</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Connected - sharing with partner' : 'Share your music activity with your partner'}
            </p>
          </div>
        </div>
        {isConnected ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isConnected ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="text-green-600 dark:text-green-400 font-medium">Connected</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open('https://open.spotify.com', '_blank')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Spotify
            </button>
            <button
              onClick={handleDisconnect}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
                  <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Music className="w-4 h-4" />
                Connect & Share with Partner
              </>
            )}
          </button>
      )}
    </div>
  );
}
