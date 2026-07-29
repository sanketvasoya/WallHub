"use client";

import { tokens } from "@/lib/tokens";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "list" | "detail";
}

export default function LoadingSkeleton({ count = 12, variant = "card" }: LoadingSkeletonProps) {
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
    <div className="masonry-grid" role="status" aria-label="Loading wallpapers">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="masonry-grid-item">
          <div
            className="animate-shimmer"
            style={{
              width: "100%",
              paddingBottom: `${i % 3 === 0 ? "150%" : i % 3 === 1 ? "120%" : "80%"}`,
              borderRadius: tokens.radius.card,
            }}
          />
        </div>
      ))}
    </div>
  );
}
