import { supabase } from './supabase';

export async function getVideos(websiteId) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('website_id', websiteId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export async function getVideoById(id) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
}

export async function createVideo(videoData) {
  try {
    // Auto-detect video type if not provided
    if (!videoData.video_type) {
      videoData.video_type = detectVideoType(videoData.url);
    }

    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
}

export async function updateVideo(id, videoData) {
  try {
    // Auto-detect video type if URL is updated but type is not provided
    if (videoData.url && !videoData.video_type) {
      videoData.video_type = detectVideoType(videoData.url);
    }

    const { data, error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
}

export async function deleteVideo(id) {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}

export async function toggleVideoStatus(id, isActive) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error toggling video status:', error);
    throw error;
  }
}

// Detect video type from URL
export function detectVideoType(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('tiktok.com')) {
    return 'tiktok';
  }
  return 'youtube'; // default fallback
}

// Utility functions for video URLs
export function getVideoThumbnail(url, videoType = null) {
  // Auto-detect type if not provided
  if (!videoType) {
    videoType = detectVideoType(url);
  }

  if (videoType === 'youtube') {
    // Extract video ID from YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
  } else if (videoType === 'tiktok') {
    // TikTok doesn't provide direct thumbnail access
    // We'll use a placeholder or extract from oEmbed API in the future
    return '/placeholder-tiktok.jpg';
  }
  
  // For other video platforms, return a placeholder
  return '/placeholder-video.jpg';
}

export function getVideoEmbedUrl(url, videoType = null) {
  // Auto-detect type if not provided
  if (!videoType) {
    videoType = detectVideoType(url);
  }

  if (videoType === 'youtube') {
    // Extract video ID from YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  } else if (videoType === 'tiktok') {
    // Extract TikTok video ID from URL
    const tiktokRegex = /(?:tiktok\.com\/@[^\/]+\/video\/(\d+)|tiktok\.com\/v\/(\d+)|vm\.tiktok\.com\/([A-Za-z0-9]+))/;
    const match = url.match(tiktokRegex);
    
    if (match) {
      const videoId = match[1] || match[2] || match[3];
      // TikTok embed format
      return `https://www.tiktok.com/embed/v2/${videoId}`;
    }
  }
  
  // For other platforms, return the original URL
  return url;
}

export function getVideoPlatform(url, videoType = null) {
  // Auto-detect type if not provided
  if (!videoType) {
    videoType = detectVideoType(url);
  }

  switch (videoType) {
    case 'youtube':
      return 'YouTube';
    case 'tiktok':
      return 'TikTok';
    default:
      // Fallback to URL-based detection
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'YouTube';
      } else if (url.includes('tiktok.com')) {
        return 'TikTok';
      } else if (url.includes('vimeo.com')) {
        return 'Vimeo';
      } else {
        return 'Video';
      }
  }
}

export function isValidVideoUrl(url, videoType = null) {
  try {
    new URL(url);
    
    // Auto-detect type if not provided
    if (!videoType) {
      videoType = detectVideoType(url);
    }

    // Platform-specific validation
    if (videoType === 'youtube') {
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      return youtubeRegex.test(url);
    } else if (videoType === 'tiktok') {
      const tiktokRegex = /(?:tiktok\.com\/@[^\/]+\/video\/\d+|tiktok\.com\/v\/\d+|vm\.tiktok\.com\/[A-Za-z0-9]+)/;
      return tiktokRegex.test(url);
    }
    
    return true;
  } catch {
    return false;
  }
}

// Get video filters by type
export async function getVideosByType(websiteId, videoType = null) {
  try {
    let query = supabase
      .from('videos')
      .select('*')
      .eq('website_id', websiteId)
      .eq('is_active', true);

    if (videoType) {
      query = query.eq('video_type', videoType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching videos by type:', error);
    throw error;
  }
}

// Get video statistics by type
export async function getVideoStats(websiteId) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('video_type')
      .eq('website_id', websiteId)
      .eq('is_active', true);

    if (error) throw error;

    const stats = {
      total: data.length,
      youtube: data.filter(v => v.video_type === 'youtube').length,
      tiktok: data.filter(v => v.video_type === 'tiktok').length
    };

    return stats;
  } catch (error) {
    console.error('Error fetching video stats:', error);
    throw error;
  }
}
