# CustOMeow - NFT Minting on Base 🐱

A modern NFT minting dapp on Base blockchain with X/Twitter-based whitelist and customizable cat NFTs.

## Features

- ✨ **Two-Phase Minting**
  - Phase 1: Free whitelist mint for X/Twitter followers (link wallet required)
  - Phase 2: Public mint for 1 USDC
- 🎨 **Customizable NFTs**: Choose background, cat type, eyes, and mouth
- 🎲 **Random Generation**: Slot machine animation for random trait selection
- 🔐 **X/Twitter Integration**: OAuth-based follower verification + wallet linking
- 💰 **USDC Payments**: ERC-20 token integration for public minting
- 📥 **Download PFP**: Export your creation as an image
- 🔗 **Coinbase Wallet**: Seamless wallet connection with OnchainKit
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔒 **Secure Whitelist**: 1 Twitter account = 1 wallet = 1 free mint

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Framer Motion
- **Blockchain**: Base (Ethereum L2), Solidity, Hardhat
- **Web3**: OnchainKit, wagmi, viem, ethers.js
- **Backend**: Vercel Serverless Functions
- **Storage**: IPFS (Pinata)
- **Auth**: X/Twitter OAuth 2.0

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- X/Twitter Developer account with API keys
- Pinata account for IPFS
- OnchainKit API key
- Wallet with Base Sepolia testnet ETH

### Installation

1. **Clone and install dependencies:**

```bash
cd nft-minting-app
npm install
```

2. **Configure environment variables:**

Create `.env.local` file (copy from `env.template`):

```bash
cp env.template .env.local
```

Fill in the required values:

```env
# Blockchain (for Hardhat deployment)
PRIVATE_KEY=your_deployer_private_key
BACKEND_SIGNER_ADDRESS=your_backend_signer_address
BASESCAN_API_KEY=your_basescan_api_key

# Frontend
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_USDC_ADDRESS=usdc_contract_address
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend
BACKEND_PRIVATE_KEY=your_backend_signer_private_key

# X/Twitter
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret
TWITTER_API_BEARER_TOKEN=your_bearer_token
YOUR_TWITTER_USERNAME=your_handle

# Pinata
PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PINATA_GATEWAY=your_gateway_url

# Session
SESSION_SECRET=random_secret_string
```

### Setup X/Twitter API

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Enable OAuth 2.0 with PKCE
4. Add callback URL: `http://localhost:3000/api/auth/x` (or your production URL)
5. Get Client ID, Client Secret, and Bearer Token
6. Set required scopes: `tweet.read`, `users.read`, `follows.read`

### Setup Pinata (IPFS)

1. Create account at [Pinata](https://pinata.cloud)
2. Generate new API key (JWT)
3. Get your dedicated gateway URL
4. Add to `.env.local`

### Setup OnchainKit

1. Get API key from [OnchainKit](https://portal.cdp.coinbase.com/)
2. Add to `.env.local`

### Deploy Smart Contracts

1. **Get testnet ETH:**

```bash
# Get Base Sepolia ETH from faucet
# https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
```

2. **Compile contracts:**

```bash
npx hardhat compile
```

3. **Deploy to Base Sepolia:**

```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

4. **Copy deployed contract addresses to `.env.local`:**

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...  # MockUSDC address from deployment
```

5. **Verify contracts:**

```bash
npx hardhat verify --network baseSepolia DEPLOYED_NFT_ADDRESS SIGNER_ADDRESS USDC_ADDRESS
```

6. **Set minting phase:**

Use Hardhat console or Etherscan:

```bash
# Open console
npx hardhat console --network baseSepolia

# In console:
const NFT = await ethers.getContractFactory("NFTCollection");
const nft = await NFT.attach("YOUR_CONTRACT_ADDRESS");
await nft.setPhase(1); // 1 = Whitelist, 2 = Public
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nft-minting-app/
├── app/
│   ├── api/              # API routes (Vercel functions)
│   │   ├── auth/x/       # X OAuth
│   │   ├── verify-follower/
│   │   ├── sign-whitelist/
│   │   └── session/
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Main minting page
│   └── providers.tsx     # Wagmi & OnchainKit providers
├── components/
│   ├── WalletConnect.tsx      # Coinbase Wallet connection
│   ├── XConnect.tsx           # X/Twitter auth
│   ├── PhaseIndicator.tsx     # Current minting phase
│   ├── NFTPreview.tsx         # NFT visual preview
│   ├── NFTCustomizer.tsx      # Trait selection UI
│   ├── RandomGenerator.tsx    # Random trait animation
│   └── MintButton.tsx         # Phase-aware mint button
├── lib/
│   ├── signature.ts      # EIP-712 signing
│   ├── session.ts        # JWT sessions
│   ├── twitter.ts        # X API calls
│   ├── ipfs.ts           # Pinata uploads
│   └── usdc.ts           # USDC utilities
├── contracts/
│   ├── NFTCollection.sol # Main NFT contract
│   └── MockUSDC.sol      # Test USDC
├── scripts/
│   └── deploy.ts         # Deployment script
└── hardhat.config.ts
```

## Smart Contract

### NFTCollection.sol

ERC-721 NFT with two-phase minting:

**Phase 1 - Whitelist:**

- Free minting for X followers who link their wallet
- Each Twitter account can link only one wallet
- Signature-based verification (EIP-712)
- Backend signs proof after checking database linkage
- Prevents abuse: 1 account = 1 mint

**Phase 2 - Public:**

- 1 USDC per mint
- Open to everyone
- USDC transferred to contract, withdrawable by owner

**Key Functions:**

- `whitelistMint(bytes signature, string tokenURI)` - Mint with signature
- `publicMint(string tokenURI)` - Mint for 1 USDC
- `setPhase(uint8 phase)` - Change minting phase (owner)
- `withdrawUSDC()` - Withdraw collected USDC (owner)

## Deployment

### Deploy to Production

1. **Update environment variables for mainnet:**

```env
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_CONTRACT_ADDRESS=mainnet_address
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

2. **Deploy contracts to Base mainnet:**

```bash
npx hardhat run scripts/deploy.ts --network base
```

3. **Deploy frontend to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

4. **Update X OAuth callback URL** in Twitter Developer Portal to production URL

## Testing

### Test Whitelist Flow

1. Connect X account (OAuth)
2. Follow the project X account
3. Verify follower status (should show "✓ Follower")
4. Connect Coinbase Wallet
5. Click "Link Wallet & Get Whitelist"
6. See "✓ You have Whitelist Access!"
7. Customize NFT or hit random
8. Click "Mint FREE Now!"
9. Approve transaction in wallet

**Note**: Each Twitter account can only link ONE wallet, and each wallet can only be linked to ONE Twitter account.

### Test Public Flow

1. Set phase to Public: `await contract.setPhase(2)`
2. Get test USDC: Call `faucet()` on MockUSDC contract
3. Connect wallet
4. Click "Approve USDC" first
5. Click "Mint for 1 USDC"
6. Approve both transactions

## Security Considerations

- ✅ Backend signer separate from deployer
- ✅ EIP-712 typed signatures prevent replay attacks
- ✅ Nonces prevent signature reuse
- ✅ **Whitelist database: 1 Twitter = 1 Wallet = 1 Mint**
- ✅ USDC approval required before minting
- ✅ Session tokens for auth state
- ✅ Database tracks mint status to prevent double-claiming

## Documentation

- **[WHITELIST_FLOW.md](WHITELIST_FLOW.md)** - Complete whitelist system documentation
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

## Troubleshooting

**Issue: "Not authenticated"**

- Clear cookies and reconnect X account
- Check X API credentials in `.env.local`

**Issue: "Invalid signature"**

- Ensure BACKEND_PRIVATE_KEY and BACKEND_SIGNER_ADDRESS match
- Check that contract's signer address is set correctly

**Issue: "USDC transfer failed"**

- Approve USDC spending first
- Check USDC balance (use faucet on testnet)
- Verify USDC contract address

**Issue: "Transaction reverted"**

- Check current phase with `contract.currentPhase()`
- Verify you're a follower for whitelist phase
- Check USDC approval for public phase

## Links

- **Base Docs**: https://docs.base.org
- **OnchainKit**: https://onchainkit.xyz
- **Base Sepolia Faucet**: https://www.coinbase.com/faucets
- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **Base Mainnet Explorer**: https://basescan.org

## License

MIT
