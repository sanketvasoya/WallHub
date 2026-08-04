"use client";

import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchFeed,
  fetchWallpapers,
  fetchWallpaper,
  fetchSimilarWallpapers,
  fetchWallpapersBatch,
  searchWallpapers,
  fetchTrendingSearches,
} from "@/lib/api/client";

export function useFeed(ratios?: string, atleast?: string) {
  const noRatios = !ratios || ratios === "all"
  const queryKeyRatios = noRatios ? "all" : ratios
  return useInfiniteQuery({
    queryKey: ["feed", queryKeyRatios, atleast || "1920x1080"],
    queryFn: ({ pageParam = 1 }) => fetchFeed(pageParam, noRatios ? undefined : ratios, atleast),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.lastPage) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

export function useWallpapers(category: string, sort: string = "hot", ratios?: string, atleast?: string) {
  return useInfiniteQuery({
    queryKey: ["wallpapers", category, sort, ratios || "all", atleast || "1920x1080"],
    queryFn: ({ pageParam = 1 }) => fetchWallpapers(category, sort, pageParam, ratios, atleast),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.lastPage) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useWallpaper(id: string) {
  return useQuery({
    queryKey: ["wallpaper", id],
    queryFn: () => fetchWallpaper(id),
    enabled: !!id,
  });
}

export function useSimilarWallpapers(id: string, ratios?: string, atleast?: string) {
  return useInfiniteQuery({
    queryKey: ["similar", id, ratios || "all", atleast || "1920x1080"],
    queryFn: ({ pageParam = 1 }) => fetchSimilarWallpapers(id, pageParam, 24, ratios, atleast),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.lastPage) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearch(query: string, sort: string = "relevance", ratios?: string, atleast?: string) {
  return useInfiniteQuery({
    queryKey: ["search", query, sort, ratios || "all", atleast || "1920x1080"],
    queryFn: ({ pageParam = 1 }) => searchWallpapers(query, sort, pageParam, 20, ratios, atleast),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((acc, page) => acc + page.wallpapers.length, 0);
      if (totalLoaded >= lastPage.totalResults) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: query.trim().length > 0,
    staleTime: 3 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useTrendingSearches() {
  return useQuery({
    queryKey: ["trending-searches"],
    queryFn: fetchTrendingSearches,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}


