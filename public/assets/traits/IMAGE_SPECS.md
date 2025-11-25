# 📐 Image Specifications & Guidelines

## Naming Convention

**QUAN TRỌNG:** Tên file phải chính xác theo format sau:

### Backgrounds (backgrounds/)

```
green.png    → Background màu xanh lá
blue.png     → Background màu xanh dương
purple.png   → Background màu tím
pink.png     → Background màu hồng
red.png      → Background màu đỏ
```

### Cats (cats/)

```
orange.png   → Mèo cam
gray.png     → Mèo xám
tuxedo.png   → Mèo tuxedo (đen trắng)
white.png    → Mèo trắng
```

### Eyes (eyes/)

```
normal.png   → Mắt thường
sleepy.png   → Mắt buồn ngủ
heart.png    → Mắt hình trái tim
closed.png   → Mắt nhắm
```

### Mouths (mouths/)

```
happy.png    → Miệng cười
sad.png      → Miệng buồn
silly.png    → Miệng ngớ ngẩn
cool.png     → Miệng ngầu
```

---

## 🎨 Design Guidelines

### Canvas Size

- **Standard:** 1000x1000px
- **High-res:** 2000x2000px (recommended)
- **Format:** PNG (24-bit with alpha channel)

### Color Mode

- **RGB** color space
- **sRGB** color profile
- 8-bit or 16-bit per channel

### Background Layer

```
- Dimensions: 1000x1000px
- Format: PNG (can be opaque)
- Content: Solid color or subtle pattern
- No transparency needed
```

### Trait Layers (Cats, Eyes, Mouths)

```
- Dimensions: 1000x1000px (same as background)
- Format: PNG with transparency
- Content: Only the trait element (cat/eyes/mouth)
- Background: Fully transparent
- Anti-aliasing: Enabled for smooth edges
```

---

## 🎯 Layer Positioning Guide

### Example với Canvas 1000x1000px:

```
┌─────────────────────────────────────┐
│                                     │  ← Top: 0px
│         [Eyes Layer]                │  ← Eyes: Y=300-400px
│                                     │
│                                     │
│      [Cat Body Layer]               │  ← Cat: Y=200-900px
│         (centered)                  │
│                                     │
│       [Mouth Layer]                 │  ← Mouth: Y=500-600px
│                                     │
└─────────────────────────────────────┘  ← Bottom: 1000px
```

### Alignment Rules:

1. **Cat body:** Centered horizontally, bottom-aligned or center-aligned
2. **Eyes:** Position relative to cat's face (typically Y=300-450px)
3. **Mouth:** Below eyes, typically Y=500-650px
4. **All layers:** Same canvas size, centered alignment

---

## 💾 File Size Optimization

### Target Sizes:

- Backgrounds: <100KB each
- Cats: <200KB each
- Eyes: <50KB each
- Mouths: <50KB each

### Optimization Tools:

1. **TinyPNG.com** - Lossy compression (recommended)
2. **pngquant** - Command-line tool
3. **Photoshop "Export for Web"** - Manual control

### Compression Settings:

```
- Quality: 90-95%
- Compression: 8-9 (PNG)
- Remove metadata: Yes
- Interlaced: No
```

---

## 🎨 Style Consistency

### Để NFT collection trông cohesive:

#### Art Style:

- ✅ Chọn 1 style duy nhất: Pixel art / Cartoon / Realistic
- ✅ Consistent line weight across all traits
- ✅ Same color palette/saturation
- ✅ Unified lighting direction

#### Examples:

**Pixel Art Style:**

```
- Resolution: 32x32 or 64x64 base, scaled up to 1000x1000
- Hard edges, no anti-aliasing
- Limited color palette (8-16 colors)
```

**Cartoon Style:**

```
- Clean outlines (3-5px thick)
- Flat colors with simple shading
- Bold, readable features
```

**Realistic Style:**

```
- Detailed textures
- Smooth gradients
- Natural lighting and shadows
```

---

## 🖼️ Example Layer Structure

### Layer 1: Background (green.png)

```
Solid #2D8B7A color filling entire 1000x1000px canvas
Optional: Subtle texture/pattern overlay
```

### Layer 2: Cat Body (orange.png)

```
Transparent background
Orange cat silhouette in center
Size: ~600x800px within 1000x1000px canvas
Position: Centered horizontally, bottom at y=900px
```

### Layer 3: Eyes (normal.png)

```
Transparent background
Just the eyes (no face)
Size: ~200x100px
Position: Absolute coordinates (400, 350) for left eye
```

### Layer 4: Mouth (happy.png)

```
Transparent background
Just the mouth/smile
Size: ~150x80px
Position: Absolute coordinates (425, 550)
```

---

## 🔧 Technical Requirements

### PNG Format:

```
Bit Depth: 24-bit (RGB) or 32-bit (RGBA with alpha)
Color Type:
  - Backgrounds: RGB (2) or RGBA (6)
  - Traits: RGBA (6) - required for transparency
Compression: Deflate
Filter: Adaptive
Interlacing: None (for web performance)
```

### Transparency:

```
Alpha Channel: Yes (for cats/eyes/mouths)
Background: Fully transparent (alpha=0)
Edges: Smooth anti-aliased (alpha=0-255 gradient)
```

---

## 📱 Testing Checklist

### Before adding to project:

- [ ] All 16 images present (4 of each type)
- [ ] Correct filenames (lowercase, .png extension)
- [ ] Correct dimensions (all 1000x1000px or all 2000x2000px)
- [ ] Transparent backgrounds (except background layer)
- [ ] Layers align correctly when stacked
- [ ] File sizes under target (<200KB each)
- [ ] Colors consistent across traits
- [ ] No white halos around transparent edges
- [ ] Clear visibility of all features
- [ ] Tested all 256 combinations (4^4)

### Test Stack:

```
Open Photoshop/GIMP:
1. Create 1000x1000px canvas
2. Import green.png (background)
3. Import orange.png (cat) - should align perfectly
4. Import normal.png (eyes) - should align with cat face
5. Import happy.png (mouth) - should align with cat face
6. Check result - should look like complete NFT
7. Repeat for random combinations
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't:

- Mix different canvas sizes (e.g., 1000px and 2000px)
- Use JPG format (no transparency support)
- Add drop shadows in individual layers (add in composite)
- Use different art styles per trait
- Crop layers to trait size (keep full canvas size)
- Forget alpha channel for transparent areas
- Use pure white halos around edges

### ✅ Do:

- Keep all layers same exact dimensions
- Use PNG with alpha channel
- Design traits to work with any combination
- Test multiple random combinations
- Optimize file sizes after design complete
- Use version control for source files
- Keep source .psd/.fig files separate

---

## 🎯 Quick Reference

| Trait Type | Count | Transparent BG | Typical Size | Position      |
| ---------- | ----- | -------------- | ------------ | ------------- |
| Background | 4     | No             | 1000x1000px  | Full canvas   |
| Cat        | 4     | Yes            | 600x800px    | Center-bottom |
| Eyes       | 4     | Yes            | 200x100px    | Upper-center  |
| Mouth      | 4     | Yes            | 150x80px     | Mid-center    |

**Total Combinations:** 4 × 4 × 4 × 4 = **256 unique NFTs**

---

Need help? Check:

- `/public/assets/traits/README.md` for overview
- Ask on Discord for design feedback
- Use Figma/Photoshop templates (if provided)

Happy designing! 🎨✨
