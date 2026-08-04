import axios from "axios";
import toast from "react-hot-toast";
import type {
  WallpapersResponse,
  SearchResponse,
  Wallpaper,
} from "@/types";

// --- blurDataURL generation with in-memory cache (5-minute TTL) ---

const blurCache = new Map<string, { data: string; expires: number }>();
const BLUR_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getBlurDataURL(url: string): Promise<string | undefined> {
  const now = Date.now();
  const cached = blurCache.get(url);
  if (cached && cached.expires > now) {
    return cached.data;
  }

  try {
    const res = await fetch(`/api/blur?url=${encodeURIComponent(url)}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    if (data.blurDataURL) {
      blurCache.set(url, { data: data.blurDataURL, expires: now + BLUR_CACHE_TTL_MS });
    }
    return data.blurDataURL || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Generate blurDataURL for a list of wallpapers concurrently.
 * Failures are silently ignored — blurDataURL will be undefined for those.
 */
export async function enrichWallpapersWithBlur(
  wallpapers: Wallpaper[],
): Promise<Wallpaper[]> {
  const results = await Promise.allSettled(
    wallpapers.map(async (wp) => {
      const url = wp.thumbnail || wp.preview;
      const blurDataURL = await getBlurDataURL(url);
      return { ...wp, blurDataURL };
    }),
  );

  return results.map((r, i) =>
    r.status === "fulfilled" ? r.value : { ...wallpapers[i] },
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers["retry-after"] || "30", 10);
      const message = error.response.data?.error || "Rate limited. Please wait.";
      toast.error(`${message} Retry in ${retryAfter}s`, { duration: retryAfter * 1000 });
      error.retryAfter = retryAfter;
    }
    return Promise.reject(error);
  }
);

export async function fetchFeed(page: number = 1, ratios?: string, atleast?: string): Promise<WallpapersResponse> {
  const { data } = await api.get<WallpapersResponse>("/feed", {
    params: { page, limit: 30, ...(ratios ? { ratios } : {}), ...(atleast ? { atleast } : {}) },
  });
  data.wallpapers = await enrichWallpapersWithBlur(data.wallpapers);
  return data;
}

export async function fetchWallpapers(
  category: string,
  sort: string = "hot",
  page: number = 1,
  ratios?: string,
  atleast?: string
): Promise<WallpapersResponse> {
  const { data } = await api.get<WallpapersResponse>("/wallpapers", {
    params: { category, sort, page, limit: 30, ...(ratios ? { ratios } : {}), ...(atleast ? { atleast } : {}) },
  });
  data.wallpapers = await enrichWallpapersWithBlur(data.wallpapers);
  return data;
}

export async function fetchWallpaper(id: string): Promise<Wallpaper> {
  const { data } = await api.get<Wallpaper>(`/wallpaper/${id}`);
  return data;
}

export async function fetchSimilarWallpapers(
  id: string,
  page: number = 1,
  limit: number = 24,
  ratios?: string,
  atleast?: string
): Promise<WallpapersResponse> {
  const { data } = await api.get<WallpapersResponse>(`/wallpaper/${id}/similar`, {
    params: { page, limit, ...(ratios ? { ratios } : {}), ...(atleast ? { atleast } : {}) },
  });
  data.wallpapers = await enrichWallpapersWithBlur(data.wallpapers);
  return data;
}

export async function fetchWallpapersBatch(ids: string[]): Promise<{ wallpapers: Wallpaper[] }> {
  const { data } = await api.get<{ wallpapers: Wallpaper[] }>("/wallpapers/batch", {
    params: { ids: ids.join(",") },
  });
  data.wallpapers = await enrichWallpapersWithBlur(data.wallpapers);
  return data;
}

export async function searchWallpapers(
  query: string,
  sort: string = "relevance",
  page: number = 1,
  limit: number = 20,
  ratios?: string,
  atleast?: string
): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>("/search", {
    params: { q: query, sort, page, limit, ...(ratios ? { ratios } : {}), ...(atleast ? { atleast } : {}) },
  });
  data.wallpapers = await enrichWallpapersWithBlur(data.wallpapers);
  return data;
}

export async function fetchTrendingSearches(): Promise<string[]> {
  const { data } = await api.get<{ trending: string[] }>("/search/trending");
  return data.trending;
}


