// Video Analytics Functions
export function trackVideoView(videoId, videoTitle) {
  // Track video view for analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_view', {
      video_id: videoId,
      video_title: videoTitle,
      event_category: 'video',
      event_label: videoTitle
    });
  }
  
  // Track with custom analytics
  if (typeof window !== 'undefined') {
    const analytics = window.analytics || {};
    if (analytics.track) {
      analytics.track('Video Viewed', {
        videoId,
        videoTitle,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export function trackVideoPlay(videoId, videoTitle, platform) {
  // Track video play event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_play', {
      video_id: videoId,
      video_title: videoTitle,
      video_platform: platform,
      event_category: 'video',
      event_label: videoTitle
    });
  }
}

export function trackVideoComplete(videoId, videoTitle, duration) {
  // Track video completion
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_complete', {
      video_id: videoId,
      video_title: videoTitle,
      video_duration: duration,
      event_category: 'video',
      event_label: videoTitle
    });
  }
}

export function trackVideoError(videoId, videoTitle, error) {
  // Track video errors
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_error', {
      video_id: videoId,
      video_title: videoTitle,
      error_message: error,
      event_category: 'video',
      event_label: videoTitle
    });
  }
}

// Video Performance Tracking
export function trackVideoLoadTime(videoId, loadTime) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_load_time', {
      video_id: videoId,
      load_time: loadTime,
      event_category: 'performance'
    });
  }
}

// Video Engagement Tracking
export function trackVideoEngagement(videoId, action, value = null) {
  const engagementData = {
    video_id: videoId,
    action: action,
    event_category: 'engagement'
  };
  
  if (value !== null) {
    engagementData.value = value;
  }
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_engagement', engagementData);
  }
}

// Video Search Tracking
export function trackVideoSearch(query, results) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_search', {
      search_term: query,
      results_count: results,
      event_category: 'search'
    });
  }
}

// Video Filter Tracking
export function trackVideoFilter(filterType, filterValue) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_filter', {
      filter_type: filterType,
      filter_value: filterValue,
      event_category: 'filter'
    });
  }
}
