// Video Accessibility Management
export function generateVideoAccessibilityProps(video, index = 0) {
  return {
    'aria-label': `Video ${index + 1}: ${video.title}`,
    'aria-describedby': `video-description-${video.id}`,
    'role': 'button',
    'tabindex': '0',
    'data-video-id': video.id,
    'data-video-title': video.title
  };
}

export function generateVideoModalAccessibilityProps() {
  return {
    'aria-modal': 'true',
    'aria-labelledby': 'video-modal-title',
    'aria-describedby': 'video-modal-description',
    'role': 'dialog'
  };
}

export function generateVideoPlayerAccessibilityProps(video) {
  return {
    'title': video.title,
    'aria-label': `Video player for ${video.title}`,
    'allowfullscreen': 'true',
    'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  };
}

export function generateVideoThumbnailAccessibilityProps(video) {
  return {
    'alt': `Thumbnail for video: ${video.title}`,
    'aria-hidden': 'true',
    'loading': 'lazy'
  };
}

export function generateVideoPlayButtonAccessibilityProps(video) {
  return {
    'aria-label': `Play video: ${video.title}`,
    'aria-describedby': `video-description-${video.id}`,
    'role': 'button',
    'tabindex': '0'
  };
}

// Keyboard navigation support
export function handleVideoKeyboardNavigation(event, videos, currentIndex, onVideoSelect) {
  const { key } = event;
  
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % videos.length;
      onVideoSelect(videos[nextIndex], nextIndex);
      break;
      
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
      onVideoSelect(videos[prevIndex], prevIndex);
      break;
      
    case 'Enter':
    case ' ':
      event.preventDefault();
      onVideoSelect(videos[currentIndex], currentIndex);
      break;
      
    case 'Escape':
      event.preventDefault();
      // Close modal or return focus
      break;
  }
}

// Screen reader announcements
export function announceVideoChange(video, action = 'selected') {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `Video ${action}: ${video.title}`;
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

export function announceVideoCount(count) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `Found ${count} videos`;
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

// Focus management
export function focusVideoElement(videoId) {
  const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
  if (videoElement) {
    videoElement.focus();
  }
}

export function focusFirstVideo() {
  const firstVideo = document.querySelector('[data-video-id]');
  if (firstVideo) {
    firstVideo.focus();
  }
}

export function focusLastVideo() {
  const videos = document.querySelectorAll('[data-video-id]');
  if (videos.length > 0) {
    videos[videos.length - 1].focus();
  }
}

// High contrast mode support
export function getHighContrastStyles() {
  return {
    '--video-border-color': 'var(--high-contrast-border, #000000)',
    '--video-text-color': 'var(--high-contrast-text, #000000)',
    '--video-background-color': 'var(--high-contrast-background, #ffffff)',
    '--video-focus-color': 'var(--high-contrast-focus, #0000ff)'
  };
}

// Reduced motion support
export function getReducedMotionStyles() {
  return {
    '--video-transition-duration': 'var(--reduced-motion-duration, 0s)',
    '--video-animation-duration': 'var(--reduced-motion-duration, 0s)'
  };
}

// Color blind friendly colors
export function getColorBlindFriendlyColors() {
  return {
    '--video-primary-color': '#0077bb', // Blue
    '--video-secondary-color': '#ee7733', // Orange
    '--video-success-color': '#009988', // Teal
    '--video-warning-color': '#cc3311', // Red
    '--video-error-color': '#ee3377' // Magenta
  };
}

// Generate ARIA live regions
export function generateAriaLiveRegion() {
  return {
    'aria-live': 'polite',
    'aria-atomic': 'true',
    'role': 'status'
  };
}

// Generate skip link for video section
export function generateSkipLink(targetId, label = 'Skip to video content') {
  return {
    href: `#${targetId}`,
    'aria-label': label,
    class: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded'
  };
}

// Generate video transcript support
export function generateVideoTranscriptProps(video) {
  return {
    'aria-describedby': video.transcript ? `transcript-${video.id}` : undefined,
    'data-has-transcript': !!video.transcript
  };
}

// Generate video captions support
export function generateVideoCaptionsProps(video) {
  return {
    'data-has-captions': !!video.captions,
    'aria-describedby': video.captions ? `captions-${video.id}` : undefined
  };
}

// Generate video language support
export function generateVideoLanguageProps(video) {
  return {
    'lang': video.language || 'id',
    'dir': video.language === 'ar' ? 'rtl' : 'ltr'
  };
}
