import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // In a real app, you'd verify that the requesting user has permission
  // to view this user's Spotify playlists (i.e., they are partners)

  try {
    // In a real app, you'd fetch the user's Spotify tokens from your database
    // For now, we'll check if the user has a Spotify connection
    // This is a mock check - in real app, you'd query your database
    const isConnected = userId !== 'partner-default' && userId !== 'user-default';
    
    if (!isConnected) {
      return NextResponse.json({ error: 'User not connected to Spotify' }, { status: 404 });
    }

    // Mock data for connected users
    const mockPlaylists = {
      playlists: [
        {
          id: "playlist1",
          name: "Our Love Songs",
          description: "Songs that remind us of each other",
          image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292f5663a6",
          tracks: 23,
          spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00",
          isCollaborative: true,
          owner: "Alex & You"
        },
        {
          id: "playlist2",
          name: "Road Trip Vibes",
          description: "Perfect for our next adventure together",
          image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292f5663a6",
          tracks: 45,
          spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00",
          isCollaborative: false,
          owner: "Alex"
        },
        {
          id: "playlist3",
          name: "Late Night Feels",
          description: "When we're missing each other",
          image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292f5663a6",
          tracks: 18,
          spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00",
          isCollaborative: true,
          owner: "Alex & You"
        }
      ]
    };

    return NextResponse.json(mockPlaylists);
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error);
    return NextResponse.json({ error: 'Failed to fetch Spotify playlists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, playlistName, description, trackUris } = body;

    if (!userId || !playlistName) {
      return NextResponse.json({ error: 'User ID and playlist name required' }, { status: 400 });
    }

    // In a real app, you'd create the playlist using Spotify API
    // For now, we'll return a mock response
    const mockCreatedPlaylist = {
      id: `playlist_${Date.now()}`,
      name: playlistName,
      description: description || "",
      image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292f5663a6",
      tracks: trackUris ? trackUris.length : 0,
      spotifyUrl: `https://open.spotify.com/playlist/playlist_${Date.now()}`,
      isCollaborative: true,
      owner: "Alex & You"
    };

    return NextResponse.json({ 
      success: true, 
      playlist: mockCreatedPlaylist,
      message: 'Playlist created successfully!' 
    });
  } catch (error) {
    console.error('Error creating Spotify playlist:', error);
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
}
