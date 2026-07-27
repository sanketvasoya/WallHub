import type { Wallpaper, Category } from "@wallhub/types";

export type { Wallpaper, Category };

export interface WallhavenImage {
  id: string;
  url: string;
  path: string;
  thumbs: {
    small: string;
    normal: string;
    large: string;
  };
  resolution: string;
  file_type: string;
  filesize: number;
  filesize_bytes: number;
  file_size: number;
  colors: string[];
  created_at: string;
  uploader: {
    username: string;
    avatar: {
      "200px": string;
      "128px": string;
      "32px": string;
      "20px": string;
    };
  } | null;
  views: number;
  favorites: number;
  category: string;
  purity: string;
  type: string;
  dimension_x: number;
  dimension_y: number;
  tags?: {
    id: number;
    name: string;
    alias: string;
  }[];
}

export interface WallhavenSearchResponse {
  data: WallhavenImage[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    query: string | null;
  };
}
