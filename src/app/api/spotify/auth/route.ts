import { NextResponse } from 'next/server'

const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://www.bridge2us.app/api/spotify/callback';

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID || '',
    scope: 'user-read-private user-read-email user-read-currently-playing user-read-recently-played playlist-read-private playlist-modify-private playlist-modify-public',
    redirect_uri: SPOTIFY_REDIRECT_URI
  })

  const url = `https://accounts.spotify.com/authorize?${params.toString()}`
  return NextResponse.redirect(url)
}
