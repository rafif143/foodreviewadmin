-- =====================================================
-- Video Table Schema Update: Support for TikTok Videos
-- =====================================================
-- This file contains the updated schema for the videos table
-- to support both YouTube and TikTok videos with the new video_type column

-- Drop existing table if you want to recreate (use carefully!)
-- DROP TABLE IF EXISTS public.videos CASCADE;

-- Create updated videos table with video_type support
CREATE TABLE IF NOT EXISTS public.videos (
  id SERIAL NOT NULL,
  website_id INTEGER NOT NULL,
  title CHARACTER VARYING(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NULL,
  video_type CHARACTER VARYING(20) NULL DEFAULT 'youtube'::CHARACTER VARYING,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  is_active BOOLEAN NULL DEFAULT TRUE,
  
  -- Constraints
  CONSTRAINT videos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_videos_website FOREIGN KEY (website_id) 
    REFERENCES websites (id) ON DELETE CASCADE,
  CONSTRAINT check_video_type CHECK (
    (video_type)::TEXT = ANY (
      (ARRAY[
        'youtube'::CHARACTER VARYING,
        'tiktok'::CHARACTER VARYING
      ])::TEXT[]
    )
  )
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_website_id 
  ON public.videos USING BTREE (website_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_videos_active 
  ON public.videos USING BTREE (is_active) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_videos_video_type 
  ON public.videos USING BTREE (video_type) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_videos_created_at 
  ON public.videos USING BTREE (created_at DESC) TABLESPACE pg_default;

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_videos_website_active_type 
  ON public.videos USING BTREE (website_id, is_active, video_type) TABLESPACE pg_default;

-- =====================================================
-- Migration Script: Add video_type to existing table
-- =====================================================
-- Use this if you have existing videos table and want to add video_type column

-- Add video_type column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' 
    AND column_name = 'video_type'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.videos 
    ADD COLUMN video_type CHARACTER VARYING(20) DEFAULT 'youtube';
    
    -- Add check constraint
    ALTER TABLE public.videos 
    ADD CONSTRAINT check_video_type CHECK (
      (video_type)::TEXT = ANY (
        (ARRAY[
          'youtube'::CHARACTER VARYING,
          'tiktok'::CHARACTER VARYING
        ])::TEXT[]
      )
    );
    
    -- Update existing records to have video_type based on URL
    UPDATE public.videos 
    SET video_type = CASE 
      WHEN url ILIKE '%tiktok.com%' THEN 'tiktok'
      ELSE 'youtube'
    END
    WHERE video_type IS NULL OR video_type = '';
    
    -- Make video_type NOT NULL after setting default values
    ALTER TABLE public.videos 
    ALTER COLUMN video_type SET NOT NULL;
    
    RAISE NOTICE 'video_type column added successfully';
  ELSE
    RAISE NOTICE 'video_type column already exists';
  END IF;
END $$;

-- Create index for video_type if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_videos_video_type 
  ON public.videos USING BTREE (video_type) TABLESPACE pg_default;

-- =====================================================
-- Sample Data for Testing
-- =====================================================

-- Insert sample YouTube video (replace website_id with actual value)
INSERT INTO public.videos (website_id, title, url, description, video_type, is_active)
VALUES 
  (1, 'Sample YouTube Video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'This is a sample YouTube video description', 'youtube', true)
ON CONFLICT DO NOTHING;

-- Insert sample TikTok video (replace website_id with actual value)
INSERT INTO public.videos (website_id, title, url, description, video_type, is_active)
VALUES 
  (1, 'Sample TikTok Video', 'https://www.tiktok.com/@username/video/1234567890', 'This is a sample TikTok video description', 'tiktok', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Useful Queries for Testing
-- =====================================================

-- Get all videos with their types
-- SELECT id, title, url, video_type, is_active, created_at FROM public.videos ORDER BY created_at DESC;

-- Get videos by type
-- SELECT * FROM public.videos WHERE video_type = 'youtube' AND is_active = true;
-- SELECT * FROM public.videos WHERE video_type = 'tiktok' AND is_active = true;

-- Get video statistics by type
-- SELECT 
--   video_type,
--   COUNT(*) as total_videos,
--   COUNT(CASE WHEN is_active = true THEN 1 END) as active_videos
-- FROM public.videos 
-- GROUP BY video_type;

-- Get videos for a specific website
-- SELECT * FROM public.videos WHERE website_id = 1 AND is_active = true ORDER BY created_at DESC;
