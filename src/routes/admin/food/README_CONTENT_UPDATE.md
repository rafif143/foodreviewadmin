# Update Sistem Content Blocks - Food Blogging Admin

## 🎯 Overview

Sistem content blocks telah diperbarui untuk memberikan pengalaman yang lebih fleksibel dan powerful dalam pembuatan artikel. Sekarang Anda bisa membuat artikel dengan multiple content blocks yang bisa diurutkan dan diatur sesuai kebutuhan.

## ✨ Fitur Baru

### 1. Multiple Content Block Types
- **📝 Rich Text**: Editor dengan formatting lengkap (TipTap)
- **🖼️ Image**: Gambar dengan alt text dan caption

### 2. Advanced Block Management
- **Drag & Drop**: Pindahkan block ke atas/bawah
- **Duplicate**: Duplikasi block untuk efisiensi
- **Insert**: Tambah block di posisi tertentu
- **Delete**: Hapus block yang tidak diperlukan

### 3. Real-time Preview
- Preview konten artikel secara real-time
- Toggle show/hide block labels
- Responsive design untuk mobile dan desktop

### 4. Enhanced User Experience
- Interface yang lebih intuitif
- Visual feedback untuk setiap action
- Error handling yang lebih baik
- Auto-save content blocks

## 🔄 Perubahan yang Dibuat

### Komponen Baru
1. **ContentBlockEditor.svelte** - Editor utama untuk content blocks
2. **ContentBlockPreview.svelte** - Preview content blocks
3. **ArticleRenderer.svelte** - Render artikel di frontend

### Komponen yang Diupdate
1. **Create Article Page** - Menggunakan ContentBlockEditor
2. **Edit Article Page** - Menggunakan ContentBlockEditor
3. **ArticleContentPreview.svelte** - Support untuk content blocks

### Database Structure
- Field `content` tetap menggunakan tipe `jsonb`
- Format baru: JSON array dengan content blocks
- Backward compatibility dengan format lama

## 🚀 Cara Penggunaan

### Membuat Artikel Baru
1. Buka halaman "Create Article"
2. Isi informasi dasar artikel
3. Gunakan Content Block Editor:
   - Klik tombol tipe block yang diinginkan
   - Isi konten sesuai tipe block
   - Atur urutan dengan tombol up/down
   - Duplikasi block jika diperlukan
4. Preview konten sebelum publish
5. Save artikel

### Mengedit Artikel
1. Buka halaman "Edit Article"
2. Modifikasi content blocks yang ada
3. Tambah/hapus/reorder blocks
4. Preview perubahan
5. Save perubahan

### Tipe Content Blocks

#### Rich Text (📝)
- Gunakan toolbar untuk formatting
- Support heading H1-H6, list, blockquote
- Text alignment dan highlight
- Link dan image embedding

#### Image (🖼️)
- Masukkan URL gambar
- Isi alt text untuk accessibility
- Tambah caption jika diperlukan
- Preview gambar real-time



## 📱 Responsive Design

- **Desktop**: Full toolbar dan controls
- **Tablet**: Optimized layout untuk touch
- **Mobile**: Simplified interface untuk mobile

## 🔧 Technical Details

### Data Structure
```json
{
  "contentBlocks": [
    {
      "id": "unique_id",
      "type": "rich_text",
      "content": "<p>Konten HTML...</p>",
      "order": 0,
      "config": {}
    }
  ]
}
```

### Component Props
- `contentBlocks`: Array of content blocks
- `onChange`: Callback function untuk content changes
- `showLabels`: Toggle untuk menampilkan/menyembunyikan labels

### Events
- `change`: Emitted ketika content berubah
- `blockAdded`: Emitted ketika block baru ditambahkan
- `blockRemoved`: Emitted ketika block dihapus
- `blockMoved`: Emitted ketika block dipindahkan

## 🐛 Troubleshooting

### Common Issues
1. **Block tidak tersimpan**
   - Pastikan semua required fields terisi
   - Check console untuk error messages
   - Refresh halaman jika diperlukan

2. **Preview tidak muncul**
   - Pastikan ada content blocks
   - Check browser console
   - Verify data structure

3. **Image tidak load**
   - Periksa URL gambar
   - Pastikan URL dapat diakses
   - Check CORS settings

4. **Video tidak embed**
   - Pastikan URL video valid
   - Check platform support
   - Verify video ID

### Debug Mode
- Enable console logging
- Check network requests
- Verify data structure
- Use browser dev tools

## 🔮 Future Enhancements

### Planned Features
- Visual drag & drop editor
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

## 📚 Documentation

- **CONTENT_SYSTEM.md**: Dokumentasi lengkap sistem
- **Component API**: Props, events, dan methods
- **Best Practices**: Tips penggunaan dan optimization
- **Migration Guide**: Dari sistem lama ke baru

## 🤝 Support

Jika ada pertanyaan atau masalah:
1. Check dokumentasi ini
2. Review console errors
3. Verify data structure
4. Contact development team

## 📝 Changelog

### v2.0.0 - Content Blocks System
- ✨ Multiple content block types
- 🔄 Advanced block management
- 📱 Real-time preview
- 🎨 Enhanced UI/UX
- 📚 Comprehensive documentation

### v1.0.0 - Legacy System
- Basic TipTap editor
- Simple content management
- Basic preview functionality
