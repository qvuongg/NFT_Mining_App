import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import { linkWallet, getByTwitterId } from '@/lib/database';
import { ethers } from 'ethers';

/**
 * Link wallet address to Twitter account for whitelist
 * POST /api/link-wallet with { address }
 * Requires session cookie with isFollower=true
 */
export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionToken = request.cookies.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect with X first.' },
        { status: 401 }
      );
    }

    // Verify session
    const session = await verifySession(sessionToken);

    if (!session || !session.xUsername || !session.xUserId) {
      return NextResponse.json(
        { error: 'Invalid session. Please reconnect with X.' },
        { status: 401 }
      );
    }

    // Check if user is a follower
    if (!session.isFollower) {
      return NextResponse.json(
        { 
          error: 'Not a follower. Please follow our X account to get whitelist access.',
          needsFollow: true 
        },
        { status: 403 }
      );
    }

    // Parse request body
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate address
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Link wallet to Twitter account
    const result = await linkWallet(
      session.xUserId,
      session.xUsername,
      address
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet linked successfully! You are now whitelisted.',
      xUsername: session.xUsername,
      walletAddress: address.toLowerCase(),
      whitelisted: true,
    });
  } catch (error) {
    console.error('Error linking wallet:', error);
    return NextResponse.json(
      { error: 'Failed to link wallet' },
      { status: 500 }
    );
  }
}

/**
 * Check if user's wallet is linked and whitelisted
 * GET /api/link-wallet?address=0x...
 */
export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');

    if (!address || !ethers.isAddress(address)) {
      return NextResponse.json(
        { whitelisted: false, error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Get session to verify Twitter connection
    const sessionToken = request.cookies.get('session')?.value;
    let xUsername: string | undefined;

    if (sessionToken) {
      const session = await verifySession(sessionToken);
      if (session) {
        xUsername = session.xUsername;
        
        // Check if this Twitter account is linked
        const entry = await getByTwitterId(session.xUserId!);
        if (entry && entry.walletAddress === address.toLowerCase()) {
          return NextResponse.json({
            whitelisted: true,
            linked: true,
            xUsername: entry.xUsername,
            hasMinted: entry.hasMinted,
            linkedAt: entry.linkedAt,
          });
        }
      }
    }

    return NextResponse.json({
      whitelisted: false,
      linked: false,
      message: 'Wallet not linked to any whitelisted Twitter account',
    });
  } catch (error) {
    console.error('Error checking whitelist:', error);
    return NextResponse.json(
      { whitelisted: false, error: 'Failed to check whitelist' },
      { status: 500 }
    );
  }
}
