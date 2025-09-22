# Sistem Upload Gambar Artikel

## Overview

Sistem upload gambar artikel telah diupdate untuk menggunakan Supabase Storage dengan fitur:
- Upload langsung ke Supabase Storage bucket
- Validasi maksimal 10MB per file
- Auto-delete gambar lama saat diganti/dihapus
- Drag & drop interface
- Preview real-time
- Support multiple format: JPG, PNG, WebP

## Komponen yang Terlibat

### 1. ImageUploader Component (`src/lib/components/ImageUploader.svelte`)

Komponen utama untuk upload gambar dengan fitur:
- **Validasi file**: Tipe file dan ukuran maksimal
- **Upload ke Supabase**: Otomatis upload ke bucket yang ditentukan
- **Auto-delete**: Hapus gambar lama saat upload gambar baru
- **Drag & drop**: Interface intuitif untuk upload
- **Preview**: Tampilan preview gambar yang diupload

#### Props:
```javascript
export let imageUrl = '';                    // URL gambar saat ini
export let bucketName = 'article-images';    // Nama bucket Supabase
export let maxSize = 10 * 1024 * 1024;      // Maksimal 10MB
export let allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export let placeholder = 'Upload gambar...'; // Placeholder text
export let required = false;                 // Apakah wajib diisi
```

#### Events:
```javascript
on:change={(e) => {
  // e.detail.url - URL gambar yang diupload
  // e.detail.filename - Nama file
  // e.detail.size - Ukuran file
  // e.detail.type - Tipe file
}}
```

### 2. Supabase Storage Setup

File: `database/article_images_storage_setup.sql`

Berisi setup untuk:
- Bucket `article-images`
- Policies untuk authenticated users
- Public access untuk viewing images

### 3. Integration di Form Artikel

#### Create Article (`src/routes/admin/food/create-article/+page.svelte`)
- Thumbnail image (required)
- Main image (optional)

#### Edit Article (`src/routes/admin/food/edit-article/[id]/+page.svelte`)
- Thumbnail image (required)
- Main image (optional)

#### Content Block Editor (`src/lib/components/ContentBlockEditor.svelte`)
- Image blocks dalam content artikel
- Alt text dan caption support

## Cara Penggunaan

### 1. Setup Supabase Storage

Jalankan script SQL untuk setup bucket:
```sql
-- Jalankan di Supabase SQL Editor
-- File: database/article_images_storage_setup.sql
```

### 2. Environment Variables

Pastikan environment variables Supabase sudah diset:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Menggunakan ImageUploader

```svelte
<script>
  import ImageUploader from '$lib/components/ImageUploader.svelte';
  
  let imageUrl = '';
</script>

<ImageUploader
  bind:imageUrl={imageUrl}
  bucketName="article-images"
  placeholder="Upload gambar artikel"
  required={true}
  on:change={(e) => {
    console.log('Image uploaded:', e.detail.url);
    // Handle image change
  }}
/>
```

## Fitur Keamanan

### 1. Validasi File
- **Tipe file**: Hanya JPG, PNG, WebP yang diizinkan
- **Ukuran file**: Maksimal 10MB per file
- **Nama file**: Auto-generate unique filename

### 2. Storage Policies
- Hanya authenticated users yang bisa upload/delete
- Public access untuk viewing (agar gambar bisa ditampilkan di website)

### 3. Auto Cleanup
- Gambar lama otomatis dihapus saat upload gambar baru
- Gambar dihapus dari storage saat dihapus dari form

## File Structure

```
src/
├── lib/
│   └── components/
│       ├── ImageUploader.svelte      # Komponen upload gambar
│       └── ContentBlockEditor.svelte # Editor konten dengan image support
├── routes/
│   └── admin/
│       └── food/
│           ├── create-article/
│           │   └── +page.svelte      # Form create dengan ImageUploader
│           ├── edit-article/
│           │   └── [id]/
│           │       └── +page.svelte  # Form edit dengan ImageUploader
│           └── IMAGE_UPLOAD_SYSTEM.md # Dokumentasi ini
└── database/
    └── article_images_storage_setup.sql # Setup Supabase Storage
```

## Troubleshooting

### 1. Error Upload
- Pastikan Supabase credentials benar
- Check apakah bucket sudah dibuat
- Pastikan user sudah authenticated

### 2. Gambar Tidak Tampil
- Check apakah bucket public
- Pastikan URL gambar valid
- Check network connection

### 3. File Terlalu Besar
- Compress gambar sebelum upload
- Ubah maxSize jika diperlukan (tidak disarankan > 10MB)

### 4. Auto-delete Tidak Bekerja
- Check apakah user punya permission DELETE di bucket
- Pastikan filename extraction benar dari URL

## Performance Tips

1. **Compress Images**: Gunakan tool seperti TinyPNG sebelum upload
2. **Optimize Format**: WebP lebih efisien dari PNG/JPG
3. **Lazy Loading**: Implementasi lazy loading untuk gambar di artikel
4. **CDN**: Gunakan Supabase CDN untuk delivery yang lebih cepat

## Future Enhancements

1. **Image Resizing**: Auto resize gambar ke beberapa ukuran
2. **Batch Upload**: Upload multiple gambar sekaligus  
3. **Progress Bar**: Tampilkan progress upload untuk file besar
4. **Image Editing**: Basic editing tools (crop, rotate, etc.)
5. **Alt Text AI**: Auto-generate alt text menggunakan AI
