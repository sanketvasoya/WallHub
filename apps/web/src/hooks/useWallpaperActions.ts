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

export function downloadFile(
  url: string,
  filename: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        onProgress?.(100);
        resolve();
      } else {
        reject(new Error("Download failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send();
  });
}

export function useWallpaperActions(wallpaper: Wallpaper | null | undefined) {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) =>
    wallpaper ? s.favorites.includes(wallpaper.id) : false
  );
  const addDownload = useDownloadHistoryStore((s) => s.addDownload);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = useCallback(async () => {
    if (!wallpaper) return;

    setDownloading(true);
    setProgress(0);

    try {
      const ext = extractExtension(wallpaper.image);
      const safeTitle = sanitizeFilename(wallpaper.title || wallpaper.id);
      const filename = `${safeTitle}.${ext}`;

      await downloadFile(wallpaper.image, filename, setProgress);

      toast.success("Download complete!");

      addDownload({
        wallpaperId: wallpaper.id,
        title: wallpaper.title,
        thumbnail: wallpaper.thumbnail,
        image: wallpaper.image,
        filesize: wallpaper.filesize,
      });

      setTimeout(() => setProgress(0), 2000);
    } catch {
      toast.error("Download failed. Opening in new tab instead.");
      window.open(wallpaper.image, "_blank", "noopener,noreferrer");
      setProgress(0);
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
    downloading: downloading || progress > 0,
    progress,
  };
}
