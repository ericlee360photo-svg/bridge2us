import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=calendar_auth_failed', request.url));
  }

  if (code) {
    try {
      // Exchange authorization code for access token
      // This is where you'd implement the OAuth2 flow with Google Calendar API
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/calendar/google/auth`,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      
      // Store the access token securely (in database or session)
      // For now, we'll redirect with success
      
      return NextResponse.redirect(new URL('/?calendar_imported=google', request.url));
    } catch (error) {
      console.error('Google Calendar auth error:', error);
      return NextResponse.redirect(new URL('/?error=calendar_auth_failed', request.url));
    }
  }

  // Initial OAuth request
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID || '');
  googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/calendar/google/auth`);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar.readonly');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(googleAuthUrl.toString());
}
