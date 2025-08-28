// Video SEO Management
export function generateVideoSchema(videos) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Video Collection",
    "description": "Collection of videos about food and culinary",
    "numberOfItems": videos.length,
    "itemListElement": videos.map((video, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": video.title,
        "description": video.description || "",
        "thumbnailUrl": getVideoThumbnail(video.url),
        "uploadDate": video.created_at,
        "dateModified": video.updated_at,
        "contentUrl": video.url,
        "embedUrl": getVideoEmbedUrl(video.url),
        "publisher": {
          "@type": "Organization",
          "name": "Food Review"
        }
      }
    }))
  };

  return schema;
}

export function generateVideoMetaTags(videos, pageTitle = "Videos", pageDescription = "Watch interesting videos about food and culinary") {
  const metaTags = [
    {
      property: "og:title",
      content: pageTitle
    },
    {
      property: "og:description", 
      content: pageDescription
    },
    {
      property: "og:type",
      content: "video.other"
    },
    {
      property: "og:image",
      content: videos.length > 0 ? getVideoThumbnail(videos[0].url) : "/default-video-thumbnail.jpg"
    },
    {
      name: "twitter:card",
      content: "player"
    },
    {
      name: "twitter:title",
      content: pageTitle
    },
    {
      name: "twitter:description",
      content: pageDescription
    },
    {
      name: "twitter:image",
      content: videos.length > 0 ? getVideoThumbnail(videos[0].url) : "/default-video-thumbnail.jpg"
    }
  ];

  // Add video-specific meta tags
  if (videos.length > 0) {
    const firstVideo = videos[0];
    metaTags.push(
      {
        property: "og:video",
        content: firstVideo.url
      },
      {
        property: "og:video:type",
        content: "text/html"
      },
      {
        property: "og:video:width",
        content: "1280"
      },
      {
        property: "og:video:height", 
        content: "720"
      }
    );
  }

  return metaTags;
}

export function generateVideoSitemap(videos, baseUrl) {
  const sitemap = {
    urlset: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "@xmlns:video": "http://www.google.com/schemas/sitemap-video/1.1",
      url: videos.map(video => ({
        loc: `${baseUrl}/videos/${video.id}`,
        lastmod: video.updated_at,
        changefreq: "weekly",
        priority: "0.8",
        "video:video": {
          "video:thumbnail_loc": getVideoThumbnail(video.url),
          "video:title": video.title,
          "video:description": video.description || "",
          "video:content_loc": video.url,
          "video:duration": "600", // Default 10 minutes
          "video:publication_date": video.created_at,
          "video:family_friendly": "yes"
        }
      }))
    }
  };

  return sitemap;
}

// Helper functions (reuse from videos.js)
function getVideoThumbnail(url) {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  }
  
  return '/placeholder-video.jpg';
}

function getVideoEmbedUrl(url) {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  return url;
}

// Structured data for individual video
export function generateVideoStructuredData(video) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || "",
    "thumbnailUrl": getVideoThumbnail(video.url),
    "uploadDate": video.created_at,
    "dateModified": video.updated_at,
    "contentUrl": video.url,
    "embedUrl": getVideoEmbedUrl(video.url),
    "publisher": {
      "@type": "Organization",
      "name": "Food Review",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "potentialAction": {
      "@type": "WatchAction",
      "target": video.url
    }
  };

  return schema;
}

// Generate video feed for RSS
export function generateVideoRSSFeed(videos, baseUrl, title = "Video Feed", description = "Latest videos about food and culinary") {
  const rss = {
    rss: {
      "@version": "2.0",
      "@xmlns:media": "http://search.yahoo.com/mrss/",
      channel: {
        title: title,
        description: description,
        link: `${baseUrl}/videos`,
        lastBuildDate: new Date().toISOString(),
        item: videos.map(video => ({
          title: video.title,
          description: video.description || "",
          link: `${baseUrl}/videos/${video.id}`,
          pubDate: video.created_at,
          guid: video.id,
          "media:content": {
            "@url": getVideoThumbnail(video.url),
            "@type": "image/jpeg",
            "@width": "320",
            "@height": "180"
          },
          "media:player": {
            "@url": video.url
          }
        }))
      }
    }
  };

  return rss;
}
