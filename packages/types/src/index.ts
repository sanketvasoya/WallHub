export interface Wallpaper {
  id: string;
  title: string;
  image: string;
  preview: string;
  thumbnail: string;
  width: number;
  height: number;
  aspectRatio: string;
  filesize: string;
  upvotes: number;
  author: string;
  subreddit: string;
  createdAt: string;
  originalUrl: string;
  orientation: "landscape" | "portrait" | "square";
  nsfw: boolean;
  tags: string[];
  colors: string[];
  source: string;
  views: number;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  wallhavenTags: string[];
  wallhavenCategories: string;
  wallhavenPurity: string;
  description: string;
}

export interface WallpapersResponse {
  wallpapers: Wallpaper[];
  page: number;
  totalResults: number;
  lastPage: number;
}

export interface SearchResponse {
  wallpapers: Wallpaper[];
  query: string;
  totalResults: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  icon: string;
  query: string;
  categories: string;
  sorting: string;
}

export interface CollectionsResponse {
  collections: Collection[];
}

export interface DownloadHistoryEntry {
  id: string;
  wallpaperId: string;
  title: string;
  thumbnail: string;
  downloadedAt: string;
  filesize: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface AnalyticsPageView {
  path: string;
  referrer?: string;
  timestamp: string;
}
