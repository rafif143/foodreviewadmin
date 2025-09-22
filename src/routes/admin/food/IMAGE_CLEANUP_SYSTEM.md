# Sistem Auto-Cleanup Gambar Artikel

## Overview

Sistem ini memastikan gambar yang diupload tetapi tidak digunakan akan otomatis dihapus dari Supabase Storage, mencegah storage bloat dan biaya yang tidak perlu.

## Skenario Cleanup

### 1. **Artikel Tidak Jadi Disimpan**
- User upload gambar tapi cancel/keluar dari halaman
- User upload gambar tapi tidak submit form
- **Solusi**: Gambar otomatis dihapus saat user meninggalkan halaman

### 2. **Artikel Dihapus**
- User menghapus artikel dari list
- **Solusi**: Semua gambar terkait (thumbnail, main image, content images) otomatis dihapus

### 3. **Edit Artikel - Hapus Gambar**
- User mengganti/menghapus gambar saat edit artikel
- **Solusi**: Gambar lama otomatis dihapus dari storage

### 4. **Edit Artikel - Ganti Gambar**
- User upload gambar baru untuk mengganti yang lama
- **Solusi**: Gambar lama otomatis dihapus, yang baru disimpan

## Komponen Sistem

### 1. **Utility Functions** (`src/lib/utils/imageCleanup.js`)

```javascript
// Extract image URLs from various sources
extractImageUrls(article)        // Dari data artikel database
extractFormImageUrls(formData)   // Dari form data

// Storage operations
deleteImagesFromStorage(urls)    // Hapus gambar dari storage
deleteArticleImages(article)     // Hapus semua gambar artikel
cleanupUnusedImages(old, new)    // Hapus gambar yang tidak digunakan lagi

// Temporary tracking
addTempImage(url)               // Track gambar sementara
removeTempImage(url)            // Remove dari tracking
cleanupTempImages(savedUrls)    // Cleanup gambar yang tidak tersimpan
```

### 2. **ImageUploader Component**

- **Auto-tracking**: Setiap upload otomatis ditambah ke temp tracking
- **Auto-delete old**: Saat upload baru, gambar lama dihapus
- **Delete function**: Tombol delete menghapus dari storage

### 3. **Form Integration**

#### Create Article:
- Track semua gambar yang diupload
- Saat submit berhasil: mark images sebagai permanent
- Saat leave page: cleanup temp images

#### Edit Article:
- Compare gambar lama vs baru
- Hapus gambar yang tidak digunakan lagi
- Update temp tracking

#### Article List:
- Saat delete artikel: hapus semua gambar terkait

## Mekanisme Tracking

### Session Storage
- Key: `temp_article_images`
- Value: Array of image URLs yang belum permanent
- Cleared saat artikel berhasil disimpan atau page leave

### Lifecycle:
1. **Upload**: URL ditambah ke temp tracking
2. **Save Success**: URL dihapus dari temp tracking (jadi permanent)
3. **Page Leave**: Temp images yang belum permanent dihapus

## Error Handling

### Graceful Degradation:
- Jika cleanup gagal, operasi utama tetap lanjut
- Error di-log tapi tidak mengganggu user flow
- Multiple retry mechanism untuk delete operations

### Logging:
```javascript
console.log(`Deleted ${result.deleted} images, failed: ${result.failed}`);
console.warn('Some images failed to delete:', result.errors);
```

## Implementation Details

### 1. **Create Article** (`create-article/+page.svelte`)

```javascript
// On successful save
const savedImageUrls = extractFormImageUrls(formData);
savedImageUrls.forEach(url => removeTempImage(url));

// On page leave
onDestroy(() => handlePageLeave());
window.addEventListener('beforeunload', handleBeforeUnload);
```

### 2. **Edit Article** (`edit-article/[id]/+page.svelte`)

```javascript
// Before update
await cleanupUnusedImages(article, formData);

// After successful update
const currentImageUrls = extractFormImageUrls(formData);
currentImageUrls.forEach(url => removeTempImage(url));
```

### 3. **Article List** (`articles/+page.svelte`)

```javascript
// On delete
const articleToDelete = articles.find(article => article.id === articleId);
await deleteArticleImages(articleToDelete);
```

### 4. **ImageUploader** (`ImageUploader.svelte`)

```javascript
// On upload
addTempImage(publicUrl);

// On delete old
await deleteImagesFromStorage([url], bucketName);
removeTempImage(url);
```

## Benefits

### 1. **Cost Optimization**
- Tidak ada gambar orphan yang memakan storage
- Biaya Supabase Storage tetap minimal

### 2. **User Experience**
- User bebas upload/cancel tanpa khawatir
- Tidak perlu manual cleanup
- Fast operations (async cleanup)

### 3. **Developer Experience**
- Automatic cleanup, no manual intervention
- Comprehensive logging
- Error-resistant design

## Monitoring & Debugging

### Console Logs:
- `Successfully deleted X images from storage`
- `Cleaning up X unused images`
- `Deleted X images, failed: X`

### Session Storage Inspection:
```javascript
// Check temp images in browser console
JSON.parse(sessionStorage.getItem('temp_article_images'))
```

### Manual Cleanup (if needed):
```javascript
import { cleanupTempImages } from '$lib/utils/imageCleanup.js';
await cleanupTempImages(); // Cleanup all temp images
```

## File Structure

```
src/
├── lib/
│   ├── components/
│   │   └── ImageUploader.svelte     # Auto-tracking & delete
│   └── utils/
│       └── imageCleanup.js          # Core cleanup utilities
├── routes/
│   └── admin/
│       └── food/
│           ├── articles/
│           │   └── +page.svelte     # Delete artikel + cleanup
│           ├── create-article/
│           │   └── +page.svelte     # Temp tracking + cleanup
│           ├── edit-article/
│           │   └── [id]/
│           │       └── +page.svelte # Unused image cleanup
│           └── IMAGE_CLEANUP_SYSTEM.md # Dokumentasi ini
```

## Testing Scenarios

### Test Case 1: Cancel Create
1. Buka create article
2. Upload gambar thumbnail
3. Close tab/navigate away
4. **Expected**: Gambar dihapus dari storage

### Test Case 2: Delete Article
1. Buat artikel dengan gambar
2. Delete artikel dari list
3. **Expected**: Semua gambar artikel dihapus

### Test Case 3: Edit Replace Image
1. Edit artikel yang ada gambar
2. Ganti thumbnail dengan gambar baru
3. Save artikel
4. **Expected**: Gambar lama dihapus, baru tersimpan

### Test Case 4: Edit Remove Image
1. Edit artikel yang ada gambar
2. Hapus gambar dari form
3. Save artikel
4. **Expected**: Gambar dihapus dari storage

## Troubleshooting

### Issue: Gambar tidak terhapus
- Check console untuk error logs
- Verify Supabase permissions
- Check network connectivity

### Issue: Temp tracking tidak berfungsi
- Check sessionStorage support
- Verify browser not in private mode
- Check for JavaScript errors

### Manual Cleanup:
Jika perlu cleanup manual, gunakan Supabase Dashboard atau SQL:

```sql
-- List files in bucket
SELECT * FROM storage.objects WHERE bucket_id = 'article-images';

-- Delete orphaned files (hati-hati!)
DELETE FROM storage.objects 
WHERE bucket_id = 'article-images' 
AND name NOT IN (
  SELECT DISTINCT thumbnail_image FROM articles WHERE thumbnail_image IS NOT NULL
  UNION
  SELECT DISTINCT main_image FROM articles WHERE main_image IS NOT NULL
);
```

## Future Enhancements

1. **Batch Cleanup**: Periodic cleanup untuk orphaned files
2. **Usage Analytics**: Track storage usage dan cleanup statistics
3. **Admin Dashboard**: UI untuk manual cleanup dan monitoring
4. **Backup System**: Temporary backup sebelum delete (just in case)
5. **Size Optimization**: Auto-resize images sebelum upload
