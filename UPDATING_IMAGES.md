# 🔄 Updating NFT Trait Images

## Quick Guide

Khi bạn update/thay đổi hình ảnh trong `/public/assets/traits/`, làm theo các bước sau:

## 📝 Workflow

### 1. Update Images
```bash
# Thay thế file cũ với file mới (cùng tên)
# Ví dụ: Thay public/assets/traits/cats/orange.png với design mới
```

### 2. Increment Version Number

Mở file `lib/nft-composer.ts` và update `ASSETS_VERSION`:

```typescript
// Trước
const ASSETS_VERSION = '1.0.0';

// Sau (increment based on change type)
const ASSETS_VERSION = '1.0.1';  // For small fixes
// hoặc
const ASSETS_VERSION = '1.1.0';  // For multiple trait updates
// hoặc
const ASSETS_VERSION = '2.0.0';  // For complete redesign
```

### 3. Restart Development Server

```bash
# Stop server (Ctrl+C in terminal)

# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

### 4. Hard Refresh Browser

```
Mac: Cmd + Shift + R
Windows/Linux: Ctrl + Shift + R
```

---

## 🎯 Version Numbering Guide

Format: `MAJOR.MINOR.PATCH`

### When to increment:

**PATCH (x.x.1)** - Small changes:
- Fix single image
- Color correction
- Minor tweaks
```
1.0.0 → 1.0.1
```

**MINOR (x.1.0)** - Medium changes:
- Update multiple traits
- Add new variations
- Significant improvements
```
1.0.1 → 1.1.0
```

**MAJOR (2.0.0)** - Major changes:
- Complete art style change
- Full collection redesign
- Breaking changes to composition
```
1.1.0 → 2.0.0
```

---

## 💡 Development vs Production

### Development Mode (npm run dev):
```
✅ Images auto-update with timestamp
✅ No caching (instant refresh)
✅ Just hard refresh browser after changes
```

### Production Mode (npm run build):
```
✅ Images cached with version number
✅ Better performance
✅ Update version to bust cache on deploy
```

---

## 🔧 Troubleshooting

### Images still showing old version?

**Try in order:**

1. **Hard refresh browser:**
   ```
   Cmd/Ctrl + Shift + R
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check version updated:**
   ```bash
   # In lib/nft-composer.ts
   const ASSETS_VERSION = '1.0.1'; // Should be incremented
   ```

4. **Clear browser cache completely:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Click "Clear data"

5. **Verify file actually changed:**
   ```bash
   ls -lh public/assets/traits/cats/orange.png
   # Check file size and timestamp
   ```

---

## 📋 Quick Reference

### Update single image:
```bash
1. Replace image file
2. Edit lib/nft-composer.ts: 1.0.0 → 1.0.1
3. rm -rf .next && npm run dev
4. Cmd+Shift+R in browser
```

### Update multiple images:
```bash
1. Replace multiple image files
2. Edit lib/nft-composer.ts: 1.0.0 → 1.1.0
3. rm -rf .next && npm run dev
4. Cmd+Shift+R in browser
```

### Complete redesign:
```bash
1. Replace all image files
2. Edit lib/nft-composer.ts: 1.0.0 → 2.0.0
3. rm -rf .next && npm run dev
4. Cmd+Shift+R in browser
```

---

## ⚡ Pro Tips

1. **Keep source files:** Always keep .psd/.fig files for future edits

2. **Test before increment:** Update images and test locally before incrementing version

3. **Batch updates:** Update multiple images together, then increment once

4. **Document changes:** Keep changelog of what changed in each version

5. **Version control:** Commit version increments with image updates:
   ```bash
   git add public/assets/traits/
   git add lib/nft-composer.ts
   git commit -m "Update cat traits to v1.1.0"
   ```

---

## 📊 Example Workflow

```bash
# Day 1: Initial images
ASSETS_VERSION = '1.0.0'
- Created all 16 images

# Day 2: Fix orange cat eyes
ASSETS_VERSION = '1.0.1'
- Fixed orange.png eye position

# Week 2: Update all eyes
ASSETS_VERSION = '1.1.0'
- Redesigned all 4 eye variations

# Month 2: Complete art style change
ASSETS_VERSION = '2.0.0'
- Changed from pixel art to cartoon style
- Updated all 16 images
```

---

## 🚀 Current Version

Check current version:
```bash
grep "ASSETS_VERSION" lib/nft-composer.ts
```

Output:
```typescript
const ASSETS_VERSION = '1.0.0';  // ← Current version
```

---

Need help? See:
- `NFT_IMAGES_GUIDE.md` - Main guide
- `public/assets/traits/README.md` - Image specs
- Ask in Discord/support channel

Happy updating! 🎨✨

