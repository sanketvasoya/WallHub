import type { WallhavenImage, WallhavenSearchResponse, Wallpaper } from "../types/index.js";
import { getEnv } from "../config/env.js";

const BASE_URL = "https://wallhaven.cc/api/v1";
const ALWAYS_PURITY = "100";

export async function searchWallhaven(
  query: string,
  categories: string = "111",
  sorting: string = "relevance",
  page: number = 1,
  topRange?: string
): Promise<WallhavenSearchResponse> {
  const env = getEnv();
  const url = new URL(`${BASE_URL}/search`);

  if (query) url.searchParams.set("q", query);
  url.searchParams.set("categories", categories);
  url.searchParams.set("purity", ALWAYS_PURITY);
  url.searchParams.set("sorting", sorting);
  url.searchParams.set("page", String(page));
  url.searchParams.set("atleast", "1920x1080");

  if (sorting === "toplist" && topRange) {
    url.searchParams.set("topRange", topRange);
  }

  if (env.WALLHAVEN_API_KEY) {
    url.searchParams.set("apikey", env.WALLHAVEN_API_KEY);
  }

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "WallHub/1.0" },
  });

  if (!response.ok) {
    const error = new Error(`Wallhaven API error: ${response.status}`) as Error & { statusCode: number; retryAfter?: string };
    error.statusCode = response.status;
    if (response.status === 429) {
      error.retryAfter = response.headers.get("retry-after") || undefined;
    }
    throw error;
  }

  return (await response.json()) as WallhavenSearchResponse;
}

export async function getWallhavenWallpaper(id: string): Promise<WallhavenImage> {
  const env = getEnv();
  const url = new URL(`${BASE_URL}/w/${id}`);

  if (env.WALLHAVEN_API_KEY) {
    url.searchParams.set("apikey", env.WALLHAVEN_API_KEY);
  }

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "WallHub/1.0" },
  });

  if (!response.ok) {
    const error = new Error(`Wallhaven API error: ${response.status}`) as Error & { statusCode: number; retryAfter?: string };
    error.statusCode = response.status;
    if (response.status === 429) {
      error.retryAfter = response.headers.get("retry-after") || undefined;
    }
    throw error;
  }

  const data = (await response.json()) as { data: WallhavenImage };
  return data.data;
}

function calculateAspectRatio(w: number, h: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h);
  const rw = w / d;
  const rh = h / d;
  if (rw > 100 || rh > 100) {
    const ratio = (w / h).toFixed(1);
    return `${ratio}:1`;
  }
  return `${rw}:${rh}`;
}

function getOrientation(w: number, h: number): "landscape" | "portrait" | "square" {
  if (w > h) return "landscape";
  if (h > w) return "portrait";
  return "square";
}

function formatFilesize(bytes: number | undefined): string {
  if (!bytes) return "N/A";
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${bytes}B`;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    general: "General",
    anime: "Anime",
    people: "People",
  };
  return labels[category] || category;
}

export function transformWallhavenImage(img: WallhavenImage): Wallpaper {
  const tags = img.tags ? img.tags.map((t) => t.name) : [];

  return {
    id: img.id,
    title: `${img.resolution} ${getCategoryLabel(img.category)}`,
    image: img.path,
    preview: img.thumbs.large || img.thumbs.normal,
    thumbnail: img.thumbs.small,
    width: img.dimension_x,
    height: img.dimension_y,
    aspectRatio: calculateAspectRatio(img.dimension_x, img.dimension_y),
    filesize: formatFilesize(img.filesize_bytes || img.file_size),
    upvotes: img.favorites,
    author: img.uploader?.username || "wallhaven",
    subreddit: getCategoryLabel(img.category),
    createdAt: img.created_at,
    originalUrl: img.url,
    orientation: getOrientation(img.dimension_x, img.dimension_y),
    nsfw: img.purity !== "sfw",
    tags,
    colors: img.colors || [],
    source: "Wallhaven",
    views: img.views || 0,
  };
}
