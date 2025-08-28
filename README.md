# Kelantan Food - Website Food Review

Website food review modern yang dibuat dengan SvelteKit dan Tailwind CSS, terinspirasi dari desain clean dan modern dengan fokus pada pengalaman pengguna yang optimal.

## 🍽️ Fitur Utama

### 1. Menu Navigasi Utama
- **Kategori Utama**: Food, Cafe, Things To Do, Events, Recipe
- **Kelantan Foodie Navigation**: Navigasi khusus dengan counter artikel per kategori
- **Responsive Design**: Menu hamburger untuk mobile

### 2. Fitur Pencarian dan Media Sosial
- **Search Bar**: Pencarian artikel dan konten
- **Social Media Integration**: Instagram, YouTube, Twitter, Facebook
- **Newsletter Signup**: Form berlangganan newsletter

### 3. Bagian "This Just In"
- **Breaking News**: Artikel terbaru dengan kategori dan tanggal
- **Author Information**: Informasi penulis dan tanggal publikasi
- **Live Updates**: Indikator artikel terbaru

### 4. Konten Terpopuler (Trending)
- **Sidebar Trending**: Artikel populer dengan view count
- **Popular Now**: Highlight konten terpopuler
- **About Me Section**: Profil penulis dengan foto

### 5. Kategori dan Artikel Unggulan
- **Featured Articles**: 3 artikel utama dengan gambar
- **Category Showcase**: 6 kategori makanan (Fast food, Salades, Pastries, Juices, Sundae, Nuts)
- **Category Cards**: Food & Cafe, Things To Do, Events, Recipe

### 6. Struktur Artikel Informatif
- **Edisi 2025**: Penekanan pada konten terbaru
- **Author & Date**: Informasi lengkap penulis dan tanggal
- **Location Details**: Jam operasional dan highlight lokasi

## 🛠️ Teknologi yang Digunakan

- **SvelteKit 5**: Framework modern untuk web development
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Google Fonts**: Dancing Script & Inter fonts
- **Unsplash Images**: High-quality stock photos

## 📁 Struktur Komponen

```
src/
├── lib/
│   └── components/
│       ├── Header.svelte           # Header utama dengan logo dan navigasi
│       ├── FoodNavigation.svelte   # Navigasi khusus kategori makanan
│       ├── FeaturedArticles.svelte # Artikel unggulan
│       ├── CategoryShowcase.svelte # Showcase kategori makanan
│       ├── ThisJustIn.svelte       # Artikel terbaru
│       ├── TrendingSidebar.svelte  # Sidebar trending dan about me
│       └── Footer.svelte           # Footer dengan social media
├── routes/
│   ├── +layout.svelte             # Layout utama
│   └── +page.svelte               # Halaman utama
└── app.css                        # CSS global dengan Tailwind
```

## 🚀 Cara Menjalankan

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

3. **Build untuk Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🎨 Desain & UI/UX

### Color Scheme
- **Primary**: Orange (#f97316) - Warna utama brand
- **Secondary**: Gray tones untuk text dan background
- **Accent**: White untuk cards dan sections

### Typography
- **Handwriting Font**: Dancing Script untuk logo dan heading
- **Sans Font**: Inter untuk body text dan navigation

### Responsive Design
- **Mobile First**: Optimized untuk mobile devices
- **Tablet**: Layout menyesuaikan untuk tablet
- **Desktop**: Full layout dengan sidebar

## 📱 Fitur Responsive

- **Mobile Menu**: Hamburger menu untuk mobile
- **Flexible Grid**: Grid system yang menyesuaikan screen size
- **Touch Friendly**: Button dan link yang mudah di-tap
- **Optimized Images**: Images yang responsive

## 🔧 Konfigurasi

### Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: { /* orange color palette */ }
      },
      fontFamily: {
        'handwriting': ['Dancing Script', 'cursive'],
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
```

## 📊 Konten Sample

### Artikel Terbaru
- 5D4N Itinerary For Your Next Budget-Friendly Trip To Shenzhen (Travel)
- MSME Digital Grant 2025 Is Back… (News)
- 5 Must-Visit Spots For Creamy Durians In Kelantan (2025 Edition) (Food)

### Trending Articles
- 31 BEST Cafes You Must Visit In Kelantan (2025 Edition)
- 15 Popular Breakfast Spots In Kelantan To Start Your Day (2025 Edition)
- 11 Spots That Captures Hidden Charms Of Kelantan (2025 Guide)

## 🌟 Fitur Khusus

### 1. Clean Design
- Minimalist approach dengan whitespace yang cukup
- Consistent spacing dan typography
- Smooth transitions dan hover effects

### 2. Component-Based Architecture
- Reusable components untuk maintainability
- Modular structure untuk easy updates
- Consistent styling dengan Tailwind utilities

### 3. Performance Optimized
- Lazy loading untuk images
- Optimized CSS dengan Tailwind
- Fast loading dengan SvelteKit

## 📈 SEO & Accessibility

- **Meta Tags**: Proper title dan description
- **Semantic HTML**: Proper heading structure
- **Alt Text**: Descriptive alt text untuk images
- **ARIA Labels**: Accessibility improvements

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Advanced search functionality
- [ ] User authentication
- [ ] Comment system
- [ ] Rating system
- [ ] Mobile app integration
- [ ] Multi-language support

## 📝 License

MIT License - feel free to use this project for your own food review website!

---

**Made with ❤️ for the food community**
