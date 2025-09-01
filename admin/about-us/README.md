# About Us Management

Fitur ini memungkinkan admin untuk mengelola data profil "About Us" yang akan ditampilkan di sisi user.

## Fitur

- **Profil Management**: Edit nama dan deskripsi profil
- **Foto Profil**: Upload dan hapus foto profil
- **Social Media Links**: Kelola link social media (Twitter, Pinterest, Telegram, Instagram)
- **Multi-website Support**: Setiap website memiliki data about us yang terpisah

## Database Schema

```sql
CREATE TABLE about_us (
  id BIGSERIAL PRIMARY KEY,
  website_id BIGINT NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  profile_image TEXT,
  twitter_url TEXT,
  pinterest_url TEXT,
  telegram_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup

### 1. Buat Tabel Database

Jalankan script SQL di `database/about_us_table.sql` di Supabase SQL Editor.

### 2. Setup Storage Bucket

Jalankan script SQL di `database/supabase_storage_setup.sql` untuk membuat bucket storage `about-us-images`.

### 3. File Structure

```
src/
├── lib/
│   ├── aboutUs.js              # API functions untuk about us
│   └── components/
│       └── AboutUsForm.svelte  # Form component
└── routes/
    └── admin/
        └── about-us/
            └── +page.svelte     # Halaman admin about us
```

## Cara Penggunaan

### Untuk Admin

1. Buka halaman `/admin/about-us`
2. Upload foto profil (opsional)
3. Isi nama dan deskripsi
4. Masukkan URL social media
5. Klik "Simpan Perubahan"

### Untuk Developer

#### Mengambil Data About Us

```javascript
import { getAboutUsData } from '$lib/aboutUs.js';

const aboutData = await getAboutUsData(websiteId);
```

#### Update Data About Us

```javascript
import { updateAboutUsData } from '$lib/aboutUs.js';

const updatedData = await updateAboutUsData(websiteId, {
  name: 'Nama Baru',
  description: 'Deskripsi baru',
  // ... other fields
});
```

## Default Data

Jika tidak ada data yang tersimpan, sistem akan menggunakan data default:

```javascript
{
  name: 'Dean Mel',
  description: 'Passionate food blogger and culinary enthusiast. Exploring the world one dish at a time.',
  profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
  twitter_url: 'https://x.com/kelantanfoodreview',
  pinterest_url: 'https://pinterest.com/kelantanfoodreview',
  telegram_url: 'https://telegram.me/kelantanfoodreview',
  instagram_url: 'https://instagram.com/kelantanfoodreview'
}
```

## Integration dengan User Side

Data yang diatur di admin panel akan otomatis muncul di komponen user side yang menggunakan data dari tabel `about_us`.

## Troubleshooting

### Error "Bucket not found"
- Pastikan sudah menjalankan script setup storage bucket
- Cek nama bucket di Supabase dashboard

### Error "Permission denied"
- Pastikan user sudah login dan terautentikasi
- Cek storage policies di Supabase

### Gambar tidak muncul
- Cek URL gambar di database
- Pastikan bucket storage bersifat public
- Cek CORS settings di Supabase
