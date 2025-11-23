# Setup Guide - Step by Step

Complete guide to get your NFT minting app running.

## Part 1: X/Twitter API Setup (15 minutes)

### Step 1: Create Twitter Developer Account

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Click "Sign up" or "Apply"
3. Fill out the application form
4. Verify your email

### Step 2: Create Project & App

1. Click "+ Create Project"
2. Name: "NFT Minting App" (or any name)
3. Use case: "Making a bot" or "Exploring the API"
4. Description: "NFT minting with X authentication"
5. Create an App within the project

### Step 3: Enable OAuth 2.0

1. Go to your App settings
2. Click "Set up" under "User authentication settings"
3. Enable "OAuth 2.0"
4. App permissions: Read
5. Type of App: Web App
6. Callback URL: `http://localhost:3000/api/auth/x`
7. Website URL: `http://localhost:3000`
8. Save

### Step 4: Get API Keys

1. In "Keys and tokens" tab:

   - Copy **Client ID**
   - Click "Generate" for **Client Secret** and copy it
   - Click "Generate" for **Bearer Token** and copy it

2. Add to your `.env.local`:

```env
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here
TWITTER_API_BEARER_TOKEN=your_bearer_token_here
YOUR_TWITTER_USERNAME=your_twitter_handle
```

## Part 2: OnchainKit API Key (5 minutes)

1. Go to https://portal.cdp.coinbase.com/
2. Sign in with Coinbase account
3. Create new project
4. Copy API key
5. Add to `.env.local`:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here
```

## Part 3: Pinata Setup (5 minutes)

1. Go to https://pinata.cloud
2. Sign up for free account
3. Go to "API Keys" in sidebar
4. Click "New Key"
5. Enable all permissions
6. Name: "NFT Minting App"
7. Copy JWT
8. Go to "Gateways" and copy your dedicated gateway URL
9. Add to `.env.local`:

```env
PINATA_JWT=your_jwt_here
NEXT_PUBLIC_PINATA_GATEWAY=https://your-gateway.mypinata.cloud
```

## Part 4: Wallet Setup (5 minutes)

### For Deployment Wallet

1. Install MetaMask or use existing wallet
2. Switch to Base Sepolia network
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency: ETH
3. Get testnet ETH from https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
4. Export private key (KEEP SECURE!)
5. Add to `.env.local`:

```env
PRIVATE_KEY=0xyour_private_key_here
```

### For Backend Signer

Create a separate wallet for signing whitelist proofs:

1. Create new wallet address
2. Copy address and private key
3. Add to `.env.local`:

```env
BACKEND_SIGNER_ADDRESS=0xsigner_address_here
BACKEND_PRIVATE_KEY=0xsigner_private_key_here
```

⚠️ **Important**: Use different wallets for deployer and signer!

## Part 5: Deploy Contracts (10 minutes)

1. **Get Basescan API Key** (for verification):
   - Go to https://basescan.org/
   - Sign up/Login
   - Get API key from "API-KEYs" section
   - Add to `.env.local`:

```env
BASESCAN_API_KEY=your_basescan_key_here
```

2. **Compile contracts:**

```bash
cd nft-minting-app
npx hardhat compile
```

3. **Deploy to Base Sepolia:**

```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

4. **Copy output addresses** to `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # NFTCollection address
NEXT_PUBLIC_USDC_ADDRESS=0x...     # MockUSDC address
NEXT_PUBLIC_CHAIN_ID=84532
```

5. **Verify contracts** (optional but recommended):

```bash
npx hardhat verify --network baseSepolia YOUR_NFT_ADDRESS YOUR_SIGNER_ADDRESS YOUR_USDC_ADDRESS
```

## Part 6: Final Configuration (5 minutes)

1. **Complete `.env.local`:**

```env
# Add these remaining values
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=your_random_secret_here_use_openssl_rand_base64_32
```

Generate session secret:

```bash
openssl rand -base64 32
```

2. **Set initial phase** (start with whitelist):

Using Hardhat console:

```bash
npx hardhat console --network baseSepolia
```

In console:

```javascript
const NFT = await ethers.getContractFactory("NFTCollection");
const nft = await NFT.attach("YOUR_CONTRACT_ADDRESS");
await nft.setPhase(1); // 1 = Whitelist
```

Or use Basescan:

- Go to https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS#writeContract
- Connect wallet
- Call `setPhase(1)`

## Part 7: Run the App! (2 minutes)

1. **Start development server:**

```bash
npm run dev
```

2. **Open browser:**

http://localhost:3000

3. **Test the flow:**
   - Connect your Coinbase Wallet
   - Click "Connect with X"
   - Authorize the app
   - Follow your Twitter account
   - Click "Verify" to check follower status
   - Customize your NFT
   - Click "Mint Free (Whitelist)"

## Troubleshooting

### "Twitter API Error"

- Check all three Twitter credentials (Client ID, Secret, Bearer Token)
- Verify callback URL matches exactly: `http://localhost:3000/api/auth/x`
- Make sure OAuth 2.0 is enabled

### "Contract Not Deployed"

- Run `npx hardhat compile` first
- Check you have testnet ETH
- Verify network settings in hardhat.config.ts
- Make sure PRIVATE_KEY is set

### "Invalid Signature"

- Ensure BACKEND_SIGNER_ADDRESS and BACKEND_PRIVATE_KEY match
- Verify contract's signer address: `await contract.signer()`

### "Not a Follower"

- Actually follow the Twitter account
- Wait a few seconds and click verify again
- Check YOUR_TWITTER_USERNAME is set correctly

## Next Steps

### Switch to Public Phase

```bash
npx hardhat console --network baseSepolia
const nft = await NFT.attach("YOUR_CONTRACT_ADDRESS");
await nft.setPhase(2); // 2 = Public mint
```

### Test Public Minting

1. Get test USDC from MockUSDC faucet:

```bash
# In Hardhat console
const USDC = await ethers.getContractFactory("MockUSDC");
const usdc = await USDC.attach("YOUR_USDC_ADDRESS");
await usdc.faucet(); // Get 100 test USDC
```

2. Approve USDC in the UI
3. Mint for 1 USDC

### Deploy to Production

See README.md "Deployment" section for mainnet deployment.

## Support

- Base Docs: https://docs.base.org
- OnchainKit Docs: https://onchainkit.xyz
- Discord: https://discord.gg/buildonbase

Good luck! 🚀
