import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getTwitterUser } from '@/lib/twitter';
import { createSession } from '@/lib/session';

/**
 * X/Twitter OAuth callback handler
 * Exchanges code for access token and creates session
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      new URL(`/?error=twitter_${error}`, appUrl)
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  try {
    // Exchange code for access token
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/x`;
    const tokenData = await getAccessToken(code, redirectUri);
    const accessToken = tokenData.access_token;

    // Get user profile
    const user = await getTwitterUser(accessToken);

    // Create session
    const sessionToken = await createSession({
      xUsername: user.username,
      xUserId: user.id,
      xAccessToken: accessToken,
    });

    // Redirect to home with session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const response = NextResponse.redirect(new URL('/', appUrl));
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('X OAuth error:', error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      new URL('/?error=twitter_auth_failed', appUrl)
    );
  }
}

/**
 * Initiate X OAuth flow
 * POST /api/auth/x with { redirect_uri }
 */
export async function POST(request: NextRequest) {
  try {
    const { redirect_uri } = await request.json();
    const clientId = process.env.TWITTER_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Twitter Client ID not configured' },
        { status: 500 }
      );
    }

    // Generate OAuth URL
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirect_uri || `${request.nextUrl.origin}/api/auth/x`);
    authUrl.searchParams.set('scope', 'tweet.read users.read follows.read');
    authUrl.searchParams.set('state', 'random_state'); // In production, use proper state
    authUrl.searchParams.set('code_challenge', 'challenge'); // In production, use proper PKCE
    authUrl.searchParams.set('code_challenge_method', 'plain');

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}

