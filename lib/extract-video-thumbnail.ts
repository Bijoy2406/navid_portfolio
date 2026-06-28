export function extractVideoThumbnail(url: string): string | null {
  if (!url) return null;

  // YouTube URL patterns
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  // Facebook Reel/Video URL pattern - extract video ID from reel URLs
  const facebookReelRegex = /facebook\.com\/reel\/(\d+)/;
  const facebookReelMatch = url.match(facebookReelRegex);
  if (facebookReelMatch) {
    const videoId = facebookReelMatch[1];
    // Use a reliable Facebook thumbnail service
    return `https://graph.instagram.com/${videoId}/picture?type=large`;
  }

  // Fallback for other Facebook video formats
  const facebookVideoRegex = /facebook\.com\/.*[?&]v=(\d+)/;
  const facebookVideoMatch = url.match(facebookVideoRegex);
  if (facebookVideoMatch) {
    const videoId = facebookVideoMatch[1];
    return `https://graph.facebook.com/${videoId}/picture?type=large`;
  }

  return null;
}

export function extractVideoTitle(url: string): string | null {
  if (!url) return null;

  // YouTube - fetch metadata from noembed API
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    // Return a promise that fetches the title, but we'll need to handle async in component
    return `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${videoId}&format=json`;
  }

  // Facebook - we can't easily extract title without API access
  if (url.includes('facebook.com')) {
    return null;
  }

  return null;
}
