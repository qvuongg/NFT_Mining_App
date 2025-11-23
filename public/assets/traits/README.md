# NFT Trait Assets

Cấu trúc thư mục này chứa các hình ảnh layers để tạo NFT.

## 📁 Cấu trúc thư mục:

```
traits/
├── backgrounds/     # Màu nền
│   ├── green.png
│   ├── blue.png
│   ├── purple.png
│   └── pink.png
├── cats/           # Body của mèo
│   ├── orange.png
│   ├── gray.png
│   ├── tuxedo.png
│   └── white.png
├── eyes/           # Mắt
│   ├── normal.png
│   ├── sleepy.png
│   ├── heart.png
│   └── closed.png
└── mouths/         # Miệng
    ├── happy.png
    ├── sad.png
    ├── silly.png
    └── cool.png
```

## 🎨 Yêu cầu hình ảnh:

### 1. **Backgrounds** (backgrounds/)

- Kích thước: **1000x1000px**
- Format: PNG với background solid color
- Tên file: `green.png`, `blue.png`, `purple.png`, `pink.png`
- Mô tả: Màu nền đơn giản, có thể thêm pattern nhẹ

### 2. **Cats** (cats/)

- Kích thước: **1000x1000px**
- Format: PNG với **transparent background**
- Tên file: `orange.png`, `gray.png`, `tuxedo.png`, `white.png`
- Mô tả: Body của mèo, chiếm ~60-70% canvas
- Position: Center-bottom

### 3. **Eyes** (eyes/)

- Kích thước: **1000x1000px**
- Format: PNG với **transparent background**
- Tên file: `normal.png`, `sleepy.png`, `heart.png`, `closed.png`
- Mô tả: Chỉ có mắt, đặt ở vị trí phù hợp với cat body
- Position: Center-top (phụ thuộc vào cat design)

### 4. **Mouths** (mouths/)

- Kích thước: **1000x1000px**
- Format: PNG với **transparent background**
- Tên file: `happy.png`, `sad.png`, `silly.png`, `cool.png`
- Mô tả: Chỉ có miệng, đặt ở vị trí phù hợp với cat body
- Position: Center (phụ thuộc vào cat design)

## 🔄 Layer Order (từ dưới lên):

1. **Background** (bottom layer)
2. **Cat body**
3. **Eyes**
4. **Mouth** (top layer)

## 💡 Tips:

### Tạo hình ảnh:

- Dùng **Figma/Photoshop/Procreate** để design
- Export PNG với độ phân giải cao (1000x1000px hoặc 2000x2000px)
- Đảm bảo transparent background cho tất cả layers trừ background

### Alignment:

- Tất cả layers phải có **cùng kích thước** (1000x1000px)
- Eyes và Mouth phải align với Cat body
- Test composite bằng cách stack các layers trong Photoshop trước

### Optimization:

- Nén PNG để giảm file size (dùng TinyPNG.com)
- Target: <200KB mỗi file
- Vẫn giữ quality cao (no visible artifacts)

## 🎯 Example Workflow:

1. Design base cat trong Figma (1000x1000px canvas)
2. Tạo variations: orange, gray, tuxedo, white
3. Export mỗi variation thành separate PNG files
4. Repeat cho eyes và mouths
5. Tạo 4 background solid colors
6. Place tất cả files vào đúng thư mục
7. Test trong app!

## 🚀 Quick Start với Placeholder:

Nếu chưa có art sẵn, bạn có thể:

1. **Dùng Canva/Figma templates**

   - Tìm "pixel art cat" hoặc "cute cat illustration"
   - Customize colors
   - Export PNG

2. **Hire designer trên Fiverr**

   - Search "NFT trait art" hoặc "pixel art characters"
   - Giá: $50-200 cho full set (16 traits)

3. **Generate với AI** (DALL-E, Midjourney)
   - Prompt: "pixel art cat face, orange color, transparent background, 1000x1000px"
   - Lưu ý: Cần consistent style across tất cả traits

## 📝 Checklist:

- [ ] 4 background images (solid colors)
- [ ] 4 cat body images (transparent BG)
- [ ] 4 eyes images (transparent BG)
- [ ] 4 mouths images (transparent BG)
- [ ] Tất cả files đúng tên (lowercase, no spaces)
- [ ] Tất cả files cùng kích thước (1000x1000px)
- [ ] Test composite trong Photoshop/Figma trước
- [ ] File size optimized (<200KB each)

Happy creating! 🎨
