'use client';

import React, { useState, useEffect } from 'react';
import { Music, Plus, ExternalLink, Users, Heart, Share2 } from 'lucide-react';
import { spotifyConnectionCache } from '@/lib/spotifyConnectionCache';
import { spotifyRateLimit } from '@/lib/simpleRateLimit';

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  tracks: number;
  spotifyUrl: string;
  isCollaborative: boolean;
  owner: string;
}

interface SpotifyPlaylistsProps {
  userId: string;
  partnerName: string;
}

export default function SpotifyPlaylists({ userId, partnerName }: SpotifyPlaylistsProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [lastFailedCheck, setLastFailedCheck] = useState<number>(0);

  useEffect(() => {
    const fetchPlaylists = async () => {
      // Check cache to see if we should skip this request
      if (spotifyConnectionCache.shouldSkipRequest(userId)) {
        console.log(`Skipping Spotify playlists request for user ${userId} due to cache`);
        const cachedStatus = spotifyConnectionCache.isConnected(userId);
        setIsConnected(cachedStatus);
        if (!cachedStatus) {
          setPlaylists([]);
        }
        setLoading(false);
        return;
      }

      // Additional rate limiting check
      if (!spotifyRateLimit.canMakeRequest(`spotify-playlists-${userId}`)) {
        console.log(`Rate limit prevented Spotify playlists request for user ${userId}`);
        setLoading(false);
        return;
      }

      console.log(`Making Spotify playlists request for user ${userId}`);

      try {
        const response = await fetch(`/api/spotify/playlists?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setPlaylists(data.playlists);
          setIsConnected(true);
          spotifyConnectionCache.recordSuccess(userId);
        } else if (response.status === 404) {
          // User not connected to Spotify
          setIsConnected(false);
          setPlaylists([]);
          spotifyConnectionCache.recordFailure(userId);
        }
      } catch (error) {
        console.error('Error fetching Spotify playlists:', error);
        setIsConnected(false);
        setPlaylists([]);
        spotifyConnectionCache.recordFailure(userId);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const response = await fetch('/api/spotify/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          playlistName: newPlaylistName,
          description: newPlaylistDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists(prev => [data.playlist, ...prev]);
        setShowCreateModal(false);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleSharePlaylist = (playlist: Playlist) => {
    // In a real app, you'd implement sharing functionality
    navigator.clipboard.writeText(playlist.spotifyUrl);
    alert('Playlist link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{partnerName}&apos;s Playlists</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading partner&apos;s playlists...</p>
            </div>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{partnerName}&apos;s Playlists</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <img 
              src={playlist.image} 
              alt={playlist.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {playlist.name}
                </p>
                {playlist.isCollaborative && (
                  <Users className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {playlist.description || `${playlist.tracks} tracks`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {playlist.owner}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => window.open(playlist.spotifyUrl, '_blank')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Open in Spotify"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSharePlaylist(playlist)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Share playlist"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Create New Playlist
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePlaylist} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Enter playlist name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Describe your playlist"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Create Playlist
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
