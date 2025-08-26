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
      // Exchange authorization code for access token with Microsoft Graph API
      const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.MICROSOFT_CLIENT_ID || '',
          client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/calendar/outlook/auth`,
          grant_type: 'authorization_code',
          scope: 'https://graph.microsoft.com/Calendars.Read',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      
      // Store the access token securely (in database or session)
      // For now, we'll redirect with success
      
      return NextResponse.redirect(new URL('/?calendar_imported=outlook', request.url));
    } catch (error) {
      console.error('Outlook Calendar auth error:', error);
      return NextResponse.redirect(new URL('/?error=calendar_auth_failed', request.url));
    }
  }

  // Initial OAuth request to Microsoft
  const microsoftAuthUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
  microsoftAuthUrl.searchParams.set('client_id', process.env.MICROSOFT_CLIENT_ID || '');
  microsoftAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/calendar/outlook/auth`);
  microsoftAuthUrl.searchParams.set('response_type', 'code');
  microsoftAuthUrl.searchParams.set('scope', 'https://graph.microsoft.com/Calendars.Read');
  microsoftAuthUrl.searchParams.set('response_mode', 'query');

  return NextResponse.redirect(microsoftAuthUrl.toString());
}
