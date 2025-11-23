'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useChainId } from 'wagmi';

const NFT_CONTRACT_ABI = [
  'function currentPhase() view returns (uint8)',
];

enum MintPhase {
  CLOSED = 0,
  WHITELIST = 1,
  PUBLIC = 2,
}

export function PhaseIndicator() {
  const [phase, setPhase] = useState<MintPhase>(MintPhase.CLOSED);
  const [loading, setLoading] = useState(true);
  const chainId = useChainId();

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        if (!contractAddress) {
          setLoading(false);
          return;
        }

        // Get RPC URL based on chain
        const rpcUrl = chainId === 8453
          ? 'https://mainnet.base.org'
          : 'https://sepolia.base.org';

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const contract = new ethers.Contract(
          contractAddress,
          NFT_CONTRACT_ABI,
          provider
        );

        const currentPhase = await contract.currentPhase();
        setPhase(Number(currentPhase));
      } catch (error) {
        console.error('Error fetching phase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhase();
    const interval = setInterval(fetchPhase, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [chainId]);

  if (loading) {
    return (
      <div className="px-4 py-2 bg-gray-800 rounded-lg text-white">
        Loading phase...
      </div>
    );
  }

  const phaseConfig = {
    [MintPhase.CLOSED]: {
      label: '🔒 Minting Closed',
      bg: 'bg-gray-700',
      text: 'text-gray-300',
    },
    [MintPhase.WHITELIST]: {
      label: '🎁 Whitelist Phase - Free for Followers',
      bg: 'bg-green-600',
      text: 'text-white',
    },
    [MintPhase.PUBLIC]: {
      label: '🌐 Public Mint - 1 USDC',
      bg: 'bg-blue-600',
      text: 'text-white',
    },
  };

  const config = phaseConfig[phase];

  return (
    <div className={`px-6 py-3 ${config.bg} rounded-lg ${config.text} font-bold text-center`}>
      {config.label}
    </div>
  );
}

