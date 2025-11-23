import { SignJWT, jwtVerify } from 'jose';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-me'
);

export interface SessionData {
  address?: string;
  xUsername?: string;
  xUserId?: string;
  xAccessToken?: string;
  isFollower?: boolean;
  expiresAt: number;
}

/**
 * Create a JWT session token
 */
export async function createSession(data: Omit<SessionData, 'expiresAt'>): Promise<string> {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const token = await new SignJWT({ ...data, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SESSION_SECRET);

  return token;
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    
    if (!payload || typeof payload.expiresAt !== 'number') {
      return null;
    }

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload as SessionData;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Update session data
 */
export async function updateSession(
  oldToken: string,
  updates: Partial<Omit<SessionData, 'expiresAt'>>
): Promise<string | null> {
  const session = await verifySession(oldToken);
  if (!session) return null;

  return createSession({
    ...session,
    ...updates,
  });
}

