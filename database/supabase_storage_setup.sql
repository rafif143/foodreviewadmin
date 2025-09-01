-- Setup Supabase Storage for about-us-images
-- Run this in Supabase SQL Editor

-- Create storage bucket for about-us images
INSERT INTO storage.buckets (id, name, public)
VALUES ('about-us-images', 'about-us-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for about-us-images bucket

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload about-us images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'about-us-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to view images
CREATE POLICY "Allow authenticated users to view about-us images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'about-us-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own images
CREATE POLICY "Allow authenticated users to update about-us images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'about-us-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated users to delete about-us images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'about-us-images' 
  AND auth.role() = 'authenticated'
);

-- Alternative: Make bucket completely public (if you want images to be publicly accessible)
-- UPDATE storage.buckets SET public = true WHERE id = 'about-us-images';
