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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fef4f4] via-[#f0e8ff] to-[#dff7ff]">
      {/* Decorative snow layers */}
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:120px_120px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 to-transparent" />

      {/* Header */}
      <header className="relative border-b border-white/40 backdrop-blur bg-white/70 shadow-xl shadow-emerald-100/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <svg
              className="w-12 h-12 text-rose-500 drop-shadow-lg"
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
            <div>
              <h1 className="text-3xl font-black text-emerald-700 tracking-tight">
                CustOMeow Noel
              </h1>
              <p className="text-sm text-gray-600">Mint your holiday kitty ✨</p>
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
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
      <div className="relative max-w-7xl mx-auto px-6 py-12">
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
        <div className="mt-16 rounded-3xl border border-white/60 bg-white/80 backdrop-blur-lg p-8 shadow-xl shadow-emerald-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🎄</div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-rose-400 font-semibold">
                Holiday Steps
              </p>
              <h2 className="text-3xl font-black text-emerald-800">Mint in Three Beats</h2>
            </div>
          </div>
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
      <footer className="relative bg-emerald-900 text-white py-8 mt-16 shadow-inner shadow-emerald-700/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-emerald-100">
            Built on{' '}
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-200 hover:text-white font-semibold"
            >
              Base
            </a>{' '}
            with{' '}
            <a
              href="https://onchainkit.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-200 hover:text-white font-semibold"
            >
              OnchainKit
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
