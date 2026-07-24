"use client";

import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/lib/stores";
import { fetchWallpapersBatch } from "@/lib/api/client";

export function useFavorites() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorites", favorites],
    queryFn: () => fetchWallpapersBatch(favorites),
    enabled: favorites.length > 0,
    staleTime: 60 * 60 * 1000,
  });

  return {
    favorites,
    wallpapers: data?.wallpapers ?? [],
    count: favorites.length,
    isLoading,
    isError,
    toggleFavorite,
    isFavorite,
  };
}
