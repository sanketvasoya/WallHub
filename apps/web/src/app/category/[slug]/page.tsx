"use client";

import { useState } from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton, Chip, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack, Whatshot, NewReleases, TrendingUp } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useWallpapers } from "@/hooks/useQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const sortOptions = [
  { value: "hot", label: "Hot", icon: <Whatshot sx={{ fontSize: 16 }} /> },
  { value: "new", label: "New", icon: <NewReleases sx={{ fontSize: 16 }} /> },
  { value: "top", label: "Top", icon: <TrendingUp sx={{ fontSize: 16 }} /> },
];

function CategoryContent() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "trending";
  const [sort, setSort] = useState("hot");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useWallpapers(slug, sort);
  const wallpapers = data?.pages.flatMap((p) => p.wallpapers) ?? [];

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <IconButton
            onClick={() => router.back()}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ textTransform: "capitalize", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            {slug.replace(/-/g, " ")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto", pb: 0.5 }}>
          <ToggleButtonGroup
            value={sort}
            exclusive
            onChange={(_, v) => v && setSort(v)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: "10px !important",
                border: "1px solid",
                borderColor: (theme) => theme.palette.divider + " !important",
                px: 2.5,
                py: 0.75,
                gap: 0.5,
                transition: "all 0.2s ease",
              },
            }}
          >
            {sortOptions.map((opt) => (
              <ToggleButton key={opt.value} value={opt.value}>
                {opt.icon}
                {opt.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingSkeleton count={15} />
      ) : isError ? (
        <ErrorState message="Failed to load wallpapers" onRetry={() => window.location.reload()} />
      ) : wallpapers.length === 0 ? (
        <ErrorState message="No wallpapers found for this category" />
      ) : (
        <WallpaperGrid wallpapers={wallpapers} />
      )}

      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} sx={{ color: "primary.main" }} />
        </Box>
      )}

      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}

      <BottomNav />
    </Box>
  );
}

export default function CategoryPage() {
  return <CategoryContent />;
}
