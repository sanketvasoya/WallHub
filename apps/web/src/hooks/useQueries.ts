"use client";

import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchFeed,
  fetchCategories,
  fetchCategory,
  fetchWallpapers,
  fetchWallpaper,
  fetchSimilarWallpapers,
  fetchWallpapersBatch,
  searchWallpapers,
  fetchCollections,
  fetchCollection,
  fetchHomepage,
} from "@/lib/api/client";

export function useFeed(ratios?: string, atleast?: string) {
  return useInfiniteQuery({
    queryKey: ["feed", ratios || "all", atleast || "1920x1080"],
    queryFn: ({ pageParam = 1 }) => fetchFeed(pageParam, ratios, atleast),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.lastPage) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

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
  return useQuery({
    queryKey: ["search", query, sort, ratios || "all", atleast || "1920x1080"],
    queryFn: () => searchWallpapers(query, sort, ratios, atleast),
    enabled: query.trim().length > 0,
    staleTime: 3 * 60 * 1000,
  });
}

export function useFavoriteWallpapers(ids: string[]) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorites-batch", ids],
    queryFn: () => fetchWallpapersBatch(ids),
    enabled: ids.length > 0,
    staleTime: 60 * 60 * 1000,
  });

  return {
    wallpapers: data?.wallpapers ?? [],
    isLoading,
    isError,
  };
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    staleTime: 60 * 60 * 1000,
  });
}

export function useCollection(slug: string) {
  return useInfiniteQuery({
    queryKey: ["collection", slug],
    queryFn: ({ pageParam = 1 }) => fetchCollection(slug, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= 3) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHomepage() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: fetchHomepage,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
