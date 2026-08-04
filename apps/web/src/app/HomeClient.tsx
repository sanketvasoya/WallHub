"use client";

import { Box, CircularProgress } from "@mui/material";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useFeed } from "@/hooks/useQueries";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Liquid from "@/components/canvasui/Liquid";
import { tokens } from "@/lib/tokens";

export default function HomeClient() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFeed();

  const wallpapers = data?.pages.flatMap((p) => p.wallpapers) ?? [];

  const { pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({
    onRefresh: async () => {
      await refetch();
    },
    threshold: 80,
  });

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  const content = isLoading ? (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      <LoadingSkeleton count={15} />
      <BottomNav />
    </Box>
  ) : isError ? (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      <ErrorState
        type="network"
        message="Couldn't load wallpapers"
        onRetry={() => refetch()}
      />
      <BottomNav />
    </Box>
  ) : (
    <Box sx={{ pb: { xs: 10, sm: 4 } }} {...touchHandlers}>
      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: Math.min(pullDistance, 80),
            transition: isRefreshing ? "none" : "height 0.2s ease",
          }}
        >
          {isRefreshing ? (
            <CircularProgress size={24} sx={{ color: tokens.color.primary }} />
          ) : (
            <Box
              sx={{
                color: tokens.color.textSecondary,
                fontSize: "0.75rem",
                opacity: Math.min(pullDistance / 80, 1),
              }}
            >
              {pullDistance >= 80 ? "Release to refresh" : "Pull to refresh"}
            </Box>
          )}
        </Box>
      )}
      
      <Header />
      {wallpapers.length > 0 ? (
        <>
          <WallpaperGrid wallpapers={wallpapers} />
          <div ref={sentinelRef} style={{ height: 1 }} />
          {isFetchingNextPage && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} sx={{ color: tokens.color.primary }} />
            </Box>
          )}
        </>
      ) : (
        <ErrorState
          type="empty"
          message="No wallpapers found"
          description="Try adjusting your filters or check back later."
          onRetry={() => refetch()}
        />
      )}
      <BottomNav />
    </Box>
  );

  return (
    <Liquid
      rainbow
      intensity={0.3}
      distortion={0.1}
      blend={2}
      densityDissipation={0.95}
      curl={1.5}
      style={{ minHeight: "100vh" }}
    >
      {content}
    </Liquid>
  );
}
