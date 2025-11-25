# 🎨 NFT Images Setup Guide

## ⚡ Quick Start

Bạn cần thêm **16 hình ảnh PNG** vào thư mục `/public/assets/traits/`:

```
public/assets/traits/
├── backgrounds/     ← 4 images (1000x1000px, opaque)
├── cats/           ← 4 images (1000x1000px, transparent)
├── eyes/           ← 4 images (1000x1000px, transparent)
└── mouths/         ← 4 images (1000x1000px, transparent)
```

## 📝 Required Files

### Backgrounds (backgrounds/)
- `green.png` - Xanh lá (#2D8B7A)
- `blue.png` - Xanh dương (#4A90E2)
- `purple.png` - Tím (#9B59B6)
- `pink.png` - Hồng (#E91E63)
- `red.png` - Đỏ (#FF1744)

### Cats (cats/)
- `orange.png` - Mèo cam
- `gray.png` - Mèo xám
- `tuxedo.png` - Mèo tuxedo
- `white.png` - Mèo trắng

### Eyes (eyes/)
- `normal.png` - Mắt thường
- `sleepy.png` - Mắt buồn ngủ
- `heart.png` - Mắt trái tim
- `closed.png` - Mắt nhắm

### Mouths (mouths/)
- `happy.png` - Miệng cười
- `sad.png` - Miệng buồn
- `silly.png` - Miệng ngớ ngẩn
- `cool.png` - Miệng ngầu

## 🎯 Specs

- **Size:** 1000x1000px hoặc 2000x2000px
- **Format:** PNG
- **Background:** 
  - Backgrounds: Có thể opaque
  - Traits (cats/eyes/mouths): Phải transparent
- **File size:** <200KB mỗi file (nén với TinyPNG)

## 🚀 How It Works

### Before Mint:
```
[Preview Component]
Shows composite của tất cả layers realtime
```

### When User Clicks Mint:
```
1. Generate composite image (stack all 4 layers)
2. Upload composite → IPFS (via Pinata)
3. Create metadata with image URI
4. Upload metadata → IPFS
5. Mint NFT with metadata URI
6. Done! ✅
```

### Result on OpenSea:
```json
{
  "name": "CustOMeow #123",
  "image": "ipfs://QmXxxx...",  ← Your composite image!
  "attributes": [
    {"trait_type": "Background", "value": "Green"},
    {"trait_type": "Cat", "value": "Orange Cat"},
    {"trait_type": "Eyes", "value": "Normal"},
    {"trait_type": "Mouth", "value": "Happy"}
  ]
}
```

## 📚 Detailed Docs

For complete information, see:
- `/public/assets/traits/README.md` - Overview
- `/public/assets/traits/IMAGE_SPECS.md` - Technical specs
- `/public/assets/traits/USAGE.md` - Step-by-step guide

## ✅ Verification

After adding images:

```bash
# Check files exist
ls public/assets/traits/backgrounds/
ls public/assets/traits/cats/
ls public/assets/traits/eyes/
ls public/assets/traits/mouths/

# Should have 4 files in each folder
```

Then:
1. Refresh app (http://localhost:3000)
2. NFT Preview will show your images!
3. If you see warning "⚠️ Add images..." → Check filenames

## 🎨 Design Options

### Option 1: Design yourself
- Figma/Photoshop/Procreate
- Export PNG với correct dimensions
- Budget: $0 (free)

### Option 2: AI Generation
- DALL-E, Midjourney, Stable Diffusion
- Prompt: "pixel art cat [trait], transparent background"
- Budget: ~$20/month

### Option 3: Hire designer
- Fiverr: Search "NFT trait art"
- Budget: $50-200 for full set
- Delivery: 2-5 days

## 💡 Pro Tips

1. **Consistency is key** - Tất cả traits phải cùng style
2. **Test combinations** - Stack layers trong Photoshop trước
3. **Optimize file size** - Dùng TinyPNG compress
4. **Keep source files** - Lưu .psd/.fig cho future edits

---

**Ready to add your images?** 

Navigate to `/public/assets/traits/` and start adding your PNG files! 🚀

App will automatically detect và use images. Nếu images chưa có, app sẽ fallback về emoji version.

Happy creating! 🎨✨

