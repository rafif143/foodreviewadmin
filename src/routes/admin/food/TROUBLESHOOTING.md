# Troubleshooting Guide - Sistem Content Blocks

## 🚨 Error yang Sering Terjadi

### 1. Error: "[object Object] is not valid JSON"

**Gejala:**
- Error muncul saat mengedit artikel
- Artikel tidak bisa di-load
- Console error: "Failed to parse JSON"

**Penyebab:**
- Content dari database sudah dalam format object/array, bukan string JSON
- Fungsi `JSON.parse()` dipanggil pada data yang sudah parsed

**Solusi:**
```javascript
// ❌ SALAH - Double parsing
const contentBlocks = JSON.parse(article.content); // Error jika content sudah object

// ✅ BENAR - Gunakan utility function
import { parseArticleContent } from '$lib/utils/contentParser.js';
const contentBlocks = parseArticleContent(article.content);
```

**Prevention:**
- Gunakan utility function `parseArticleContent()` untuk parsing content
- Selalu check tipe data sebelum parsing
- Implement safety checks untuk berbagai format content

### 2. Error: "Cannot read property 'length' of undefined"

**Gejala:**
- Error saat mencoba mengakses `contentBlocks.length`
- Component tidak render dengan benar

**Penyebab:**
- `contentBlocks` tidak terinisialisasi dengan benar
- Data belum di-load dari database

**Solusi:**
```javascript
// ❌ SALAH - Tidak ada default value
let contentBlocks;

// ✅ BENAR - Selalu berikan default value
let contentBlocks = [];

// ✅ LEBIH BAIK - Gunakan reactive statement
$: contentBlocks = parseArticleContent(article?.content) || [];
```

**Prevention:**
- Selalu berikan default value untuk array
- Gunakan optional chaining (`?.`)
- Implement loading states

### 3. Error: "Content blocks validation failed"

**Gejala:**
- Error saat save artikel
- Content tidak tersimpan dengan benar

**Penyebab:**
- Struktur content blocks tidak valid
- Missing required fields (id, type, content, order)

**Solusi:**
```javascript
// ❌ SALAH - Tidak ada validation
const content = JSON.stringify(formData.contentBlocks);

// ✅ BENAR - Gunakan validation
import { validateContentBlocks, stringifyContentBlocks } from '$lib/utils/contentParser.js';

if (!validateContentBlocks(formData.contentBlocks)) {
  throw new Error('Content blocks tidak valid');
}

const content = stringifyContentBlocks(formData.contentBlocks);
```

**Prevention:**
- Selalu validate content blocks sebelum save
- Gunakan utility function `stringifyContentBlocks()`
- Implement proper error handling

## 🔧 Debug Steps

### Step 1: Check Console Errors
```javascript
// Tambahkan logging untuk debug
console.log('Article content:', article.content);
console.log('Content type:', typeof article.content);
console.log('Parsed content blocks:', contentBlocks);
```

### Step 2: Check Data Structure
```javascript
// Pastikan struktur data benar
if (contentBlocks && Array.isArray(contentBlocks)) {
  contentBlocks.forEach((block, index) => {
    console.log(`Block ${index}:`, {
      id: block.id,
      type: block.type,
      content: block.content,
      order: block.order,
      config: block.config
    });
  });
}
```

### Step 3: Validate Database Content
```sql
-- Check content format di database
SELECT 
  id,
  title,
  CASE 
    WHEN jsonb_typeof(content) = 'array' THEN 'JSON Array'
    WHEN jsonb_typeof(content) = 'string' THEN 'JSON String'
    WHEN jsonb_typeof(content) = 'object' THEN 'JSON Object'
    ELSE 'Unknown'
  END as content_format,
  content
FROM articles 
WHERE id = 'your-article-id';
```

## 🛠️ Utility Functions

### parseArticleContent(content)
```javascript
import { parseArticleContent } from '$lib/utils/contentParser.js';

// Handle berbagai format content
const contentBlocks = parseArticleContent(article.content);

// Support untuk:
// - Array (format baru)
// - JSON string
// - HTML string (format lama)
// - Object (invalid format)
// - null/undefined
```

### stringifyContentBlocks(contentBlocks)
```javascript
import { stringifyContentBlocks } from '$lib/utils/contentParser.js';

// Convert content blocks ke JSON string
const content = stringifyContentBlocks(formData.contentBlocks);

// Safety check dan error handling
```

### validateContentBlocks(contentBlocks)
```javascript
import { validateContentBlocks } from '$lib/utils/contentParser.js';

// Validate struktur content blocks
if (!validateContentBlocks(formData.contentBlocks)) {
  throw new Error('Content blocks tidak valid');
}
```

## 📋 Best Practices

### 1. Content Loading
```javascript
// ✅ Gunakan reactive statement
$: contentBlocks = parseArticleContent(article?.content) || [];

// ✅ Handle loading state
{#if !contentBlocks || contentBlocks.length === 0}
  <div>Loading content...</div>
{:else}
  <ContentBlockEditor {contentBlocks} />
{/if}
```

### 2. Content Saving
```javascript
// ✅ Validate sebelum save
if (!validateContentBlocks(formData.contentBlocks)) {
  throw new Error('Content blocks tidak valid');
}

// ✅ Gunakan utility function
const content = stringifyContentBlocks(formData.contentBlocks);
```

### 3. Error Handling
```javascript
// ✅ Implement proper error handling
try {
  const contentBlocks = parseArticleContent(article.content);
  // Process content
} catch (error) {
  console.error('Error parsing content:', error);
  // Fallback ke default content
  contentBlocks = [];
}
```

## 🔍 Common Issues & Solutions

### Issue: Artikel lama tidak bisa diedit
**Solution:** Gunakan `migrateOldContent()` untuk convert format lama ke baru

### Issue: Content blocks hilang setelah save
**Solution:** Pastikan menggunakan `stringifyContentBlocks()` untuk convert ke JSON

### Issue: Preview tidak muncul
**Solution:** Check apakah `contentBlocks` array valid dan tidak empty

### Issue: Drag & drop tidak berfungsi
**Solution:** Pastikan setiap block memiliki `id` dan `order` yang unique

## 📞 Getting Help

Jika masih mengalami masalah:

1. **Check Console:** Lihat error messages di browser console
2. **Verify Data:** Pastikan struktur data di database benar
3. **Use Utilities:** Gunakan utility functions yang sudah disediakan
4. **Check Logs:** Review server logs untuk error details
5. **Test Cases:** Jalankan test cases di `contentParser.test.js`

## 📚 Related Documentation

- [Content System Overview](./CONTENT_SYSTEM.md)
- [System Overview](./SYSTEM_OVERVIEW.md)
- [Content Update Guide](./README_CONTENT_UPDATE.md)
- [Test Data](./test-content-data.sql)
