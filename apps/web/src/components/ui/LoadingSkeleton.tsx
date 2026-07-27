"use client";

import { Box, Skeleton } from "@mui/material";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "list";
}

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
    <div className="image-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="image-grid-item">
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
                aspectRatio: "16/9",
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
