"use client";

import { useCallback, useState } from "react";
import { useFavoritesStore, useDownloadHistoryStore } from "@/lib/stores";
import toast from "react-hot-toast";
import type { Wallpaper } from "@/types";

function extractExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const lastDot = pathname.lastIndexOf(".");
    if (lastDot === -1) return "jpg";
    const ext = pathname.slice(lastDot + 1).toLowerCase();
    if (ext.length > 0 && ext.length <= 4) return ext;
    return "jpg";
  } catch {
    return "jpg";
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function fetchWithRetry(url: string, retries = 1): Promise<Response> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastError;
}

export function useWallpaperActions(wallpaper: Wallpaper | null | undefined) {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) =>
    wallpaper ? s.favorites.includes(wallpaper.id) : false
  );
  const addDownload = useDownloadHistoryStore((s) => s.addDownload);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!wallpaper) return;

    setDownloading(true);

    try {
      const response = await fetchWithRetry(wallpaper.image);

      const ext = extractExtension(wallpaper.image);
      const safeTitle = sanitizeFilename(wallpaper.title || wallpaper.id);
      const filename = `${safeTitle}.${ext}`;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Download complete!");

      addDownload({
        wallpaperId: wallpaper.id,
        title: wallpaper.title,
        thumbnail: wallpaper.thumbnail,
        filesize: wallpaper.filesize,
      });
    } catch {
      toast.error("Download failed. Opening in new tab instead.");
      window.open(wallpaper.image, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }, [wallpaper, addDownload]);

  const handleShare = useCallback(() => {
    if (!wallpaper) return;
    const shareUrl = `${window.location.origin}/wallpaper/${wallpaper.id}`;

    if (navigator.share) {
      navigator.share({
        title: wallpaper.title,
        text: `Check out this wallpaper: ${wallpaper.title}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("Link copied to clipboard!");
      }).catch(() => {
        toast.error("Failed to copy link");
      });
    }
  }, [wallpaper]);

  const handleToggleFavorite = useCallback(() => {
    if (!wallpaper) return;
    toggleFavorite(wallpaper.id);
    const nowFav = useFavoritesStore.getState().favorites.includes(wallpaper.id);
    toast.success(nowFav ? "Added to favorites" : "Removed from favorites");
  }, [wallpaper, toggleFavorite]);

  return {
    isFavorite,
    handleDownload,
    handleShare,
    handleToggleFavorite,
    downloading,
  };
}
