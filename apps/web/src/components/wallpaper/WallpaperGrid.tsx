"use client";

import { useMemo } from "react";
import WallpaperCard from "@/components/wallpaper/WallpaperCard";
import type { Wallpaper } from "@/types";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
}

export default function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const sorted = useMemo(() => wallpapers, [wallpapers]);

  return (
    <div className="image-grid">
      {sorted.map((wallpaper, index) => (
        <div key={wallpaper.id} className="image-grid-item">
          <WallpaperCard wallpaper={wallpaper} index={index} />
        </div>
      ))}
    </div>
  );
}
