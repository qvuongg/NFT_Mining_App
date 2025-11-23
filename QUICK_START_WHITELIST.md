# Quick Start: Whitelist System

Hướng dẫn nhanh cho hệ thống whitelist mới.

## Tóm tắt Flow

```
1. Connect X/Twitter + Follow tài khoản của bạn
   ↓
2. Connect Wallet (Coinbase Wallet)
   ↓
3. Click "Link Wallet & Get Whitelist"
   ↓
4. Thấy "✓ You have Whitelist Access!"
   ↓
5. Customize NFT → Click "Mint FREE Now!"
   ↓
6. Done! 🎉
```

## Cơ chế Whitelist

**Quy tắc**: 1 Twitter account = 1 Wallet = 1 Free Mint

- Mỗi tài khoản Twitter chỉ được link với 1 ví
- Mỗi ví chỉ được link với 1 tài khoản Twitter
- Mỗi tài khoản chỉ được mint free 1 lần

## Database

File: `data/whitelist.json`

Cấu trúc:
```json
{
  "byTwitter": {
    "123456789": {
      "xUserId": "123456789",
      "xUsername": "@user",
      "walletAddress": "0xabc...",
      "linkedAt": 1234567890,
      "hasMinted": false
    }
  },
  "byWallet": {
    "0xabc...": { /* same object */ }
  }
}
```

## API Endpoints

### 1. Link Wallet
```
POST /api/link-wallet
Body: { "address": "0xABCD..." }

Success: { "success": true, "whitelisted": true }
Error: { "error": "Not a follower", "needsFollow": true }
```

### 2. Check Whitelist
```
GET /api/link-wallet?address=0xABCD...

Response: { 
  "whitelisted": true, 
  "linked": true,
  "hasMinted": false 
}
```

### 3. Sign Whitelist
```
POST /api/sign-whitelist
Body: { "address": "0xABCD...", "nonce": 0 }

Success: { "signature": "0x...", "nonce": 0 }
Error: { "error": "Wallet not whitelisted", "needsLinking": true }
```

## Frontend Components

### XConnect
- Hiển thị trạng thái Twitter connection
- Hiển thị trạng thái follower
- **MỚI**: Hiển thị "Link Wallet" button
- **MỚI**: Hiển thị whitelist status

### MintButton
- **MỚI**: Check whitelist status trước khi cho mint
- Hiển thị các bước rõ ràng:
  - ⓵ Connect X First
  - ⓶ Follow on X
  - ⓷ Link Your Wallet
  - 🎁 Mint FREE Now!

## Troubleshooting

### "Not authenticated"
→ Click "Connect with X" button

### "Not a follower"
→ Follow tài khoản Twitter của dự án → Click "Verify"

### "Wallet not whitelisted"
→ Click "Link Wallet & Get Whitelist" button

### "Already linked to another account"
→ Dùng ví khác hoặc contact admin để unlink

### "Already minted"
→ Success! Bạn đã mint rồi

## Migration to Production

File-based database chỉ dùng cho development.

Production nên dùng:
- **Vercel KV** (recommended cho Vercel)
- **Redis** 
- **PostgreSQL/Supabase**

Chi tiết: xem `WHITELIST_FLOW.md` → "Production Migration"

## Testing Locally

```bash
# 1. Start server
npm run dev

# 2. Test flow
# - Connect X
# - Connect Wallet
# - Link wallet
# - Try mint

# 3. Check database
cat data/whitelist.json | jq '.'

# 4. Check stats
cat data/whitelist.json | jq '.byTwitter | length'
```

## Security Notes

✅ **Secure**:
- Backend private key riêng với deployer key
- EIP-712 signatures
- Database validation
- One-time mint enforcement

⚠️ **Important**:
- Backup `data/whitelist.json` thường xuyên
- Don't commit database to git (.gitignore đã có)
- Migrate to proper database cho production

## Support

- Full documentation: `WHITELIST_FLOW.md`
- Setup guide: `SETUP_GUIDE.md`
- Main README: `README.md`

Good luck! 🚀

