-- Enable RLS on videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Policy for reading videos (public access for active videos)
CREATE POLICY "Videos are viewable by everyone" ON public.videos
  FOR SELECT USING (is_active = true);

-- Policy for inserting videos (only authenticated users can insert)
CREATE POLICY "Users can insert videos" ON public.videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating videos (only authenticated users can update)
CREATE POLICY "Users can update videos" ON public.videos
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for deleting videos (only authenticated users can delete)
CREATE POLICY "Users can delete videos" ON public.videos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at when video is updated
CREATE TRIGGER update_videos_updated_at 
    BEFORE UPDATE ON public.videos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_videos_website_active ON public.videos(website_id, is_active);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
