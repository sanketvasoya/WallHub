"use client";

import { useCallback, useState } from "react";
import { useFavoritesStore } from "@/lib/stores";
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
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const handleDownload = useCallback(async () => {
    if (!wallpaper) return;

    setDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetchWithRetry(wallpaper.image);

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const ext = extractExtension(wallpaper.image);
      const safeTitle = sanitizeFilename(wallpaper.title || wallpaper.id);
      const filename = `${safeTitle}.${ext}`;

      if (response.body && total > 0) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          setDownloadProgress(Math.round((received / total) * 100));
        }

        const blob = new Blob(chunks as BlobPart[]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setDownloadProgress(100);
      toast.success("Download complete!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. Opening in new tab instead.");
      window.open(wallpaper.image, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
      setTimeout(() => setDownloadProgress(null), 2000);
    }
  }, [wallpaper]);

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
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  }, [wallpaper, toggleFavorite, isFavorite]);

  return {
    isFavorite,
    handleDownload,
    handleShare,
    handleToggleFavorite,
    downloading,
    downloadProgress,
  };
}
