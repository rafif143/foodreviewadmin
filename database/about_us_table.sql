-- Create about_us table
CREATE TABLE IF NOT EXISTS about_us (
  id BIGSERIAL PRIMARY KEY,
  website_id BIGINT NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  profile_image TEXT,
  twitter_url TEXT,
  pinterest_url TEXT,
  telegram_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_about_us_website_id ON about_us(website_id);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_about_us_updated_at 
    BEFORE UPDATE ON about_us 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for existing websites (adjust website_id as needed)
-- INSERT INTO about_us (website_id, name, description, profile_image, twitter_url, pinterest_url, telegram_url, instagram_url)
-- VALUES 
--   (1, 'Dean Mel', 'Passionate food blogger and culinary enthusiast. Exploring the world one dish at a time.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face', 'https://x.com/kelantanfoodreview', 'https://pinterest.com/kelantanfoodreview', 'https://telegram.me/kelantanfoodreview', 'https://instagram.com/kelantanfoodreview');
