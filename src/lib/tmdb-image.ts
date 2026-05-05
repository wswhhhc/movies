export enum ImageSize {
  POSTER_SMALL = "w185",
  POSTER_MEDIUM = "w342",
  POSTER_LARGE = "w500",
  BACKDROP = "w1280",
  PROFILE = "w185",
}

/**
 * 生成 TMDB 图片 URL（通过本地代理，绕过网络限制）
 */
export function tmdbImage(
  path: string | null,
  size: ImageSize = ImageSize.POSTER_MEDIUM
): string | null {
  if (!path) return null;
  return `/api/tmdb-image?path=${encodeURIComponent(path)}&size=${size}`;
}
