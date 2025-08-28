-- Test data untuk sistem content blocks yang disederhanakan
-- Hanya mendukung Rich Text dan Image

-- Contoh artikel dengan content blocks (Rich Text + Image)
INSERT INTO public.articles (
  website_id,
  title,
  slug,
  author,
  minute_read,
  category,
  thumbnail_image,
  main_image,
  summary,
  content,
  is_published,
  published_at,
  tags,
  labels
) VALUES (
  1, -- Ganti dengan website_id yang sesuai
  'Resep Nasi Goreng Spesial',
  'resep-nasi-goreng-spesial',
  'Chef Budi',
  8,
  'recipe',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&h=800&fit=crop',
  'Nasi goreng spesial dengan bumbu rahasia yang membuat cita rasa yang tak terlupakan. Cocok untuk sarapan atau makan malam.',
  '[
    {
      "id": 1703123456789,
      "type": "rich_text",
      "content": "<h2>Bahan-bahan Nasi Goreng Spesial</h2><p>Untuk membuat nasi goreng spesial yang lezat, Anda memerlukan bahan-bahan berikut:</p><ul><li>3 piring nasi putih (nasi dingin)</li><li>3 siung bawang putih, cincang halus</li><li>2 siung bawang merah, iris tipis</li><li>2 butir telur</li><li>100g ayam fillet, potong dadu</li><li>50g udang, kupas</li><li>2 sdm kecap manis</li><li>1 sdt garam</li><li>1/2 sdt merica</li><li>2 sdm minyak goreng</li></ul>",
      "order": 0,
      "config": {}
    },
    {
      "id": 1703123456790,
      "type": "image",
      "content": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
      "order": 1,
      "config": {
        "alt": "Nasi goreng spesial dengan telur dan ayam",
        "caption": "Nasi goreng spesial dengan bumbu rahasia"
      }
    },
    {
      "id": 1703123456791,
      "type": "rich_text",
      "content": "<h2>Cara Memasak</h2><p>Berikut adalah langkah-langkah untuk membuat nasi goreng spesial:</p><ol><li><strong>Panaskan minyak</strong> dalam wajan besar dengan api sedang</li><li>Tumis bawang putih dan bawang merah hingga harum</li><li>Masukkan ayam fillet, masak hingga berubah warna</li><li>Tambahkan udang, masak hingga matang</li><li>Pindahkan daging ke pinggir wajan, buat lubang di tengah</li><li>Masukkan telur, orak-arik hingga setengah matang</li><li>Campurkan dengan daging yang sudah dimasak</li><li>Masukkan nasi putih, aduk rata</li><li>Tambahkan kecap manis, garam, dan merica</li><li>Aduk terus hingga semua bahan tercampur rata</li><li>Angkat dan sajikan selagi hangat</li></ol>",
      "order": 2,
      "config": {}
    },
    {
      "id": 1703123456792,
      "type": "rich_text",
      "content": "<h3>Tips Memasak</h3><p>Untuk hasil terbaik, gunakan nasi yang sudah dingin (nasi kemarin). Nasi yang masih hangat akan membuat nasi goreng menjadi lembek dan tidak enak.</p><p>Jangan lupa untuk selalu menggunakan api sedang agar bumbu tidak gosong dan nasi tetap enak.</p>",
      "order": 3,
      "config": {}
    }
  ]'::jsonb,
  true,
  NOW(),
  ARRAY['nasi goreng', 'resep', 'masakan indonesia'],
  ARRAY['makanan', 'sarapan']
);

-- Contoh artikel kedua dengan content blocks (Rich Text saja)
INSERT INTO public.articles (
  website_id,
  title,
  slug,
  author,
  minute_read,
  category,
  thumbnail_image,
  main_image,
  summary,
  content,
  is_published,
  published_at,
  tags,
  labels
) VALUES (
  1, -- Ganti dengan website_id yang sesuai
  'Review Cafe Terbaik di Jakarta',
  'review-cafe-terbaik-jakarta',
  'Food Blogger Sarah',
  5,
  'cafe',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop',
  'Menjelajahi cafe-cafe terbaik di Jakarta yang wajib dikunjungi untuk coffee lovers dan foodies.',
  '[
    {
      "id": 1703123456793,
      "type": "rich_text",
      "content": "<h2>10 Cafe Terbaik di Jakarta</h2><p>Jakarta memiliki banyak cafe yang menawarkan pengalaman kuliner yang unik. Berikut adalah daftar cafe terbaik yang wajib dikunjungi:</p>",
      "order": 0,
      "config": {}
    },
    {
      "id": 1703123456794,
      "type": "rich_text",
      "content": "<h3>1. Kopi Kenangan</h3><p>Terletak di berbagai lokasi strategis, Kopi Kenangan menawarkan kopi berkualitas dengan harga terjangkau. Signature drink mereka adalah Kopi Susu Gula Aren yang sudah menjadi favorit banyak orang.</p><p><strong>Lokasi:</strong> Multiple locations<br><strong>Harga:</strong> Rp 15.000 - Rp 35.000<br><strong>Rating:</strong> ⭐⭐⭐⭐⭐</p>",
      "order": 1,
      "config": {}
    },
    {
      "id": 1703123456795,
      "type": "image",
      "content": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
      "order": 2,
      "config": {
        "alt": "Interior cafe modern dengan suasana nyaman",
        "caption": "Suasana nyaman di salah satu cafe terbaik Jakarta"
      }
    },
    {
      "id": 1703123456796,
      "type": "rich_text",
      "content": "<h3>2. Starbucks Reserve</h3><p>Untuk pengalaman kopi premium, Starbucks Reserve di Grand Indonesia adalah pilihan yang tepat. Mereka menawarkan berbagai jenis kopi single origin dan brewing method yang unik.</p><p><strong>Lokasi:</strong> Grand Indonesia<br><strong>Harga:</strong> Rp 50.000 - Rp 150.000<br><strong>Rating:</strong> ⭐⭐⭐⭐⭐</p>",
      "order": 3,
      "config": {}
    },
    {
      "id": 1703123456797,
      "type": "rich_text",
      "content": "<h3>3. Tanamera Coffee</h3><p>Cafe lokal yang fokus pada kopi Indonesia. Mereka menggunakan biji kopi dari berbagai daerah di Indonesia dan menawarkan pengalaman kopi yang autentik.</p><p><strong>Lokasi:</strong> SCBD, Senayan<br><strong>Harga:</strong> Rp 25.000 - Rp 60.000<br><strong>Rating:</strong> ⭐⭐⭐⭐</p>",
      "order": 4,
      "config": {}
    }
  ]'::jsonb,
  true,
  NOW(),
  ARRAY['cafe', 'jakarta', 'kopi', 'review'],
  ARRAY['kuliner', 'lifestyle']
);

-- Contoh artikel ketiga dengan content blocks (Image + Rich Text)
INSERT INTO public.articles (
  website_id,
  title,
  slug,
  author,
  minute_read,
  category,
  thumbnail_image,
  main_image,
  summary,
  content,
  is_published,
  published_at,
  tags,
  labels
) VALUES (
  1, -- Ganti dengan website_id yang sesuai
  'Makanan Tradisional Indonesia yang Wajib Dicoba',
  'makanan-tradisional-indonesia-wajib-dicoba',
  'Kuliner Indonesia',
  6,
  'food',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop',
  'Menjelajahi kekayaan kuliner Indonesia dengan berbagai makanan tradisional yang memiliki cita rasa unik dan autentik.',
  '[
    {
      "id": 1703123456798,
      "type": "rich_text",
      "content": "<h2>Kekayaan Kuliner Indonesia</h2><p>Indonesia memiliki kekayaan kuliner yang sangat beragam, dari Sabang sampai Merauke. Setiap daerah memiliki makanan khas yang unik dan lezat.</p>",
      "order": 0,
      "config": {}
    },
    {
      "id": 1703123456799,
      "type": "image",
      "content": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "order": 1,
      "config": {
        "alt": "Makanan tradisional Indonesia yang beragam",
        "caption": "Berbagai makanan tradisional Indonesia yang lezat"
      }
    },
    {
      "id": 1703123456800,
      "type": "rich_text",
      "content": "<h3>Makanan dari Jawa</h3><p>Jawa memiliki banyak makanan tradisional yang terkenal:</p><ul><li><strong>Gudeg</strong> - Makanan khas Yogyakarta dari nangka muda</li><li><strong>Sate</strong> - Berbagai jenis sate dari berbagai daerah</li><li><strong>Rawon</strong> - Sup hitam khas Jawa Timur</li><li><strong>Gado-gado</strong> - Salad sayuran dengan bumbu kacang</li></ul>",
      "order": 2,
      "config": {}
    },
    {
      "id": 1703123456801,
      "type": "rich_text",
      "content": "<h3>Makanan dari Sumatra</h3><p>Sumatra juga memiliki makanan tradisional yang unik:</p><ul><li><strong>Rendang</strong> - Daging sapi dengan bumbu rempah khas Padang</li><li><strong>Pempek</strong> - Makanan dari ikan khas Palembang</li><li><strong>Mie Aceh</strong> - Mie dengan bumbu khas Aceh</li><li><strong>Gulai</strong> - Berbagai jenis gulai dengan santan</li></ul>",
      "order": 3,
      "config": {}
    },
    {
      "id": 1703123456802,
      "type": "rich_text",
      "content": "<h3>Makanan dari Sulawesi</h3><p>Sulawesi memiliki makanan tradisional yang lezat:</p><ul><li><strong>Coto Makassar</strong> - Sup daging sapi khas Makassar</li><li><strong>Bubur Manado</strong> - Bubur dengan berbagai sayuran</li><li><strong>Ikan Bakar</strong> - Berbagai jenis ikan bakar</li></ul>",
      "order": 4,
      "config": {}
    }
  ]'::jsonb,
  true,
  NOW(),
  ARRAY['makanan tradisional', 'indonesia', 'kuliner'],
  ARRAY['budaya', 'makanan']
);

-- Contoh artikel dengan format lama (HTML string) untuk testing backward compatibility
INSERT INTO public.articles (
  website_id,
  title,
  slug,
  author,
  minute_read,
  category,
  thumbnail_image,
  main_image,
  summary,
  content,
  is_published,
  published_at,
  tags,
  labels
) VALUES (
  1, -- Ganti dengan website_id yang sesuai
  'Artikel dengan Format Lama',
  'artikel-format-lama',
  'Admin',
  3,
  'food',
  'https://images.unsplash.com/photo-1504674900240-9c9c0b1b0b0b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1504674900240-9c9c0b1b0b0b?w=1200&h=800&fit=crop',
  'Artikel ini menggunakan format lama (HTML string) untuk testing backward compatibility.',
  '<h2>Artikel dengan Format Lama</h2><p>Ini adalah artikel yang menggunakan format lama dengan HTML string. Artikel ini akan otomatis dikonversi ke format content blocks saat diedit.</p><p>Format ini masih didukung untuk backward compatibility.</p>',
  true,
  NOW(),
  ARRAY['format lama', 'testing'],
  ARRAY['test']
);
