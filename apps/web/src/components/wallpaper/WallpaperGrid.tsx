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
  const positionsRef = useRef<Map<string, Pos>>(new Map());
  const colHeightsRef = useRef<number[]>([]);
  const colsRef = useRef(5);
  const gapRef = useRef(20);
  const padRef = useRef(24);
  const innerRef = useRef(24);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setContainerWidth(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const unique = useMemo(() => deduplicateWallpapers(wallpapers), [wallpapers]);

  const height = useMemo(() => {
    if (unique.length === 0) return 0;

    const cols = getCols(containerWidth);
    const gap = getGap(containerWidth);
    const pad = getPad(containerWidth);
    const inner = containerWidth - pad * 2;
    const colW = (inner - gap * (cols - 1)) / cols;

    const map = positionsRef.current;
    const colHs = colHeightsRef.current;

    if (cols !== colsRef.current || gap !== gapRef.current || pad !== padRef.current) {
      map.clear();
      colHs.length = 0;
      colsRef.current = cols;
      gapRef.current = gap;
      padRef.current = pad;
      innerRef.current = inner;
    }

    for (const wp of unique) {
      if (map.has(wp.id)) continue;

      if (colHs.length === 0) {
        for (let i = 0; i < cols; i++) colHs.push(0);
      }

      const aspect = wp.width / wp.height;
      const itemH = colW / aspect;
      let colIdx = 0;
      let minH = colHs[0];
      for (let i = 1; i < colHs.length; i++) {
        if (colHs[i] < minH) { minH = colHs[i]; colIdx = i; }
      }

      map.set(wp.id, {
        x: colIdx * (colW + gap) + pad,
        y: colHs[colIdx],
        w: colW,
        h: itemH,
      });
      colHs[colIdx] += itemH + gap;
    }

    const maxH = colHs.length > 0 ? Math.max(...colHs) : 0;
    return maxH;
  }, [containerWidth, unique]);

  if (unique.length === 0) return null;

  const map = positionsRef.current;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height, minHeight: "100vh" }}
      role="region"
      aria-label="Wallpaper gallery"
    >
      {unique.map((wp, i) => {
        const pos = map.get(wp.id);
        if (!pos) return null;
        return (
          <div
            key={wp.id}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: pos.w,
              willChange: "top, left",
            }}
          >
            <WallpaperCard wallpaper={wp} index={i} />
          </div>
        );
      })}
    </div>
  );
}
