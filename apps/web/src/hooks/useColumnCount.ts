"use client";

import { useState, useEffect, useMemo } from "react";

function getColumnCount(width: number): number {
  if (width < 640) return 2;
  if (width < 1024) return 3;
  if (width < 1440) return 4;
  return 5;
}

export function useColumnCount(): number {
  const [width, setWidth] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth;
    return 1024; // SSR fallback
  });

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columnCount = useMemo(() => getColumnCount(width), [width]);

  return columnCount;
}
