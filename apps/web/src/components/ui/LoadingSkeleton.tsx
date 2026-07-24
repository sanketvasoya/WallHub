"use client";

import { Box, Skeleton } from "@mui/material";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "list";
}

const aspectRatios = [
  "3/4", "4/5", "16/9", "1/1", "9/16", "4/3", "3/4", "16/9", "1/1", "4/5",
  "9/16", "3/4", "16/9", "4/5", "1/1",
];

export default function LoadingSkeleton({ count = 12, variant = "card" }: LoadingSkeletonProps) {
  if (variant === "list") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", gap: 2 }}>
            <Skeleton variant="rounded" width={120} height={80} sx={{ borderRadius: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <div className="masonry-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="masonry-item">
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Skeleton
              variant="rounded"
              sx={{
                width: "100%",
                aspectRatio: aspectRatios[i % aspectRatios.length],
                borderRadius: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.06)",
              }}
            />
          </Box>
        </div>
      ))}
    </div>
  );
}
