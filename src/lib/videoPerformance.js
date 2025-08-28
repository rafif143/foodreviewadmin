// Video Performance Optimization
export class VideoPerformanceOptimizer {
  constructor() {
    this.intersectionObserver = null;
    this.resizeObserver = null;
    this.performanceMetrics = new Map();
  }

  // Lazy load videos using Intersection Observer
  initializeLazyLoading() {
    if (typeof window === 'undefined') return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoElement = entry.target;
            this.loadVideo(videoElement);
            this.intersectionObserver.unobserve(videoElement);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }

  // Observe video element for lazy loading
  observeVideo(videoElement) {
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(videoElement);
    }
  }

  // Load video when it comes into view
  loadVideo(videoElement) {
    const videoUrl = videoElement.dataset.videoUrl;
    if (videoUrl) {
      videoElement.src = videoUrl;
      videoElement.load();
    }
  }

  // Optimize thumbnail loading
  optimizeThumbnailLoading(thumbnailElement, videoUrl) {
    if (typeof window === 'undefined') return;

    // Use low quality thumbnail first, then load high quality
    const lowQualityUrl = this.getLowQualityThumbnail(videoUrl);
    const highQualityUrl = this.getHighQualityThumbnail(videoUrl);

    thumbnailElement.src = lowQualityUrl;

    // Load high quality thumbnail in background
    const highQualityImg = new Image();
    highQualityImg.onload = () => {
      thumbnailElement.src = highQualityUrl;
    };
    highQualityImg.src = highQualityUrl;
  }

  // Get low quality thumbnail for faster loading
  getLowQualityThumbnail(url) {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/sddefault.jpg`;
    }
    
    return '/placeholder-video-low.jpg';
  }

  // Get high quality thumbnail
  getHighQualityThumbnail(url) {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    
    return '/placeholder-video.jpg';
  }

  // Preload critical videos
  preloadCriticalVideos(videos, count = 3) {
    const criticalVideos = videos.slice(0, count);
    
    criticalVideos.forEach(video => {
      this.preloadVideo(video);
    });
  }

  // Preload video resources
  preloadVideo(video) {
    if (typeof window === 'undefined') return;

    // Preload thumbnail
    const thumbnailUrl = this.getHighQualityThumbnail(video.url);
    const thumbnailLink = document.createElement('link');
    thumbnailLink.rel = 'preload';
    thumbnailLink.as = 'image';
    thumbnailLink.href = thumbnailUrl;
    document.head.appendChild(thumbnailLink);

    // Preload video metadata
    const videoLink = document.createElement('link');
    videoLink.rel = 'preload';
    videoLink.as = 'fetch';
    videoLink.href = `/api/videos/${video.id}`;
    document.head.appendChild(videoLink);
  }

  // Optimize video grid layout
  optimizeGridLayout(containerElement, itemCount) {
    if (typeof window === 'undefined') return;

    // Calculate optimal grid columns based on screen size and item count
    const screenWidth = window.innerWidth;
    let optimalColumns = 3;

    if (screenWidth < 768) {
      optimalColumns = 1;
    } else if (screenWidth < 1024) {
      optimalColumns = 2;
    } else if (screenWidth < 1440) {
      optimalColumns = 3;
    } else {
      optimalColumns = 4;
    }

    // Adjust for item count
    if (itemCount < optimalColumns) {
      optimalColumns = itemCount;
    }

    containerElement.style.setProperty('--grid-columns', optimalColumns);
  }

  // Monitor video performance metrics
  trackVideoPerformance(videoId, metric, value) {
    this.performanceMetrics.set(`${videoId}_${metric}`, {
      value,
      timestamp: Date.now()
    });

    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'video_performance', {
        video_id: videoId,
        metric: metric,
        value: value
      });
    }
  }

  // Get performance metrics
  getPerformanceMetrics(videoId) {
    const metrics = {};
    this.performanceMetrics.forEach((data, key) => {
      if (key.startsWith(`${videoId}_`)) {
        const metric = key.replace(`${videoId}_`, '');
        metrics[metric] = data;
      }
    });
    return metrics;
  }

  // Optimize video player initialization
  optimizeVideoPlayer(videoElement, videoData) {
    // Set optimal attributes for performance
    videoElement.setAttribute('preload', 'metadata');
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('muted', 'true'); // Required for autoplay on mobile

    // Use appropriate video format based on browser support
    this.setOptimalVideoFormat(videoElement, videoData);
  }

  // Set optimal video format
  setOptimalVideoFormat(videoElement, videoData) {
    // For YouTube videos, use iframe with optimized parameters
    if (videoData.url.includes('youtube.com') || videoData.url.includes('youtu.be')) {
      const embedUrl = this.getOptimizedYouTubeEmbedUrl(videoData.url);
      videoElement.src = embedUrl;
    }
  }

  // Get optimized YouTube embed URL
  getOptimizedYouTubeEmbedUrl(url) {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=0`;
    }
    
    return url;
  }

  // Cleanup resources
  cleanup() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

// Global performance optimizer instance
export const videoPerformanceOptimizer = new VideoPerformanceOptimizer();

// Utility functions for performance optimization
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimize video loading based on network conditions
export function optimizeForNetwork(videos) {
  if (typeof navigator !== 'undefined' && navigator.connection) {
    const connection = navigator.connection;
    
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      // Load fewer videos for slow connections
      return videos.slice(0, 3);
    } else if (connection.effectiveType === '3g') {
      // Load moderate number of videos
      return videos.slice(0, 6);
    }
  }
  
  return videos;
}

// Optimize video quality based on device capabilities
export function optimizeForDevice(videoUrl) {
  if (typeof window === 'undefined') return videoUrl;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;

  if (isMobile || isLowEndDevice) {
    // Use lower quality thumbnails for mobile/low-end devices
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoUrl.match(youtubeRegex);
    
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/sddefault.jpg`;
    }
  }

  return videoUrl;
}
