import { NextRequest, NextResponse } from 'next/server';
import { verifySession, updateSession } from '@/lib/session';
import { checkFollowing } from '@/lib/twitter';

/**
 * Verify if user follows the project's X account
 * GET /api/verify-follower
 * Requires session cookie
 */
export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionToken = request.cookies.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify session
    const session = await verifySession(sessionToken);

    if (!session || !session.xUserId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // For Free tier compatibility: Auto-approve all X connected users
    // In production with paid tier, uncomment below to verify actual follower status
    
    // const targetUsername = process.env.YOUR_TWITTER_USERNAME;
    // if (!targetUsername) {
    //   return NextResponse.json(
    //     { error: 'Target Twitter account not configured' },
    //     { status: 500 }
    //   );
    // }
    // const isFollower = await checkFollowing(session.xUserId, targetUsername);
    
    // Free tier workaround: Auto-approve all connected users
    const isFollower = true;

    // Update session with follower status
    const updatedSession = await updateSession(sessionToken, {
      isFollower,
    });

    const response = NextResponse.json({
      isFollower,
      xUsername: session.xUsername,
      xUserId: session.xUserId,
    });

    // Update cookie with new session
    if (updatedSession) {
      response.cookies.set('session', updatedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error verifying follower:', error);
    return NextResponse.json(
      { error: 'Failed to verify follower status' },
      { status: 500 }
    );
  }
}

