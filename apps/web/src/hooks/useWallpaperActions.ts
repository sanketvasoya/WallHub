"use client";

import { useCallback, useState } from "react";
import { useFavoritesStore } from "@/lib/stores";
import toast from "react-hot-toast";
import type { Wallpaper } from "@/types";

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
      const response = await fetch(wallpaper.image);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

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

        const ext = wallpaper.image.split(".").pop()?.split("?")[0] || "jpg";
        const safeTitle = (wallpaper.title || wallpaper.id).replace(/[^a-zA-Z0-9_-]/g, "_");
        a.download = `${safeTitle}.${ext}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const ext = wallpaper.image.split(".").pop()?.split("?")[0] || "jpg";
        const safeTitle = (wallpaper.title || wallpaper.id).replace(/[^a-zA-Z0-9_-]/g, "_");
        a.download = `${safeTitle}.${ext}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setDownloadProgress(100);
      toast.success("Download complete!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. Try opening the original instead.");
      const a = document.createElement("a");
      a.href = wallpaper.image;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
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
