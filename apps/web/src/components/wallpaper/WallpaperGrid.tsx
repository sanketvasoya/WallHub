"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import WallpaperCard from "@/components/wallpaper/WallpaperCard";
import { deduplicateWallpapers } from "@/lib/utils";
import type { Wallpaper } from "@/types";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
}

interface Pos {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getCols(w: number): number {
  if (w >= 1100) return 5;
  if (w >= 700) return 3;
  return 2;
}

function getGap(w: number): number {
  if (w >= 1100) return 20;
  if (w >= 700) return 16;
  return 12;
}

function getPad(w: number): number {
  if (w >= 1100) return 24;
  if (w >= 700) return 20;
  return 16;
}

export default function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map<string, Pos>>(new Map());

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const unique = useMemo(() => deduplicateWallpapers(wallpapers), [wallpapers]);

  const { items, height } = useMemo(() => {
    if (!width || unique.length === 0) return { items: [], height: 0 };

    const cols = getCols(width);
    const gap = getGap(width);
    const pad = getPad(width);
    const innerWidth = width - pad * 2;
    const colW = (innerWidth - gap * (cols - 1)) / cols;
    const colHeights = new Array(cols).fill(0);
    const result: { wp: Wallpaper; pos: Pos }[] = [];
    const map = mapRef.current;

    map.clear();

    for (const wp of unique) {
      const aspect = wp.width / wp.height;
      const itemH = colW / aspect;

      let minIdx = 0;
      for (let i = 1; i < colHeights.length; i++) {
        if (colHeights[i] < colHeights[minIdx]) minIdx = i;
      }

      const pos: Pos = {
        x: minIdx * (colW + gap) + pad,
        y: colHeights[minIdx],
        w: colW,
        h: itemH,
      };

      map.set(wp.id, pos);
      result.push({ wp, pos });
      colHeights[minIdx] += itemH + gap;
    }

    return { items: result, height: Math.max(...colHeights, 0) };
  }, [width, unique]);

  if (unique.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: height || "100vh" }}
      role="region"
      aria-label="Wallpaper gallery"
    >
      {items.map(({ wp, pos }, i) => (
        <div
          key={wp.id}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: pos.w,
          }}
        >
          <WallpaperCard wallpaper={wp} index={i} />
        </div>
      ))}
    </div>
  );
}
