"use client";

import { useQuery, useInfiniteQuery, useQueries } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchCategory,
  fetchWallpapers,
  fetchWallpaper,
  fetchSimilarWallpapers,
  searchWallpapers,
} from "@/lib/api/client";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchCategory(slug),
    enabled: !!slug,
  });
}

export function useWallpapers(category: string, sort: string = "hot") {
  return useInfiniteQuery({
    queryKey: ["wallpapers", category, sort],
    queryFn: ({ pageParam = 1 }) => fetchWallpapers(category, sort, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.lastPage) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

export function useWallpaper(id: string) {
  return useQuery({
    queryKey: ["wallpaper", id],
    queryFn: () => fetchWallpaper(id),
    enabled: !!id,
  });
}

export function useSimilarWallpapers(id: string) {
  return useInfiniteQuery({
    queryKey: ["similar", id],
    queryFn: ({ pageParam = 1 }) => fetchSimilarWallpapers(id, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.lastPage) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearch(query: string, sort: string = "relevance") {
  return useQuery({
    queryKey: ["search", query, sort],
    queryFn: () => searchWallpapers(query, sort),
    enabled: query.trim().length > 0,
    staleTime: 3 * 60 * 1000,
  });
}

export function useFavoriteWallpapers(ids: string[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["wallpaper", id],
      queryFn: () => fetchWallpaper(id),
      enabled: !!id,
      staleTime: 60 * 60 * 1000,
    })),
  });

  const wallpapers = results
    .filter((r) => r.isSuccess && r.data)
    .map((r) => r.data!);

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return { wallpapers, isLoading, isError };
}
