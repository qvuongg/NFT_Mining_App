# Whitelist Flow Documentation

Complete documentation for the new whitelist system using Twitter follower verification + wallet linking.

## Overview

The whitelist system ensures **1 Twitter account = 1 wallet address = 1 free mint**. This prevents abuse while maintaining a good user experience.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              WHITELIST MINT FLOW (Updated)                   │
└─────────────────────────────────────────────────────────────┘

Step 1: Connect Twitter
  ↓
  User clicks "Connect with X"
  → OAuth flow
  → Backend saves session: { xUserId, xUsername }
  ✓ Session created

Step 2: Verify Follower
  ↓
  User clicks "Verify" (auto-triggered)
  → Backend calls Twitter API
  → Check if user follows project account
  → Update session: { isFollower: true }
  ✓ Follower status verified

Step 3: Connect Wallet
  ↓
  User connects Coinbase Wallet
  → Frontend knows wallet address
  ✓ Wallet connected

Step 4: Link Wallet (NEW!)
  ↓
  User sees: "🎁 Free Mint Available! Link your wallet"
  User clicks "Link Wallet & Get Whitelist"
  ↓
  → POST /api/link-wallet { address }
  → Backend checks:
     ✓ Session exists and isFollower=true?
     ✓ Twitter account not already linked?
     ✓ Wallet not already linked?
  → Save to database:
     {
       xUserId: "123",
       xUsername: "@user",
       walletAddress: "0xabc...",
       linkedAt: timestamp,
       hasMinted: false
     }
  ✓ Wallet linked successfully!

  Frontend shows: "✓ You have Whitelist Access!"

Step 5: Mint Free NFT
  ↓
  User customizes NFT traits
  User clicks "Mint FREE Now!"
  ↓
  → POST /api/sign-whitelist { address, nonce }
  → Backend checks database:
     ✓ Wallet linked to a follower?
     ✓ Not already minted?
  → Sign EIP-712 signature
  → Mark hasMinted = true
  → Return signature
  ↓
  → Frontend calls contract.whitelistMint(signature, tokenURI)
  → Smart contract verifies signature
  → NFT minted! 🎉
```

## Architecture

### 1. Database Layer (`lib/database.ts`)

Simple file-based JSON database for development. Stores:

```typescript
interface WhitelistEntry {
  xUserId: string; // Twitter user ID
  xUsername: string; // @username
  walletAddress: string; // Linked wallet (lowercase)
  linkedAt: number; // Timestamp when linked
  hasMinted: boolean; // Prevent double minting
  mintedAt?: number; // Timestamp when minted
}
```

Dual index structure for fast lookups:

- `byTwitter`: Query by Twitter user ID
- `byWallet`: Query by wallet address

### 2. API Endpoints

#### `/api/link-wallet` (NEW)

**POST** - Link wallet to Twitter account

Request:

```json
{
  "address": "0xABCD..."
}
```

Response (success):

```json
{
  "success": true,
  "message": "Wallet linked successfully!",
  "xUsername": "@user",
  "walletAddress": "0xabcd...",
  "whitelisted": true
}
```

Response (error):

```json
{
  "error": "Not a follower. Please follow our X account...",
  "needsFollow": true
}
```

**GET** - Check whitelist status

Query: `/api/link-wallet?address=0xABCD...`

Response:

```json
{
  "whitelisted": true,
  "linked": true,
  "xUsername": "@user",
  "hasMinted": false,
  "linkedAt": 1234567890
}
```

#### `/api/sign-whitelist` (UPDATED)

**POST** - Get signature for whitelisted wallet

Request:

```json
{
  "address": "0xABCD...",
  "nonce": 0
}
```

Response (success):

```json
{
  "signature": "0x...",
  "nonce": 0,
  "address": "0xabcd...",
  "xUsername": "@user",
  "message": "Signature generated successfully"
}
```

Response (error):

```json
{
  "error": "Wallet not whitelisted. Please link your wallet first.",
  "needsLinking": true
}
```

### 3. Frontend Components

#### `XConnect` Component (UPDATED)

New features:

- Checks whitelist status for connected wallet
- Shows "Link Wallet" button when follower but not linked
- Shows "You have Whitelist Access!" when linked
- Displays mint status (already minted or available)

Props:

```typescript
interface Props {
  onWhitelistChange?: (status: WhitelistStatus) => void;
}
```

#### `MintButton` Component (UPDATED)

New whitelist phase checks:

1. ⓵ Connect X First
2. ⓶ Follow on X to Get Whitelist
3. ⓷ Link Your Wallet Above ↑
4. ✓ Ready to mint!

Props:

```typescript
interface Props {
  traits: NFTTraits;
  session?: SessionData;
  whitelistStatus?: WhitelistStatus; // NEW!
}
```

## Security Features

### 1. One Twitter → One Wallet

- Database enforces unique Twitter ID
- Database enforces unique wallet address
- Cannot link multiple wallets to same Twitter
- Cannot link multiple Twitter accounts to same wallet

### 2. One Mint Per Account

- `hasMinted` flag in database
- Checked before signing
- Smart contract also enforces via nonce

### 3. No Direct Signature Access

- Users cannot call `/api/sign-whitelist` without linking
- Session + Database verification required
- Prevents signature farming

## User Experience

### Happy Path (3 minutes)

```
Time    Action                          What User Sees
────────────────────────────────────────────────────────────
0:00    Opens app                       "Connect with X" button
0:10    Clicks Connect X                OAuth popup
0:20    Authorizes                      "Connected as @user"
0:25    Auto-verify follower            "✓ Follower" badge
0:30    Connects wallet                 "Connect Wallet" → Connected
0:35    Sees link prompt                "🎁 Free Mint Available!"
0:40    Clicks Link Wallet              Loading...
0:45    Wallet linked                   "✓ You have Whitelist Access!"
1:00    Customizes NFT                  Preview updates
1:30    Clicks "Mint FREE Now!"         Transaction prompt
1:40    Confirms tx                     "⏳ Minting..."
2:00    NFT minted                      "✅ Successfully minted!"
```

### Edge Cases

**Already linked wallet to another Twitter:**

```
Error: "Wallet already linked to @other_user"
Solution: Use different wallet or unlink (admin function)
```

**Already linked Twitter to another wallet:**

```
Error: "Twitter account already linked to 0xABCD..."
Solution: Use that wallet or unlink (admin function)
```

**Not a follower:**

```
Shows: "⓶ Follow on X to Get Whitelist"
Action: User follows → clicks Verify → proceeds
```

**Already minted:**

```
Shows: "✓ Already Minted with This Account"
Action: Cannot mint again (success state)
```

## Admin Functions

### View All Whitelist Entries

```typescript
import { getAllEntries, getStats } from "@/lib/database";

const entries = await getAllEntries();
const stats = await getStats();

console.log(`Total: ${stats.totalLinked}`);
console.log(`Minted: ${stats.totalMinted}`);
console.log(`Remaining: ${stats.remaining}`);
```

### Remove Link (if needed)

```typescript
import { removeLink } from "@/lib/database";

await removeLink("twitter_user_id");
```

### Export Database

```bash
# Backup
cp data/whitelist.json data/whitelist.backup.json

# View as pretty JSON
cat data/whitelist.json | jq '.'

# Count entries
cat data/whitelist.json | jq '.byTwitter | length'
```

## Production Migration

### Recommended: Vercel KV

1. Install Vercel KV:

```bash
npm install @vercel/kv
```

2. Add to Vercel project:

```bash
vercel env add KV_URL
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
```

3. Update `lib/database.ts`:

```typescript
import { kv } from '@vercel/kv';

export async function linkWallet(...) {
  await kv.hset('whitelist:twitter', xUserId, entry);
  await kv.hset('whitelist:wallet', walletAddress, entry);
}

export async function getByTwitterId(xUserId: string) {
  return await kv.hget('whitelist:twitter', xUserId);
}
```

### Alternative: Supabase

1. Create table:

```sql
CREATE TABLE whitelist (
  x_user_id TEXT PRIMARY KEY,
  x_username TEXT NOT NULL,
  wallet_address TEXT NOT NULL UNIQUE,
  linked_at BIGINT NOT NULL,
  has_minted BOOLEAN DEFAULT FALSE,
  minted_at BIGINT,
  CONSTRAINT unique_wallet UNIQUE (wallet_address)
);
```

2. Use Supabase client in `lib/database.ts`

## Testing

### Test Flow Locally

1. Start server: `npm run dev`
2. Open http://localhost:3000
3. Connect with X (use test account)
4. Connect wallet (use test wallet)
5. Click "Link Wallet"
6. Verify database created: `cat data/whitelist.json`
7. Try to mint
8. Check `hasMinted` updated in database

### Test Edge Cases

```bash
# Try linking same Twitter to different wallet
# Expected: Error "Already linked"

# Try linking different Twitter to same wallet
# Expected: Error "Wallet already linked"

# Try minting twice
# Expected: "Already minted"
```

## Troubleshooting

**Error: "Failed to save database"**

- Check `data/` folder exists
- Check write permissions
- Check disk space

**Error: "Wallet not whitelisted"**

- Verify wallet is connected
- Check `/api/link-wallet?address=0x...` returns linked=true
- Check database file has entry

**Error: "Not a follower"**

- Actually follow the account
- Click Verify button
- Wait for API response (may take a few seconds)

## Summary

The new flow ensures:

- ✅ Only followers can get whitelisted
- ✅ One Twitter account = One wallet
- ✅ One wallet = One free mint
- ✅ Easy to verify and track
- ✅ Good user experience
- ✅ Prevents abuse

Users love it because:

- Clear steps with visual feedback
- Auto-verification where possible
- Immediate whitelist confirmation
- Free mint for supporters 🎁
