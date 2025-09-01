# Video System Update: YouTube + TikTok Support

## Overview
Sistem video telah diupdate untuk mendukung both YouTube dan TikTok videos dengan menambahkan kolom `video_type` pada database.

## Database Changes

### New Schema
```sql
CREATE TABLE public.videos (
  id SERIAL NOT NULL,
  website_id INTEGER NOT NULL,
  title CHARACTER VARYING(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NULL,
  video_type CHARACTER VARYING(20) NULL DEFAULT 'youtube'::CHARACTER VARYING,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  is_active BOOLEAN NULL DEFAULT TRUE,
  
  CONSTRAINT videos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_videos_website FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE,
  CONSTRAINT check_video_type CHECK (
    (video_type)::TEXT = ANY (
      (ARRAY['youtube'::CHARACTER VARYING, 'tiktok'::CHARACTER VARYING])::TEXT[]
    )
  )
);
```

### New Indexes
- `idx_videos_video_type` - For filtering by video type
- `idx_videos_website_active_type` - Composite index for common queries

## Code Changes

### 1. Core Video Library (`src/lib/videos.js`)
- ✅ Added `detectVideoType()` function
- ✅ Updated `getVideoThumbnail()` to support TikTok
- ✅ Updated `getVideoEmbedUrl()` to support TikTok
- ✅ Updated `getVideoPlatform()` with video_type parameter
- ✅ Enhanced `isValidVideoUrl()` with platform-specific validation
- ✅ Added `getVideosByType()` and `getVideoStats()` functions

### 2. Video Section Component (`src/lib/components/VideoSection.svelte`)
- ✅ Updated to use video_type from database
- ✅ Added platform-specific icons (YouTube/TikTok)
- ✅ Added colored badges for different platforms
- ✅ Updated modal to handle TikTok's vertical aspect ratio
- ✅ Enhanced error handling with platform-specific placeholders

### 3. API Endpoints
**`src/routes/api/videos/+server.js`:**
- ✅ Added video_type support in POST endpoint
- ✅ Added auto-detection of video type from URL
- ✅ Added validation for video_type values
- ✅ Updated PUT endpoint to handle video_type

**`src/routes/api/videos/[id]/+server.js`:**
- ✅ Updated PUT endpoint for individual video updates
- ✅ Added video_type support with validation

### 4. Admin Video Form (`src/routes/admin/videos/VideoForm.svelte`)
- ✅ Added video type selector (YouTube/TikTok)
- ✅ Added dynamic URL placeholder and validation messages
- ✅ Enhanced video preview with platform-specific rendering
- ✅ Added auto-detection of video type when URL changes
- ✅ Updated form validation with platform-specific rules

### 5. Performance Utilities (`src/lib/videoPerformance.js`)
- ✅ Updated thumbnail optimization for TikTok
- ✅ Added TikTok embed URL optimization
- ✅ Enhanced device-based optimization for both platforms

## Supported Video Formats

### YouTube
- **URLs Supported:**
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`

- **Features:**
  - Automatic thumbnail generation
  - Optimized embed URLs
  - Performance optimization

### TikTok
- **URLs Supported:**
  - `https://www.tiktok.com/@username/video/VIDEO_ID`
  - `https://vm.tiktok.com/SHORT_ID`
  - `https://www.tiktok.com/v/VIDEO_ID`

- **Features:**
  - Vertical video player (9:16 aspect ratio)
  - Placeholder thumbnails (TikTok doesn't provide direct thumbnail access)
  - Optimized embed URLs

## Usage Examples

### Adding a YouTube Video
```javascript
const youtubeVideo = {
  website_id: 1,
  title: "Cooking Tutorial",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  description: "Learn how to cook amazing dishes",
  video_type: "youtube", // Optional, will be auto-detected
  is_active: true
};
```

### Adding a TikTok Video
```javascript
const tiktokVideo = {
  website_id: 1,
  title: "Quick Recipe",
  url: "https://www.tiktok.com/@chef/video/1234567890",
  description: "30-second cooking hack",
  video_type: "tiktok", // Optional, will be auto-detected
  is_active: true
};
```

### API Usage
```javascript
// Create video (auto-detects type)
const response = await fetch('/api/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(videoData)
});

// Get videos by type
const youtubeVideos = await getVideosByType(websiteId, 'youtube');
const tiktokVideos = await getVideosByType(websiteId, 'tiktok');

// Get video statistics
const stats = await getVideoStats(websiteId);
// Returns: { total: 10, youtube: 7, tiktok: 3 }
```

## UI/UX Improvements

### Platform Badges
- YouTube videos display red badges
- TikTok videos display black badges
- Badges include platform icons

### Video Player
- YouTube: Standard 16:9 aspect ratio
- TikTok: Vertical 9:16 aspect ratio with max height
- Both support fullscreen and standard video controls

### Admin Interface
- Video type selector with clear platform options
- Dynamic URL validation based on selected platform
- Platform-specific placeholder text and help messages
- Real-time video preview with correct aspect ratios

## Migration Guide

### For Existing Projects
1. Run the database migration script: `database/videos_table_update.sql`
2. Existing YouTube videos will automatically be marked as `video_type: 'youtube'`
3. Update any custom video handling code to use the new functions

### Database Migration
```sql
-- Add video_type column to existing table
ALTER TABLE public.videos 
ADD COLUMN video_type CHARACTER VARYING(20) DEFAULT 'youtube';

-- Update existing records
UPDATE public.videos 
SET video_type = CASE 
  WHEN url ILIKE '%tiktok.com%' THEN 'tiktok'
  ELSE 'youtube'
END;

-- Add constraints and indexes
ALTER TABLE public.videos 
ADD CONSTRAINT check_video_type CHECK (
  (video_type)::TEXT = ANY (
    (ARRAY['youtube'::CHARACTER VARYING, 'tiktok'::CHARACTER VARYING])::TEXT[]
  )
);

CREATE INDEX idx_videos_video_type ON public.videos (video_type);
```

## Testing

### Test Data
Sample test videos are included in the migration script:
- YouTube test video
- TikTok test video

### Test Cases
1. **URL Detection:**
   - Paste YouTube URL → should auto-select YouTube
   - Paste TikTok URL → should auto-select TikTok

2. **Validation:**
   - Invalid YouTube URL with YouTube selected → should show error
   - Invalid TikTok URL with TikTok selected → should show error

3. **Display:**
   - YouTube videos should show in 16:9 aspect ratio
   - TikTok videos should show in 9:16 aspect ratio
   - Platform badges should display correctly

4. **API:**
   - POST `/api/videos` with video_type
   - GET videos filtered by type
   - Update video with different URL/type

## Future Enhancements

### Potential Improvements
1. **TikTok Thumbnails:** Implement oEmbed API integration for real thumbnails
2. **Additional Platforms:** Add support for Instagram Reels, YouTube Shorts
3. **Video Analytics:** Track views per platform type
4. **Bulk Operations:** Admin tools for bulk video type updates
5. **Advanced Validation:** Check if video URLs are actually accessible

### Performance Optimizations
1. **Lazy Loading:** Implement intersection observer for video loading
2. **Thumbnail Caching:** Cache TikTok oEmbed responses
3. **CDN Integration:** Use CDN for placeholder images
4. **Progressive Loading:** Load low-quality thumbnails first

## Troubleshooting

### Common Issues

1. **TikTok Videos Not Embedding:**
   - Check if URL format is correct
   - Ensure the video is public
   - TikTok embed may be blocked by some ad blockers

2. **Video Type Not Auto-Detecting:**
   - Clear browser cache
   - Check if URL includes proper domain
   - Manually select the correct type

3. **Database Migration Fails:**
   - Check if you have proper database permissions
   - Ensure no foreign key constraints are violated
   - Run migrations step by step

### Support
For issues or questions about the video system update, check:
1. Database schema in `database/videos_table_update.sql`
2. API documentation in the endpoint files
3. Component usage examples in this document
