'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WalletConnect } from '@/components/WalletConnect';
import { XConnect } from '@/components/XConnect';
import { PhaseIndicator } from '@/components/PhaseIndicator';
import { NFTPreview } from '@/components/NFTPreview';
import { NFTCustomizer, NFTTraits } from '@/components/NFTCustomizer';
import { RandomGenerator } from '@/components/RandomGenerator';
import { MintButton } from '@/components/MintButton';

interface WhitelistStatus {
  whitelisted: boolean;
  linked: boolean;
  hasMinted?: boolean;
}

export default function Home() {
  const [traits, setTraits] = useState<NFTTraits>({
    background: 'green',
    cat: 'orange',
    eyes: 'normal',
    mouth: 'happy',
  });
  const [whitelistStatus, setWhitelistStatus] = useState<WhitelistStatus | undefined>();

  // Fetch session data
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/session');
      return res.json();
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg
              className="w-10 h-10 text-blue-600"
              viewBox="0 0 48 48"
              fill="currentColor"
            >
              <circle cx="24" cy="24" r="24" fill="currentColor" />
              <text
                x="24"
                y="32"
                fontSize="24"
                textAnchor="middle"
                fill="white"
                fontWeight="bold"
              >
                B
              </text>
            </svg>
            <h1 className="text-2xl font-black text-gray-800">CustOMeow</h1>
          </div>

          {/* Phase Indicator */}
          <div className="flex-1 max-w-md mx-8">
            <PhaseIndicator />
          </div>

          {/* Wallet & X Connect */}
          <div className="flex items-center gap-4">
            <XConnect onWhitelistChange={setWhitelistStatus} />
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Panel - Preview */}
          <div className="space-y-6">
            <NFTPreview traits={traits} />
            <RandomGenerator onRandomize={setTraits} />
          </div>

          {/* Right Panel - Customizer */}
          <div className="space-y-6">
            <NFTCustomizer traits={traits} onTraitsChange={setTraits} />
            <MintButton traits={traits} session={session} whitelistStatus={whitelistStatus} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-white rounded-2xl border-4 border-gray-800 p-8 shadow-xl">
          <h2 className="text-2xl font-black text-gray-800 mb-4">How to Mint</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🐦</div>
              <h3 className="font-bold text-lg mb-2">1. Connect X & Follow</h3>
              <p className="text-gray-600 text-sm">
                Connect your X/Twitter account and follow us for whitelist
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="font-bold text-lg mb-2">2. Link Your Wallet</h3>
              <p className="text-gray-600 text-sm">
                Connect wallet and link it to claim your whitelist spot
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-bold text-lg mb-2">3. Customize & Mint</h3>
              <p className="text-gray-600 text-sm">
                Design your cat and mint for free! (Whitelist phase)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            Built on{' '}
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Base
            </a>{' '}
            with{' '}
            <a
              href="https://onchainkit.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              OnchainKit
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
