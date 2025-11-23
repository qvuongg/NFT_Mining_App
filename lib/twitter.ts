import axios from 'axios';

/**
 * Exchange OAuth code for access token
 */
export async function getAccessToken(code: string, redirectUri: string) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Twitter API credentials not configured');
  }

  const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
  
  const params = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code_verifier: 'challenge', // In production, use PKCE properly
  });

  const response = await axios.post(tokenUrl, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
  });

  return response.data;
}

/**
 * Get user's Twitter profile
 */
export async function getTwitterUser(accessToken: string) {
  const response = await axios.get('https://api.twitter.com/2/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
}

/**
 * Check if user follows a specific Twitter account
 */
export async function checkFollowing(
  userId: string,
  targetUsername: string
): Promise<boolean> {
  const bearerToken = process.env.TWITTER_API_BEARER_TOKEN;
  
  if (!bearerToken) {
    throw new Error('Twitter Bearer Token not configured');
  }

  try {
    // Get target user ID
    const targetUserResponse = await axios.get(
      `https://api.twitter.com/2/users/by/username/${targetUsername}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const targetUserId = targetUserResponse.data.data.id;

    // Check if user follows target
    const followingResponse = await axios.get(
      `https://api.twitter.com/2/users/${userId}/following`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        params: {
          max_results: 1000,
        },
      }
    );

    const followingList = followingResponse.data.data || [];
    return followingList.some((user: any) => user.id === targetUserId);
  } catch (error) {
    console.error('Error checking following status:', error);
    return false;
  }
}

