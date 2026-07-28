"use client";

import { useMemo } from "react";
import WallpaperCard from "@/components/wallpaper/WallpaperCard";
import { deduplicateWallpapers } from "@/lib/utils";
import type { Wallpaper } from "@/types";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  variant?: "grid" | "masonry";
}

export default function WallpaperGrid({ wallpapers, variant = "grid" }: WallpaperGridProps) {
  const uniqueWallpapers = useMemo(() => deduplicateWallpapers(wallpapers), [wallpapers]);

  const containerClass = variant === "masonry" ? "masonry-grid" : "image-grid";
  const itemClass = variant === "masonry" ? "masonry-grid-item" : "image-grid-item";

  return (
    <div className={containerClass} role="region" aria-label="Wallpaper gallery">
      {uniqueWallpapers.map((wallpaper, index) => (
        <div key={wallpaper.id} className={itemClass}>
          <WallpaperCard wallpaper={wallpaper} index={index} variant={variant} />
        </div>
      ))}
    </div>
  );
}
