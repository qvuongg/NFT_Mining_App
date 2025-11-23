import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';

/**
 * Get current session info
 * GET /api/session
 */
export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ authenticated: false });
  }

  const session = await verifySession(sessionToken);

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    xUsername: session.xUsername,
    xUserId: session.xUserId,
    isFollower: session.isFollower || false,
    address: session.address,
  });
}

/**
 * Logout - clear session
 * POST /api/session/logout
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  return response;
}

