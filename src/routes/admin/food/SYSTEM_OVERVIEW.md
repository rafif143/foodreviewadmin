# Sistem Content Blocks - Overview

## 🎯 Deskripsi Sistem

Sistem content blocks yang disederhanakan untuk pembuatan artikel dengan struktur yang fleksibel dan modular. Sistem ini mendukung 2 tipe content blocks utama: **Rich Text** dan **Image**.

## 📋 Tipe Content Blocks

### 1. Rich Text (📝)
- **Deskripsi**: Editor rich text dengan formatting lengkap menggunakan TipTap
- **Fitur**:
  - Toolbar formatting lengkap (heading, bold, italic, list, dll)
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

## 🏗️ Struktur Data

### Format JSON Content Blocks
```json
[
  {
    "id": 1703123456789,
    "type": "rich_text",
    "content": "<h2>Judul</h2><p>Konten...</p>",
    "order": 0,
    "config": {}
  },
  {
    "id": 1703123456790,
    "type": "image",
    "content": "https://example.com/image.jpg",
    "order": 1,
    "config": {
      "alt": "Deskripsi gambar",
      "caption": "Caption gambar"
    }
  }
]
```

### Database Schema
```sql
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  website_id integer NOT NULL,
  title character varying(255) NOT NULL,
  slug character varying(255) NOT NULL,
  author character varying(100) NOT NULL,
  minute_read integer NOT NULL DEFAULT 5,
  category character varying(50) NOT NULL,
  thumbnail_image character varying(500) NOT NULL,
  main_image character varying(500) NULL,
  summary text NULL,
  content jsonb NOT NULL, -- Menyimpan content blocks dalam format JSON
  is_published boolean NULL DEFAULT false,
  published_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  visit_count bigint NULL,
  tags text[] NULL DEFAULT '{}'::text[],
  labels text[] NULL DEFAULT '{}'::text[],
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_website_id_slug_key UNIQUE (website_id, slug),
  CONSTRAINT articles_website_id_fkey FOREIGN KEY (website_id) REFERENCES websites (id)
);
```

## 🔧 Komponen Utama

### 1. ContentBlockEditor.svelte
- Komponen utama untuk editing content blocks
- Mendukung drag & drop untuk reordering
- Toolbar untuk menambah block baru
- Preview real-time untuk setiap block

### 2. ContentBlockPreview.svelte
- Komponen untuk menampilkan preview content blocks
- Render HTML content dengan aman
- Support untuk responsive images
- Styling yang konsisten

### 3. ArticleRenderer.svelte
- Komponen untuk menampilkan artikel di frontend
- Parse JSON content blocks
- Layout yang responsif
- Support untuk metadata artikel

## 🚀 Fitur Utama

### 1. Block Management
- **Tambah Block**: Dropdown untuk memilih tipe block
- **Reorder**: Drag & drop untuk mengubah urutan
- **Duplicate**: Duplikasi block untuk efisiensi
- **Delete**: Hapus block yang tidak diperlukan
- **Insert**: Tambah block di posisi tertentu

### 2. Rich Text Editor
- **TipTap Integration**: Editor WYSIWYG yang powerful
- **Toolbar Lengkap**: Formatting, heading, list, dll
- **Auto-save**: Konten tersimpan otomatis
- **HTML Output**: Output HTML yang bersih

### 3. Image Management
- **URL Input**: Masukkan URL gambar
- **Alt Text**: Accessibility support
- **Caption**: Caption gambar yang fleksibel
- **Preview**: Preview real-time

### 4. Responsive Design
- **Mobile-friendly**: Interface yang responsif
- **Touch Support**: Support untuk touch devices
- **Flexible Layout**: Layout yang menyesuaikan ukuran layar

## 📱 Penggunaan

### 1. Create Article
```javascript
// Form data structure
let formData = {
  title: '',
  slug: '',
  author: '',
  minute_read: 5,
  category: 'food',
  thumbnail_image: '',
  main_image: '',
  summary: '',
  contentBlocks: [], // Array of content blocks
  is_published: false,
  tags: [],
  labels: []
};

// Handle content blocks change
function handleContentBlocksChange(newContentBlocks) {
  formData.contentBlocks = newContentBlocks;
}
```

### 2. Save to Database
```javascript
// Prepare data for insertion
const articleData = {
  website_id: selectedWebsite.id,
  title: formData.title.trim(),
  slug: formData.slug.trim(),
  author: formData.author.trim(),
  minute_read: parseInt(formData.minute_read) || 5,
  category: formData.category,
  thumbnail_image: formData.thumbnail_image.trim() || null,
  main_image: formData.main_image.trim() || null,
  summary: formData.summary.trim() || null,
  content: JSON.stringify(formData.contentBlocks), // Convert to JSON string
  is_published: formData.is_published,
  published_at: formData.is_published ? new Date().toISOString() : null,
  tags: formData.tags.length > 0 ? formData.tags : [],
  labels: formData.labels.length > 0 ? formData.labels : []
};
```

### 3. Display Article
```javascript
// Parse content blocks from JSON
$: contentBlocks = (() => {
  if (!article?.content) return [];
  try {
    return JSON.parse(article.content);
  } catch {
    return [];
  }
})();
```

## 🔄 Backward Compatibility

Sistem mendukung backward compatibility untuk artikel dengan format lama:

### Format Lama (HTML String)
```html
<h2>Judul Artikel</h2>
<p>Konten artikel dalam format HTML...</p>
```

### Konversi Otomatis
- Artikel dengan format lama akan otomatis dikonversi saat diedit
- Format lama tetap dapat ditampilkan dengan benar
- Tidak ada data yang hilang saat migrasi

## 🎨 Styling

### CSS Classes
- `.content-block`: Container untuk setiap block
- `.content-preview`: Container untuk preview
- `.prose`: Styling untuk rich text content
- `.block-toolbar`: Toolbar untuk block management

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Touch-friendly interface
- Optimized for various screen sizes

## 🔍 Testing

### Test Data
File `test-content-data.sql` berisi contoh data untuk testing:
- Artikel dengan content blocks (Rich Text + Image)
- Artikel dengan Rich Text saja
- Artikel dengan format lama (HTML string)

### Test Scenarios
1. Create article dengan multiple blocks
2. Edit article dengan content blocks
3. Reorder blocks
4. Add/remove blocks
5. Backward compatibility testing

## 📚 Dokumentasi Terkait

- `CONTENT_SYSTEM.md`: Dokumentasi detail sistem content blocks
- `README_CONTENT_UPDATE.md`: Panduan update sistem
- `test-content-data.sql`: Data testing

## 🛠️ Maintenance

### Regular Tasks
- Monitor performance content blocks
- Update TipTap editor jika diperlukan
- Optimize image loading
- Review accessibility features

### Troubleshooting
- Check JSON format validity
- Verify image URLs
- Monitor editor performance
- Test backward compatibility
