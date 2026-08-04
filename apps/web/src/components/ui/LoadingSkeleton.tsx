"use client";

import { tokens } from "@/lib/tokens";
import { useColumnCount } from "@/hooks/useColumnCount";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "list" | "detail";
}

// Fixed aspect ratios that mimic real wallpaper distribution
const ASPECT_RATIOS = [
  "3 / 4",    // portrait
  "16 / 9",   // landscape
  "1 / 1",    // square
  "4 / 5",    // portrait-ish
  "21 / 9",   // ultra-wide landscape
];

export default function LoadingSkeleton({ count = 12, variant = "card" }: LoadingSkeletonProps) {
  const columnCount = useColumnCount();

  if (variant === "detail") {
    return (
      <div style={{ width: "100%", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="animate-shimmer" style={{ width: "100%", height: "60vh", borderRadius: tokens.radius.card }} />
        <div className="animate-shimmer" style={{ width: "40%", height: 24, borderRadius: 8 }} />
        <div className="animate-shimmer" style={{ width: "60%", height: 16, borderRadius: 8 }} />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12 }}>
            <div className="animate-shimmer" style={{ width: 72, height: 72, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="animate-shimmer" style={{ width: "70%", height: 18, borderRadius: 6, marginBottom: 6 }} />
              <div className="animate-shimmer" style={{ width: "40%", height: 14, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: 16,
        padding: "0 24px",
      }}
      role="status"
      aria-label="Loading wallpapers"
    >
      {Array.from({ length: count }).map((_, i) => {
        const aspectRatio = ASPECT_RATIOS[i % ASPECT_RATIOS.length];
        return (
          <div key={i} style={{ position: "relative" }}>
            <div
              className="animate-shimmer"
              style={{
                width: "100%",
                aspectRatio,
                borderRadius: tokens.radius.card,
                background: tokens.color.surface,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
