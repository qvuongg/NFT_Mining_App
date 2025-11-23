'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface SessionData {
  authenticated: boolean;
  xUsername?: string;
  isFollower?: boolean;
}

interface WhitelistStatus {
  whitelisted: boolean;
  linked: boolean;
  xUsername?: string;
  hasMinted?: boolean;
}

interface Props {
  onWhitelistChange?: (status: WhitelistStatus) => void;
}

export function XConnect({ onWhitelistChange }: Props) {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [hasClickedFollow, setHasClickedFollow] = useState(false);

  // Fetch current session
  const { data: session } = useQuery<SessionData>({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/session');
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30s
  });

  // Check whitelist status
  const { data: whitelistStatus } = useQuery<WhitelistStatus>({
    queryKey: ['whitelist', address],
    queryFn: async () => {
      if (!address) return { whitelisted: false, linked: false };
      const res = await fetch(`/api/link-wallet?address=${address}`);
      return res.json();
    },
    enabled: !!address,
    refetchInterval: 10000, // Check every 10s
  });

  // Load follow status from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.xUsername) {
      const stored = localStorage.getItem(`followed_${session.xUsername}`);
      setHasClickedFollow(stored === 'true');
    }
  }, [session?.xUsername]);

  // Notify parent of whitelist changes (consider followed as verified)
  useEffect(() => {
    if (whitelistStatus && onWhitelistChange) {
      // If user has clicked follow, set them as follower
      const status = {
        ...whitelistStatus,
        xUsername: session?.xUsername,
      };
      onWhitelistChange(status);
    }
  }, [whitelistStatus, hasClickedFollow, session?.xUsername, onWhitelistChange]);

  // Handle follow button click
  const handleFollowClick = () => {
    // Open Twitter profile in new tab
    window.open('https://twitter.com/Brick_Kerth', '_blank');
    
    // Mark as clicked and save to localStorage
    setHasClickedFollow(true);
    if (typeof window !== 'undefined' && session?.xUsername) {
      localStorage.setItem(`followed_${session.xUsername}`, 'true');
    }
    
    // Trigger session refetch to update whitelist status
      queryClient.invalidateQueries({ queryKey: ['session'] });
  };

  // Handle X login
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/auth/x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redirect_uri: `${window.location.origin}/api/auth/x`,
        }),
      });

      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate X auth:', error);
      setIsConnecting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await fetch('/api/session', { method: 'POST' });
    queryClient.setQueryData(['session'], { authenticated: false });
  };

  // Handle link wallet
  const handleLinkWallet = async () => {
    if (!address || !isConnected) {
      setLinkError('Please connect your wallet first');
      return;
    }

    setIsLinking(true);
    setLinkError('');
    setLinkSuccess(false);

    try {
      const res = await fetch('/api/link-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to link wallet');
      }

      setLinkSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['whitelist', address] });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setLinkSuccess(false), 3000);
    } catch (error: any) {
      console.error('Link wallet error:', error);
      setLinkError(error.message);
    } finally {
      setIsLinking(false);
    }
  };


  if (!session?.authenticated) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Connect with X
          </>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-white font-medium">@{session.xUsername}</span>
          {hasClickedFollow && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
              ✓ Followed
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Follow @Brick_Kerth Step */}
      {!hasClickedFollow && (
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">🐦 Follow @Brick_Kerth</p>
              <p className="text-xs text-gray-400">Click to follow on X/Twitter to unlock minting</p>
            </div>
            <button
              onClick={handleFollowClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow Now
            </button>
          </div>
        </div>
      )}

      {/* Whitelist Status & Link Wallet */}
      {isConnected && address && hasClickedFollow && (
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
          {whitelistStatus?.linked ? (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  ✓ You have Whitelist Access!
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Wallet {address.slice(0, 6)}...{address.slice(-4)} linked to @{whitelistStatus.xUsername}
                </p>
                {whitelistStatus.hasMinted && (
                  <p className="text-xs text-yellow-400 mt-1">⚠️ Already minted</p>
                )}
              </div>
              <div className="text-3xl">🎉</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white mb-1">🎁 Free Mint Available!</p>
                <p className="text-xs text-gray-400">Link your wallet to claim whitelist access</p>
              </div>
              <button
                onClick={handleLinkWallet}
                disabled={isLinking}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLinking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Linking...
                  </>
                ) : (
                  <>🔗 Link Wallet & Get Whitelist</>
                )}
              </button>
              {linkError && (
                <p className="text-xs text-red-400 text-center">{linkError}</p>
              )}
              {linkSuccess && (
                <p className="text-xs text-green-400 text-center font-semibold">
                  ✓ Wallet linked successfully! You can now mint for free.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

