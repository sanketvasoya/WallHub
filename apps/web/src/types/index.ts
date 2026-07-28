import type { Wallpaper as BaseWallpaper, Category as BaseCategory } from "@wallhub/types";

export type { WallpapersResponse, SearchResponse, CategoriesResponse, CollectionsResponse, Collection, DownloadHistoryEntry, ApiError } from "@wallhub/types";

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
