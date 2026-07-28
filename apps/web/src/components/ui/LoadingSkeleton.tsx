"use client";

import { Box, Skeleton, useTheme } from "@mui/material";
import { tokens } from "@/lib/tokens";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "list" | "hero" | "collection" | "detail";
}

export default function LoadingSkeleton({ count = 12, variant = "card" }: LoadingSkeletonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const shimmerSx = {
    borderRadius: tokens.radius.xl,
    bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    "&::after": {
      background: isDark
        ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)"
        : "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 50%, transparent 100%)",
    },
  } as const;

  if (variant === "hero") {
    return (
      <Box sx={{ mx: { xs: 0, sm: 2, md: 3 }, mt: 0 }}>
        <Skeleton
          variant="rounded"
          sx={{
            height: { xs: 380, sm: 440, md: 520 },
            borderRadius: { xs: 0, sm: tokens.radius["2xl"], md: tokens.radius["2xl"] },
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
          <Skeleton key={i} variant="rounded" height={100} sx={shimmerSx} />
        ))}
      </Box>
    );
  }

  if (variant === "detail") {
    return (
      <Box sx={{ width: "100%", height: "80vh", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="rounded" width="100%" height="70%" sx={{ borderRadius: tokens.radius["2xl"] }} />
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
    );
  }

  if (variant === "list") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              p: 1.5,
              borderRadius: tokens.radius.lg,
              bgcolor: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
              border: "1px solid",
              borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
            }}
          >
            <Skeleton variant="rounded" width={72} height={72} sx={{ borderRadius: tokens.radius.md, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="70%" height={22} />
              <Skeleton variant="text" width="40%" height={18} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // Default: card variant
  return (
    <div className="image-grid" role="status" aria-label="Loading wallpapers">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="image-grid-item">
          <Box sx={{ borderRadius: tokens.radius.xl, overflow: "hidden" }}>
            <Skeleton
              variant="rounded"
              sx={{
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: tokens.radius.xl,
              }}
            />
          </Box>
        </div>
      ))}
    </div>
  );
}
