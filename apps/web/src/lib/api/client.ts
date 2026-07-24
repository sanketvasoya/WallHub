import axios from "axios";
import type { WallpapersResponse, SearchResponse, CategoriesResponse, Category, Wallpaper } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

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
  page: number = 1
): Promise<WallpapersResponse> {
  const { data } = await api.get<WallpapersResponse>("/wallpapers", {
    params: { category, sort, page, limit: 30 },
  });
  return data;
}

export async function fetchWallpaper(id: string): Promise<Wallpaper> {
  const { data } = await api.get<Wallpaper>(`/wallpaper/${id}`);
  return data;
}

export async function fetchSimilarWallpapers(
  id: string,
  page: number = 1
): Promise<WallpapersResponse> {
  const { data } = await api.get<WallpapersResponse>(`/wallpaper/${id}/similar`, {
    params: { page },
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
  sort: string = "relevance"
): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>("/search", {
    params: { q: query, sort, limit: 50 },
  });
  return data;
}
