import axios from "axios";
import toast from "react-hot-toast";
import type {
  WallpapersResponse,
  SearchResponse,
  CategoriesResponse,
  Category,
  Wallpaper,
  CollectionsResponse,
  Collection,
} from "@/types";

export interface HomepageSection {
  id: string;
  name: string;
  wallpapers: Wallpaper[];
}

export interface HomepageResponse {
  hero: Wallpaper[];
  sections: HomepageSection[];
  generatedAt: string;
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

export async function fetchCategories(): Promise<CategoriesResponse> {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data;
}

export async function fetchCategory(slug: string): Promise<{ category: Category }> {
  const { data } = await api.get<{ category: Category }>(`/categories/${slug}`);
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

export async function fetchCollections(): Promise<CollectionsResponse> {
  const { data } = await api.get<CollectionsResponse>("/collections");
  return data;
}

export async function fetchCollection(
  slug: string,
  page: number = 1
): Promise<{ collection: Collection; wallpapers: Wallpaper[]; totalResults: number; page: number }> {
  const { data } = await api.get(`/collections/${slug}`, { params: { page } });
  return data;
}

export async function fetchHomepage(): Promise<HomepageResponse> {
  const { data } = await api.get<HomepageResponse>("/homepage");
  return data;
}

export async function trackPageView(path: string, referrer?: string): Promise<void> {
  try {
    await api.post("/analytics/page-view", { path, referrer });
  } catch {
    // Silent fail for analytics
  }
}
