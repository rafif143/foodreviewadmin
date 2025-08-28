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

// Utility functions for video URLs
export function getVideoThumbnail(url) {
  // Extract video ID from YouTube URL
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  }
  
  // For other video platforms, return a placeholder
  return '/placeholder-video.jpg';
}

export function getVideoEmbedUrl(url) {
  // Extract video ID from YouTube URL
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  // For other platforms, return the original URL
  return url;
}

export function getVideoPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'YouTube';
  } else if (url.includes('vimeo.com')) {
    return 'Vimeo';
  } else {
    return 'Video';
  }
}

export function isValidVideoUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
