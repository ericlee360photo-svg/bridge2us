import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // In a real app, you'd verify that the requesting user has permission
  // to view this user's Spotify activity (i.e., they are partners)

  try {
    // In a real app, you'd fetch the user's Spotify tokens from your database
    // For now, we'll check if the user has a Spotify connection
    // This is a mock check - in real app, you'd query your database
    const isConnected = userId !== 'partner-default' && userId !== 'user-default';
    
    if (!isConnected) {
      return NextResponse.json({ error: 'User not connected to Spotify' }, { status: 404 });
    }

    // Mock data for connected users
    const mockActivity = {
      currentlyPlaying: {
        isPlaying: true,
        track: {
          name: "Blinding Lights",
          artist: "The Weeknd",
          album: "After Hours",
          albumArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
          duration: 200000,
          progress: 120000,
          spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b"
        }
      },
      recentlyPlayed: [
        {
          track: {
            name: "As It Was",
            artist: "Harry Styles",
            album: "Harry's House",
            albumArt: "https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f5",
            spotifyUrl: "https://open.spotify.com/track/4LRPiXqCikLlN15c3yImP7"
          },
          playedAt: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
        },
        {
          track: {
            name: "Late Night Talking",
            artist: "Harry Styles",
            album: "Harry's House",
            albumArt: "https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f5",
            spotifyUrl: "https://open.spotify.com/track/1qEmFfgcLb0zQvDeqzxWwR"
          },
          playedAt: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
        }
      ],
      topTracks: [
        {
          name: "Blinding Lights",
          artist: "The Weeknd",
          albumArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
          spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b"
        },
        {
          name: "As It Was",
          artist: "Harry Styles",
          albumArt: "https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f5",
          spotifyUrl: "https://open.spotify.com/track/4LRPiXqCikLlN15c3yImP7"
        }
      ]
    };

    return NextResponse.json(mockActivity);
  } catch (error) {
    console.error('Error fetching Spotify activity:', error);
    return NextResponse.json({ error: 'Failed to fetch Spotify activity' }, { status: 500 });
  }
}
