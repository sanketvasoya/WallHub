import type { Wallpaper as BaseWallpaper } from "@wallection/types";

export type { WallpapersResponse, SearchResponse, DownloadHistoryEntry } from "@wallection/types";

export type Wallpaper = BaseWallpaper;

export interface Category {
  slug: string;
  name: string;
  icon: string;
  subreddits: string[];
  description: string;
}

export type ThemeMode = "light" | "dark" | "system";
export type SortOption = "hot" | "new" | "top" | "relevance";
export type OrientationPreference = "phone" | "desktop" | "all";
