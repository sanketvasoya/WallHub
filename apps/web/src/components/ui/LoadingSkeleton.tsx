"use client";

import { Box, Skeleton } from "@mui/material";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "list" | "hero" | "collection" | "detail";
}

export default function LoadingSkeleton({ count = 12, variant = "card" }: LoadingSkeletonProps) {
  if (variant === "hero") {
    return (
      <Box sx={{ mx: { xs: 0, sm: 2, md: 3 }, mt: 0 }}>
        <Skeleton
          variant="rounded"
          sx={{
            height: { xs: 380, sm: 440, md: 520 },
            borderRadius: { xs: 0, sm: 4, md: 4 },
          }}
        />
      </Box>
    );
  }

  if (variant === "collection") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 3.5 }} />
        ))}
      </Box>
    );
  }

  if (variant === "detail") {
    return (
      <Box sx={{ width: "100%", height: "80vh", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="rounded" width="100%" height="70%" sx={{ borderRadius: 4 }} />
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
    );
  }

  if (variant === "list") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Skeleton variant="rounded" width={72} height={72} sx={{ borderRadius: 2.5 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={24} />
              <Skeleton variant="text" width="40%" height={18} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <div className="image-grid" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="image-grid-item">
          <Box
            sx={{
              borderRadius: 3.5,
              overflow: "hidden",
            }}
          >
            <Skeleton
              variant="rounded"
              sx={{
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: 3.5,
              }}
            />
          </Box>
        </div>
      ))}
    </div>
  );
}

