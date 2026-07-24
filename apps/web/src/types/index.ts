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
  subreddits: string[];
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

export type ThemeMode = "light" | "dark" | "system";
export type SortOption = "hot" | "new" | "top";
