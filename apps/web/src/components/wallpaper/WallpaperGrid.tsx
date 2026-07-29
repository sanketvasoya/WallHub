"use client";

import { useMemo } from "react";
import WallpaperCard from "@/components/wallpaper/WallpaperCard";
import { deduplicateWallpapers } from "@/lib/utils";
import type { Wallpaper } from "@/types";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
}

export default function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const uniqueWallpapers = useMemo(() => deduplicateWallpapers(wallpapers), [wallpapers]);

  return (
    <div className="masonry-grid" role="region" aria-label="Wallpaper gallery">
      {uniqueWallpapers.map((wallpaper, index) => (
        <div key={wallpaper.id} className="masonry-grid-item">
          <WallpaperCard wallpaper={wallpaper} index={index} />
        </div>
      ))}
    </div>
  );
}
