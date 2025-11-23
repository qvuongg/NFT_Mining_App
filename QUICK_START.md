# Quick Start Guide ⚡

Get your NFT minting app running in 30 minutes!

## Prerequisites Checklist

Before starting, you need:
- [ ] Node.js 18+ installed
- [ ] A wallet (MetaMask/Coinbase)
- [ ] Twitter/X account
- [ ] ~30 minutes of setup time

## Steps

### 1. Install Dependencies (2 min)

```bash
cd nft-minting-app
npm install
```

### 2. Get API Keys (15 min)

**Twitter API** - Follow SETUP_GUIDE.md Part 1
- Create app at https://developer.twitter.com
- Get: Client ID, Client Secret, Bearer Token

**OnchainKit** - 2 minutes
- Get key at https://portal.cdp.coinbase.com

**Pinata** - 2 minutes
- Get JWT at https://pinata.cloud

### 3. Setup Wallets (5 min)

**Deployer Wallet:**
- Get testnet ETH from https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Export private key

**Signer Wallet:**
- Create new wallet for signing
- Export address and private key

### 4. Configure Environment (3 min)

```bash
cp env.template .env.local
```

Fill in all values in `.env.local` - see env.template for all required fields.

### 5. Deploy Contracts (5 min)

```bash
# Compile
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# Copy addresses to .env.local:
# NEXT_PUBLIC_CONTRACT_ADDRESS=...
# NEXT_PUBLIC_USDC_ADDRESS=...
```

### 6. Set Phase to Whitelist (2 min)

```bash
npx hardhat console --network baseSepolia
```

In console:
```javascript
const NFT = await ethers.getContractFactory("NFTCollection");
const nft = await NFT.attach("YOUR_CONTRACT_ADDRESS");
await nft.setPhase(1); // Whitelist
```

### 7. Run & Test! (2 min)

```bash
npm run dev
```

Open http://localhost:3000

**Test Flow:**
1. Connect wallet
2. Connect X (authorize)
3. Follow your X account
4. Verify follower status
5. Customize NFT
6. Mint!

## Common Issues

**"Module not found"**
```bash
npm install --legacy-peer-deps
```

**"Twitter auth failed"**
- Check callback URL: `http://localhost:3000/api/auth/x`
- Verify all 3 Twitter credentials

**"Contract error"**
- Check NEXT_PUBLIC_CONTRACT_ADDRESS is set
- Verify you have testnet ETH

**"Invalid signature"**
- Ensure BACKEND_SIGNER_ADDRESS matches BACKEND_PRIVATE_KEY

## Environment Variables Quick Reference

```env
# Deployer (different from signer!)
PRIVATE_KEY=0x...

# Backend Signer (different from deployer!)
BACKEND_SIGNER_ADDRESS=0x...
BACKEND_PRIVATE_KEY=0x...

# Contracts
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=84532

# APIs
NEXT_PUBLIC_ONCHAINKIT_API_KEY=...
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
TWITTER_API_BEARER_TOKEN=...
YOUR_TWITTER_USERNAME=...
PINATA_JWT=...
NEXT_PUBLIC_PINATA_GATEWAY=https://...

# Other
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=...  # Generate with: openssl rand -base64 32
BASESCAN_API_KEY=...
```

## Next Steps

- Switch to public phase: `await nft.setPhase(2)`
- Get test USDC: `await usdc.faucet()`
- Test public minting
- Deploy to production (see README.md)

## Need Help?

- Full docs: README.md
- Detailed setup: SETUP_GUIDE.md
- Implementation details: IMPLEMENTATION_SUMMARY.md

Happy minting! 🎉

