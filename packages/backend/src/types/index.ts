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

export interface Category {
  slug: string;
  name: string;
  icon: string;
  wallhavenTags: string[];
  wallhavenCategories: string;
  wallhavenPurity: string;
  description: string;
}

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
