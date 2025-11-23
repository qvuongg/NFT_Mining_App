import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import { signWhitelistProof } from '@/lib/signature';
import { getByWalletAddress, markAsMinted } from '@/lib/database';
import { ethers } from 'ethers';

/**
 * Sign whitelist proof for linked wallets
 * POST /api/sign-whitelist with { address, nonce }
 * Requires wallet to be linked to a follower's Twitter account
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { address, nonce } = await request.json();

    if (!address || nonce === undefined) {
      return NextResponse.json(
        { error: 'Address and nonce are required' },
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

    // Check if wallet is in whitelist database
    const whitelistEntry = await getByWalletAddress(address);

    if (!whitelistEntry) {
      return NextResponse.json(
        { 
          error: 'Wallet not whitelisted. Please link your wallet first by following our X account.',
          needsLinking: true
        },
        { status: 403 }
      );
    }

    // Check if already minted
    if (whitelistEntry.hasMinted) {
      return NextResponse.json(
        { 
          error: `This wallet already minted with @${whitelistEntry.xUsername}`,
          alreadyMinted: true
        },
        { status: 403 }
      );
    }

    // Get backend private key
    const privateKey = process.env.BACKEND_PRIVATE_KEY;

    if (!privateKey) {
      return NextResponse.json(
        { error: 'Backend signer not configured' },
        { status: 500 }
      );
    }

    // Sign whitelist proof
    const signature = await signWhitelistProof(address, nonce, privateKey);

    // Mark as minted (will be confirmed on-chain anyway)
    await markAsMinted(address);

    return NextResponse.json({
      signature,
      nonce,
      address,
      xUsername: whitelistEntry.xUsername,
      message: 'Signature generated successfully',
    });
  } catch (error) {
    console.error('Error signing whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to sign whitelist proof' },
      { status: 500 }
    );
  }
}

