// Video Cache Management
const CACHE_KEY = 'video_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class VideoCache {
  constructor() {
    this.cache = this.loadCache();
  }

  loadCache() {
    if (typeof window === 'undefined') return new Map();
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        
        // Filter out expired entries
        const validEntries = Object.entries(parsed).filter(([_, data]) => {
          return now - data.timestamp < CACHE_DURATION;
        });
        
        return new Map(validEntries);
      }
    } catch (error) {
      console.warn('Failed to load video cache:', error);
    }
    
    return new Map();
  }

  saveCache() {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save video cache:', error);
    }
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      this.saveCache();
      return null;
    }
    
    return entry.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.saveCache();
  }

  clear() {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  has(key) {
    return this.cache.has(key);
  }

  size() {
    return this.cache.size;
  }
}

// Global cache instance
export const videoCache = new VideoCache();

// Cache utility functions
export function getCachedVideos(websiteId) {
  const key = `videos_${websiteId}`;
  return videoCache.get(key);
}

export function setCachedVideos(websiteId, videos) {
  const key = `videos_${websiteId}`;
  videoCache.set(key, videos);
}

export function getCachedVideo(id) {
  const key = `video_${id}`;
  return videoCache.get(key);
}

export function setCachedVideo(id, video) {
  const key = `video_${id}`;
  videoCache.set(key, video);
}

export function invalidateVideoCache(websiteId = null) {
  if (websiteId) {
    // Invalidate specific website cache
    const key = `videos_${websiteId}`;
    videoCache.cache.delete(key);
    videoCache.saveCache();
  } else {
    // Clear all cache
    videoCache.clear();
  }
}

// Thumbnail cache
export function getCachedThumbnail(url) {
  const key = `thumbnail_${btoa(url)}`;
  return videoCache.get(key);
}

export function setCachedThumbnail(url, thumbnailUrl) {
  const key = `thumbnail_${btoa(url)}`;
  videoCache.set(key, thumbnailUrl);
}

// Preload thumbnails
export async function preloadThumbnails(videos) {
  const promises = videos.map(async (video) => {
    try {
      const cached = getCachedThumbnail(video.url);
      if (cached) return cached;
      
      // For YouTube videos, we can preload thumbnails
      if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = video.url.match(youtubeRegex);
        
        if (match) {
          const thumbnailUrl = `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
          
          // Preload image
          const img = new Image();
          img.src = thumbnailUrl;
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              setCachedThumbnail(video.url, thumbnailUrl);
              resolve(thumbnailUrl);
            };
            img.onerror = reject;
          });
          
          return thumbnailUrl;
        }
      }
    } catch (error) {
      console.warn('Failed to preload thumbnail for video:', video.url, error);
    }
  });
  
  return Promise.allSettled(promises);
}
