-- Setup Supabase Storage untuk gambar artikel
-- Jalankan script ini di Supabase SQL Editor

-- Buat storage bucket untuk gambar artikel
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies untuk article-images bucket

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload article images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to view images  
CREATE POLICY "Allow authenticated users to view article images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update images
CREATE POLICY "Allow authenticated users to update article images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete article images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'article-images' 
  AND auth.role() = 'authenticated'
);

-- Alternative: Buat bucket yang completely public (jika ingin gambar bisa diakses publik tanpa auth)
-- UPDATE storage.buckets SET public = true WHERE id = 'article-images';

-- Buat policy untuk public access jika diperlukan
CREATE POLICY "Allow public to view article images" ON storage.objects
FOR SELECT USING (bucket_id = 'article-images');

-- Set file size limit (10MB) dan allowed file types
-- Note: File size limit biasanya diatur di aplikasi, bukan di database
-- Tapi bisa juga ditambahkan constraint di policy jika diperlukan

-- Contoh policy dengan size limit (opsional):
-- CREATE POLICY "Article images size limit" ON storage.objects
-- FOR INSERT WITH CHECK (
--   bucket_id = 'article-images' 
--   AND auth.role() = 'authenticated'
--   AND (metadata->>'size')::int < 10485760  -- 10MB in bytes
-- );
