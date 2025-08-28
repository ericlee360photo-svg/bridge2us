import { NextResponse } from 'next/server'

const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://www.bridge2us.app/api/spotify/callback';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID || '',
    client_secret: process.env.SPOTIFY_CLIENT_SECRET || ''
  })

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })

  const tokenData = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.json({ error: tokenData }, { status: tokenRes.status })
  }

  return NextResponse.redirect('/dashboard')
}
