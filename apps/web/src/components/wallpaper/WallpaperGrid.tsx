"use client";

import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import WallpaperCard from "@/components/wallpaper/WallpaperCard";
import { useColumnCount } from "@/hooks/useColumnCount";
import type { Wallpaper } from "@/types";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
}

export default function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const columnCount = useColumnCount();

  if (wallpapers.length === 0) return null;

  return (
    <div role="region" aria-label="Wallpaper gallery">
      <VirtuosoMasonry
        useWindowScroll={true}
        columnCount={columnCount}
        data={wallpapers}
        initialItemCount={Math.min(30, wallpapers.length)}
        ItemContent={({ index, data }) => (
          <WallpaperCard wallpaper={data} index={index} />
        )}
      />
    </div>
  );
}
