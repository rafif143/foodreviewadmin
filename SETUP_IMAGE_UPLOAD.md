# Setup Image Upload untuk Artikel

## Langkah-langkah Setup

### 1. Setup Environment Variables

Buat file `.env` di root project:
```bash
cp env.template .env
```

Edit file `.env` dan isi dengan credentials Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Setup Supabase Storage

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka **SQL Editor**
4. Jalankan script dari file `database/article_images_storage_setup.sql`:

```sql
-- Buat bucket untuk gambar artikel
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set policies untuk authenticated users
CREATE POLICY "Allow authenticated users to upload article images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view article images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update article images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete article images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

-- Allow public viewing
CREATE POLICY "Allow public to view article images" ON storage.objects
FOR SELECT USING (bucket_id = 'article-images');
```

### 3. Restart Development Server

Setelah setup environment variables:
```bash
npm run dev
```

### 4. Test Upload

1. Buka halaman **Create Article** di admin panel
2. Coba upload gambar di bagian "Thumbnail Image"
3. Pastikan gambar berhasil diupload dan preview muncul
4. Check di Supabase Storage apakah file tersimpan

## Fitur yang Tersedia

### ✅ Upload Gambar
- **Drag & drop** atau klik untuk upload
- **Validasi otomatis**: Maksimal 10MB, format JPG/PNG/WebP
- **Preview real-time** setelah upload

### ✅ Auto Delete
- Gambar lama **otomatis dihapus** saat upload gambar baru
- Gambar dihapus dari storage saat dihapus dari form

### ✅ Terintegrasi di:
- **Create Article**: Thumbnail & Main image
- **Edit Article**: Thumbnail & Main image  
- **Content Blocks**: Gambar dalam konten artikel

### ✅ Keamanan
- Hanya authenticated users yang bisa upload/delete
- Validasi file type dan size di client & server
- Unique filename generation

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan file `.env` ada dan berisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
- Restart development server setelah mengubah .env

### Error: "Failed to upload"
- Check apakah bucket `article-images` sudah dibuat
- Pastikan policies sudah dijalankan
- Check apakah user sudah login

### Gambar tidak tampil setelah upload
- Pastikan bucket bersifat public atau policy "Allow public to view" sudah ada
- Check network connection
- Pastikan URL gambar valid

### File terlalu besar
- Maksimal ukuran file adalah 10MB
- Compress gambar menggunakan tool seperti TinyPNG
- Atau ubah `maxSize` di komponen ImageUploader

## Support

Jika ada masalah:
1. Check dokumentasi lengkap di `src/routes/admin/food/IMAGE_UPLOAD_SYSTEM.md`
2. Pastikan semua langkah setup sudah diikuti
3. Check console browser untuk error messages
4. Verify Supabase credentials dan permissions
