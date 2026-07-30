import axios from "axios";
import toast from "react-hot-toast";
import type {
  WallpapersResponse,
  SearchResponse,
  Wallpaper,
} from "@/types";

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
  return data;
}

export async function fetchWallpapersBatch(ids: string[]): Promise<{ wallpapers: Wallpaper[] }> {
  const { data } = await api.get<{ wallpapers: Wallpaper[] }>("/wallpapers/batch", {
    params: { ids: ids.join(",") },
  });
  return data;
}

export async function searchWallpapers(
  query: string,
  sort: string = "relevance",
  ratios?: string,
  atleast?: string
): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>("/search", {
    params: { q: query, sort, limit: 50, ...(ratios ? { ratios } : {}), ...(atleast ? { atleast } : {}) },
  });
  return data;
}


