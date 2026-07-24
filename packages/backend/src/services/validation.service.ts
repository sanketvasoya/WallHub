import type { Wallpaper } from "../types/index";
import { BLOCKED_KEYWORDS, ALLOWED_CATEGORIES } from "../config/blockedKeywords";
import { logRejection } from "../utils/logger";

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export function validateWallpaper(wallpaper: Wallpaper): ValidationResult {
  const titleLower = wallpaper.title.toLowerCase();
  const tagsLower = wallpaper.tags.map((t) => t.toLowerCase()).join(" ");
  const combinedLower = `${tagsLower} ${wallpaper.subreddit.toLowerCase()}`;

  for (const keyword of BLOCKED_KEYWORDS) {
    if (titleLower.includes(keyword.toLowerCase())) {
      logRejection({
        wallpaperId: wallpaper.id,
        title: wallpaper.title,
        tags: wallpaper.tags,
        reason: `Title contains blocked keyword: "${keyword}"`,
        timestamp: new Date().toISOString(),
      });
      return {
        isValid: false,
        reason: `Title contains blocked keyword: "${keyword}"`,
      };
    }
  }

  for (const keyword of BLOCKED_KEYWORDS) {
    if (combinedLower.includes(keyword.toLowerCase())) {
      logRejection({
        wallpaperId: wallpaper.id,
        title: wallpaper.title,
        tags: wallpaper.tags,
        reason: `Tags/subreddit contain blocked keyword: "${keyword}"`,
        timestamp: new Date().toISOString(),
      });
      return {
        isValid: false,
        reason: `Tags/subreddit contain blocked keyword: "${keyword}"`,
      };
    }
  }

  const category = wallpaper.subreddit.toLowerCase();
  if (!ALLOWED_CATEGORIES.includes(category) && category !== "general") {
    logRejection({
      wallpaperId: wallpaper.id,
      title: wallpaper.title,
      tags: [wallpaper.subreddit],
      reason: `Category "${wallpaper.subreddit}" is not in allowed list`,
      timestamp: new Date().toISOString(),
    });
    return {
      isValid: false,
      reason: `Category "${wallpaper.subreddit}" is not in allowed list`,
    };
  }

  return { isValid: true };
}

export function validateWallpapers(wallpapers: Wallpaper[]): Wallpaper[] {
  return wallpapers.filter((w) => validateWallpaper(w).isValid);
}
