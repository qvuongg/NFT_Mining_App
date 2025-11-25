# 🚀 Quick Start Guide - Adding NFT Trait Images

## Tổng quan

Bạn cần thêm **16 hình ảnh PNG** vào các thư mục sau:

- `backgrounds/` → 4 images
- `cats/` → 4 images
- `eyes/` → 4 images
- `mouths/` → 4 images

## 📝 Danh sách File cần tạo:

### 1. Backgrounds (backgrounds/)

```
✓ green.png     - Background màu xanh lá (#2D8B7A)
✓ blue.png      - Background màu xanh dương (#4A90E2)
✓ purple.png    - Background màu tím (#9B59B6)
✓ pink.png      - Background màu hồng (#E91E63)
✓ red.png       - Background màu đỏ (#FF1744)
```

### 2. Cats (cats/)

```
✓ orange.png    - Mèo cam/vàng
✓ gray.png      - Mèo xám
✓ tuxedo.png    - Mèo tuxedo (đen trắng)
✓ white.png     - Mèo trắng/hồng
```

### 3. Eyes (eyes/)

```
✓ normal.png    - Mắt thường (mở to)
✓ sleepy.png    - Mắt buồn ngủ/ngái ngủ
✓ heart.png     - Mắt hình trái tim (cute)
✓ closed.png    - Mắt nhắm
```

### 4. Mouths (mouths/)

```
✓ happy.png     - Miệng cười (vui vẻ)
✓ sad.png       - Miệng buồn (khóc/mếu)
✓ silly.png     - Miệng ngớ ngẩn (lè lưỡi)
✓ cool.png      - Miệng ngầu (confident)
```

---

## 🎨 Yêu cầu kỹ thuật

### Tất cả images:

- **Kích thước:** 1000x1000px (hoặc 2000x2000px)
- **Format:** PNG
- **Độ phân giải:** 72 DPI minimum, 150 DPI preferred

### Background layers:

- **Background:** Có thể opaque (không cần trong suốt)
- **Content:** Solid color hoặc pattern

### Trait layers (cats/eyes/mouths):

- **Background:** Phải trong suốt (transparent)
- **Alpha channel:** Required
- **Content:** Chỉ có trait element, không có background

---

## 💡 Cách tạo nhanh

### Option 1: Figma/Canva

1. Tạo canvas 1000x1000px
2. Design 4 variations cho mỗi trait type
3. Export PNG với transparent background

### Option 2: AI Generation (DALL-E, Midjourney)

```
Prompts:
- "pixel art cat face orange color, transparent background, 1000x1000"
- "pixel art cat eyes normal, transparent background, centered"
- "pixel art cat mouth happy smile, transparent background"
```

### Option 3: Hire Designer

- Fiverr/Upwork: Search "NFT trait art" hoặc "pixel art characters"
- Budget: $50-200 cho full set
- Delivery: 2-5 days

---

## ✅ Testing Checklist

Sau khi thêm images:

1. **Check filenames:**

   ```bash
   cd public/assets/traits
   ls backgrounds/  # Should show: blue.png green.png pink.png purple.png
   ls cats/         # Should show: gray.png orange.png tuxedo.png white.png
   ls eyes/         # Should show: close.png heart.png normal.png sleepy.png
   ls mouths/       # Should show: cool.png happy.png sad.png silly.png
   ```

2. **Refresh app:**

   - Go to http://localhost:3000 (hoặc ngrok URL)
   - NFT Preview sẽ tự động load images
   - Nếu có warning badge "⚠️ Add images..." → Check filenames

3. **Test customization:**

   - Click các tabs (BACKGROUND, MEOW, EYE, MOUTH)
   - Select các traits khác nhau
   - Preview sẽ update realtime

4. **Test download:**

   - Click "📥 Download PFP"
   - File downloaded sẽ là composite của tất cả layers

5. **Test minting:**
   - Click "Mint" button
   - Composite image sẽ được upload lên IPFS
   - Metadata sẽ có `image` field với IPFS URI

---

## 🔧 Troubleshooting

### Images không hiển thị:

```
❌ Problem: NFT Preview shows emoji instead of images
✅ Solution:
  1. Check filenames chính xác (lowercase, .png extension)
  2. Check image dimensions (should be 1000x1000px)
  3. Check file permissions (readable)
  4. Hard refresh browser (Cmd+Shift+R)
```

### Images bị lệch:

```
❌ Problem: Eyes/mouth không align với cat body
✅ Solution:
  1. Open all layers in Photoshop/Figma
  2. Đảm bảo tất cả là 1000x1000px canvas
  3. Align eyes/mouth với cat position
  4. Re-export tất cả layers
```

### File quá lớn:

```
❌ Problem: Minting takes too long (images >500KB each)
✅ Solution:
  1. Compress images với TinyPNG.com
  2. Target: <200KB per file
  3. Quality: 90-95% (still looks great)
```

---

## 📚 Additional Resources

- **Design Specs:** See `IMAGE_SPECS.md` for detailed technical requirements
- **Layer Structure:** See `README.md` for overview
- **Code Reference:** See `/lib/nft-composer.ts` for how images are composited

---

## 🎯 Quick Commands

```bash
# Navigate to traits folder
cd public/assets/traits

# Check what files exist
find . -name "*.png" -type f

# Check file sizes
du -h backgrounds/* cats/* eyes/* mouths/*

# Count total files
find . -name "*.png" | wc -l  # Should be 16
```

---

## 🚀 What happens when you mint?

1. User clicks "Mint" button
2. App generates composite image:
   ```
   Canvas (1000x1000px)
   └─ Layer 1: backgrounds/green.png
   └─ Layer 2: cats/orange.png
   └─ Layer 3: eyes/normal.png
   └─ Layer 4: mouths/happy.png
   ```
3. Composite image → Uploaded to IPFS via Pinata
4. Metadata JSON created:
   ```json
   {
     "name": "CustOMeow #123",
     "image": "ipfs://QmXxxx...",  ← Composite image
     "attributes": [...]
   }
   ```
5. Metadata → Uploaded to IPFS
6. Smart contract stores metadata URI
7. NFT minted! 🎉

---

## ✨ Example Result

After adding all images, your NFT will look like:

```
┌─────────────────────────────────┐
│                                 │
│  [Composite of all 4 layers]   │
│                                 │
│  • Background: Solid color      │
│  • Cat: Full body illustration  │
│  • Eyes: Positioned on face     │
│  • Mouth: Positioned below eyes │
│                                 │
│  High quality, professional!    │
│                                 │
└─────────────────────────────────┘
```

This will appear on OpenSea, Blur, and all NFT marketplaces! 🔥

---

Need help? Ask in Discord or check the detailed docs:

- `README.md` - Overview
- `IMAGE_SPECS.md` - Technical specifications
- `/lib/nft-composer.ts` - Code reference

Happy creating! 🎨✨
