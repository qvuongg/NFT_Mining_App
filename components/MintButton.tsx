'use client';

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { NFTTraits, getTraitName } from './NFTCustomizer';
import { uploadMetadata, uploadImage } from '@/lib/ipfs';
import { checkUSDCBalance, checkUSDCAllowance, approveUSDC, MINT_PRICE, USDC_ADDRESS } from '@/lib/usdc';
import { generateNFTImage } from '@/lib/nft-composer';

const NFT_CONTRACT_ABI = [
  'function currentPhase() view returns (uint8)',
  'function whitelistMint(bytes signature, string tokenURI) external',
  'function publicMint(string tokenURI) external',
  'function getNonce(address minter) view returns (uint256)',
];

enum MintPhase {
  CLOSED = 0,
  WHITELIST = 1,
  PUBLIC = 2,
}

interface WhitelistStatus {
  whitelisted: boolean;
  linked: boolean;
  hasMinted?: boolean;
}

interface Props {
  traits: NFTTraits;
  session?: {
    authenticated: boolean;
    isFollower?: boolean;
  };
  whitelistStatus?: WhitelistStatus;
}

export function MintButton({ traits, session, whitelistStatus }: Props) {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [phase, setPhase] = useState<MintPhase>(MintPhase.CLOSED);
  const [isMinting, setIsMinting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Fetch current phase and check USDC approval
  useEffect(() => {
    const fetch = async () => {
      if (!publicClient || !address) return;

      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        if (!contractAddress) return;

        const provider = new ethers.BrowserProvider(publicClient as any);
        const contract = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, provider);

        const currentPhase = await contract.currentPhase();
        setPhase(Number(currentPhase));

        // Check USDC approval for public phase
        if (Number(currentPhase) === MintPhase.PUBLIC) {
          const allowance = await checkUSDCAllowance(provider, address, contractAddress);
          setNeedsApproval(allowance < BigInt(MINT_PRICE));
        }
      } catch (error) {
        console.error('Error fetching phase:', error);
      }
    };

    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [publicClient, address]);

  const handleWhitelistMint = async () => {
    if (!address || !walletClient || !publicClient) return;

    setIsMinting(true);
    setError('');
    setStatus('Preparing mint...');

    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) throw new Error('Contract address not configured');

      // Get nonce
      const provider = new ethers.BrowserProvider(publicClient as any);
      const contract = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, provider);
      const nonce = await contract.getNonce(address);

      setStatus('Getting whitelist signature...');

      // Get signature from backend
      const signRes = await fetch('/api/sign-whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, nonce: Number(nonce) }),
      });

      if (!signRes.ok) {
        const errorData = await signRes.json();
        throw new Error(errorData.error || 'Failed to get signature');
      }

      const { signature } = await signRes.json();

      // Generate and upload composite NFT image
      setStatus('Generating NFT image...');
      let imageUri = '';
      
      try {
        const imageFile = await generateNFTImage(traits);
        setStatus('Uploading image to IPFS...');
        imageUri = await uploadImage(imageFile);
      } catch (error) {
        console.warn('Failed to upload image, continuing without image:', error);
        // Continue without image if generation fails
      }

      setStatus('Uploading metadata to IPFS...');

      // Upload metadata to IPFS
      const metadata = {
        name: `CustOMeow #${Date.now()}`,
        description: 'A customizable cat NFT created on Base',
        image: imageUri, // IPFS URI of the composite image
        attributes: [
          { trait_type: 'Background', value: getTraitName('background', traits.background) },
          { trait_type: 'Cat', value: getTraitName('cat', traits.cat) },
          { trait_type: 'Eyes', value: getTraitName('eyes', traits.eyes) },
          { trait_type: 'Mouth', value: getTraitName('mouth', traits.mouth) },
        ],
      };

      const tokenURI = await uploadMetadata(metadata);

      setStatus('Minting NFT...');

      // Mint NFT
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, signer);
      const tx = await contractWithSigner.whitelistMint(signature, tokenURI);

      setStatus('Waiting for confirmation...');
      await tx.wait();

      setStatus('✅ Successfully minted!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      console.error('Mint error:', error);
      setError(error.message || 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  const handleApproveUSDC = async () => {
    if (!address || !walletClient || !publicClient) return;

    setIsApproving(true);
    setError('');
    setStatus('Approving USDC...');

    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) throw new Error('Contract address not configured');

      const provider = new ethers.BrowserProvider(publicClient as any);
      const signer = await provider.getSigner();

      // Approve USDC
      const tx = await approveUSDC(signer, contractAddress, BigInt(MINT_PRICE) * 10n); // Approve 10x for multiple mints

      setStatus('Waiting for approval...');
      await tx.wait();

      setNeedsApproval(false);
      setStatus('✅ USDC approved!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      console.error('Approval error:', error);
      setError(error.message || 'Failed to approve USDC');
    } finally {
      setIsApproving(false);
    }
  };

  const handlePublicMint = async () => {
    if (!address || !walletClient || !publicClient) return;

    setIsMinting(true);
    setError('');
    setStatus('Preparing mint...');

    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) throw new Error('Contract address not configured');

      const provider = new ethers.BrowserProvider(publicClient as any);

      // Check USDC balance
      setStatus('Checking USDC balance...');
      const balance = await checkUSDCBalance(provider, address);
      if (balance < BigInt(MINT_PRICE)) {
        throw new Error('Insufficient USDC balance. Need 1 USDC to mint.');
      }

      // Generate and upload composite NFT image
      setStatus('Generating NFT image...');
      let imageUri = '';
      
      try {
        const imageFile = await generateNFTImage(traits);
        setStatus('Uploading image to IPFS...');
        imageUri = await uploadImage(imageFile);
      } catch (error) {
        console.warn('Failed to upload image, continuing without image:', error);
        // Continue without image if generation fails
      }

      setStatus('Uploading metadata to IPFS...');

      // Upload metadata
      const metadata = {
        name: `CustOMeow #${Date.now()}`,
        description: 'A customizable cat NFT created on Base',
        image: imageUri, // IPFS URI of the composite image
        attributes: [
          { trait_type: 'Background', value: getTraitName('background', traits.background) },
          { trait_type: 'Cat', value: getTraitName('cat', traits.cat) },
          { trait_type: 'Eyes', value: getTraitName('eyes', traits.eyes) },
          { trait_type: 'Mouth', value: getTraitName('mouth', traits.mouth) },
        ],
      };

      const tokenURI = await uploadMetadata(metadata);

      setStatus('Minting NFT for 1 USDC...');

      // Mint NFT
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, signer);
      const tx = await contract.publicMint(tokenURI);

      setStatus('Waiting for confirmation...');
      await tx.wait();

      setStatus('✅ Successfully minted!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      console.error('Mint error:', error);
      setError(error.message || 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  // Determine button state
  if (!isConnected) {
    return (
      <button
        disabled
        className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-gray-400 bg-gray-200 text-gray-500 cursor-not-allowed"
      >
        Connect Wallet to Mint
      </button>
    );
  }

  if (phase === MintPhase.CLOSED) {
    return (
      <button
        disabled
        className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-gray-400 bg-gray-200 text-gray-500 cursor-not-allowed"
      >
        🔒 Minting Closed
      </button>
    );
  }

  if (phase === MintPhase.WHITELIST) {
    // Not connected to X
    if (!session?.authenticated) {
      return (
        <button
          disabled
          className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-gray-400 bg-gray-200 text-gray-500 cursor-not-allowed"
        >
          ⓵ Connect X First (Whitelist Phase)
        </button>
      );
    }

    // Not a follower
    if (!session.isFollower) {
      return (
        <button
          disabled
          className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-orange-600 bg-orange-100 text-orange-700 cursor-not-allowed"
        >
          ⓶ Follow on X to Get Whitelist
        </button>
      );
    }

    // Follower but wallet not linked
    if (!whitelistStatus?.linked) {
      return (
        <button
          disabled
          className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-purple-600 bg-purple-100 text-purple-700 cursor-not-allowed"
        >
          ⓷ Link Your Wallet Above ↑
        </button>
      );
    }

    // Already minted
    if (whitelistStatus?.hasMinted) {
      return (
        <button
          disabled
          className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-gray-400 bg-gray-200 text-gray-600 cursor-not-allowed"
        >
          ✓ Already Minted with This Account
        </button>
      );
    }

    // Ready to mint!
    return (
      <div className="space-y-2">
        <button
          onClick={handleWhitelistMint}
          disabled={isMinting}
          className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-green-600 bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all shadow-lg shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isMinting ? '⏳ Minting...' : '🎁 Mint FREE Now!'}
        </button>
        {status && <p className="text-center text-sm text-blue-600 font-medium">{status}</p>}
        {error && <p className="text-center text-sm text-red-600 font-medium">{error}</p>}
      </div>
    );
  }

  if (phase === MintPhase.PUBLIC) {
    if (needsApproval) {
      return (
        <div className="space-y-2">
          <button
            onClick={handleApproveUSDC}
            disabled={isApproving}
            className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-blue-600 bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? '⏳ Approving...' : '1️⃣ Approve USDC'}
          </button>
          {status && <p className="text-center text-sm text-blue-600 font-medium">{status}</p>}
          {error && <p className="text-center text-sm text-red-600 font-medium">{error}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <button
          onClick={handlePublicMint}
          disabled={isMinting}
          className="w-full px-6 py-4 font-bold text-lg rounded-xl border-4 border-blue-600 bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMinting ? '⏳ Minting...' : '💵 Mint for 1 USDC'}
        </button>
        {status && <p className="text-center text-sm text-blue-600 font-medium">{status}</p>}
        {error && <p className="text-center text-sm text-red-600 font-medium">{error}</p>}
      </div>
    );
  }

  return null;
}

