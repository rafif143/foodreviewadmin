# Sistem Content Blocks untuk Artikel

## Overview

Sistem content blocks memungkinkan pembuatan artikel dengan struktur yang fleksibel dan modular. Setiap artikel dapat terdiri dari multiple content blocks dengan tipe yang berbeda, yang dapat diurutkan dan diatur sesuai kebutuhan.

## Tipe Content Blocks

### 1. Rich Text (📝)
- **Deskripsi**: Editor rich text dengan formatting lengkap (heading, bold, italic, list, dll)
- **Fitur**: 
  - Toolbar formatting lengkap
  - Support untuk heading H1-H6
  - List (bullet dan numbered)
  - Blockquote
  - Text alignment
  - Highlight text
  - Link dan image embedding
- **Penggunaan**: Untuk konten teks utama artikel

### 2. Image (🖼️)
- **Deskripsi**: Gambar dengan caption dan alt text
- **Fitur**:
  - URL gambar
  - Alt text untuk accessibility
  - Caption gambar
  - Preview gambar real-time
- **Penggunaan**: Untuk menampilkan gambar dalam artikel

## Fitur Utama

### Drag & Drop Reordering
- Setiap block dapat dipindahkan ke atas/bawah
- Urutan otomatis tersimpan
- Visual indicator untuk posisi block

### Block Management
- **Tambah**: Pilih tipe block dari dropdown
- **Hapus**: Hapus block yang tidak diperlukan
- **Duplicate**: Duplikasi block untuk efisiensi
- **Insert**: Tambah block di posisi tertentu

### Real-time Preview
- Preview konten artikel secara real-time
- Toggle show/hide labels
- Responsive design untuk mobile dan desktop

### Content Validation
- Validasi required fields
- Error handling untuk invalid content
- Auto-save content blocks

## Struktur Data

```json
{
  "contentBlocks": [
    {
      "id": "unique_id",
      "type": "rich_text",
      "content": "<p>Konten HTML...</p>",
      "order": 0,
      "config": {}
    },
    {
      "id": "unique_id_2",
      "type": "image",
      "content": "https://example.com/image.jpg",
      "order": 1,
      "config": {
        "alt": "Deskripsi gambar",
        "caption": "Caption gambar"
      }
    }
  ]
}
```

## Cara Penggunaan

### 1. Membuat Artikel Baru
1. Buka halaman "Create Article"
2. Isi informasi dasar artikel (judul, author, dll)
3. Gunakan Content Block Editor untuk menambah konten
4. Pilih tipe block yang diinginkan
5. Atur urutan block sesuai kebutuhan
6. Preview konten sebelum publish

### 2. Mengedit Artikel
1. Buka halaman "Edit Article"
2. Modifikasi content blocks yang ada
3. Tambah/hapus/reorder blocks
4. Preview perubahan
5. Save perubahan

### 3. Frontend Display
- Gunakan komponen `ArticleRenderer` untuk menampilkan artikel
- Content blocks akan otomatis di-render sesuai tipe
- Responsive design untuk berbagai ukuran layar

## Komponen yang Digunakan

### ContentBlockEditor
- Editor utama untuk membuat dan mengatur content blocks
- Support untuk semua tipe block
- Drag & drop reordering
- Real-time preview

### ContentBlockPreview
- Preview content blocks
- Toggle show/hide labels
- Responsive rendering

### ArticleRenderer
- Render artikel lengkap di frontend
- Header artikel dengan metadata
- Content blocks rendering
- Footer dengan tags dan labels

## Best Practices

### 1. Content Structure
- Gunakan Rich Text untuk konten utama
- Tambah Image untuk ilustrasi

### 2. Performance
- Optimize gambar sebelum upload
- Gunakan lazy loading untuk media
- Compress video jika memungkinkan

### 3. Accessibility
- Selalu isi alt text untuk gambar
- Gunakan heading yang proper (H1-H6)
- Pastikan kontras warna yang baik
- Support keyboard navigation

### 4. SEO
- Gunakan heading yang descriptive
- Optimize alt text dan caption
- Struktur konten yang logis
- Meta description yang menarik

## Migration dari Sistem Lama

Jika artikel lama menggunakan format HTML string, sistem akan otomatis:
1. Detect format content
2. Convert ke content blocks jika diperlukan
3. Maintain backward compatibility
4. Provide migration tools jika diperlukan

## Troubleshooting

### Common Issues
1. **Block tidak tersimpan**: Pastikan semua required fields terisi
2. **Preview tidak muncul**: Refresh halaman atau check console errors
3. **Image tidak load**: Periksa URL gambar dan CORS settings
4. **Video tidak embed**: Pastikan URL video valid dan supported

### Debug Mode
- Enable console logging untuk debugging
- Check network requests
- Verify data structure

## Future Enhancements

### Planned Features
- Drag & drop visual editor
- Template content blocks
- Advanced media management
- Content analytics
- A/B testing support
- Multi-language support

### Integration
- CMS integration
- Third-party media services
- Social media sharing
- Newsletter integration
- E-commerce integration
