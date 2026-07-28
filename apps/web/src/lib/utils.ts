import type { Wallpaper } from "@/types";

export function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(diffSeconds) || diffSeconds < 0) return dateStr;

    if (diffSeconds < 60) return "just now";
    if (diffSeconds < 3600) {
      const mins = Math.floor(diffSeconds / 60);
      return `${mins}m ago`;
    }
    if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours}h ago`;
    }
    if (diffSeconds < 2592000) {
      const days = Math.floor(diffSeconds / 86400);
      return `${days}d ago`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function getResolutionBadge(width: number, height: number): string {
  const maxDim = Math.max(width, height);
  if (maxDim >= 7680 || (width >= 7680 && height >= 4320)) return "8K";
  if (maxDim >= 3840 || (width >= 3840 && height >= 2160)) return "4K";
  if (maxDim >= 2560 || (width >= 2560 && height >= 1440)) return "2K";
  if (maxDim >= 1920 || (width >= 1920 && height >= 1080)) return "1080p";
  return "HD";
}

export function deduplicateWallpapers<T extends { id: string }>(wallpapers: T[]): T[] {
  const seen = new Set<string>();
  return wallpapers.filter((w) => {
    if (seen.has(w.id)) return false;
    seen.add(w.id);
    return true;
  });
}

export function formatFilesize(bytes?: number): string {
  if (!bytes) return "N/A";
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${bytes}B`;
}
