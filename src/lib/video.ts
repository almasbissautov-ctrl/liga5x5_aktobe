export type VideoKind = "youtube" | "vk" | "other";

export function detectVideoKind(url: string): VideoKind {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vk\.com|vkvideo\.ru/.test(url)) return "vk";
  return "other";
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}
