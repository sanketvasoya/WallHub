"use client";

import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useCollection } from "@/hooks/useQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { LinearProgress } from "@mui/material";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const slug = (params?.slug as string) || "";

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollection(slug);

  const wallpapers = data?.pages.flatMap((p) => p.wallpapers) ?? [];
  const collection = data?.pages[0]?.collection;

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  return (
    <Box sx={{ pb: { xs: 12, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <IconButton onClick={() => router.back()} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>
            {collection?.name || "Collection"}
          </Typography>
        </Box>
        {collection && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 6 }}>
            {collection.description}
          </Typography>
        )}
      </Box>

      {isLoading ? (
        <LoadingSkeleton count={10} />
      ) : isError ? (
        <ErrorState message="Failed to load collection" onRetry={() => window.location.reload()} />
      ) : (
        <WallpaperGrid wallpapers={wallpapers} />
      )}

      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <LinearProgress
            sx={{
              width: 120,
              height: 3,
              borderRadius: 2,
              bgcolor: "rgba(124,77,255,0.15)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #7c4dff, #00e5ff)",
              },
            }}
          />
        </Box>
      )}

      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
    </Box>
  );
}
