"use client";

import { Box } from "@mui/material";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useFeed } from "@/hooks/useQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useOrientation } from "@/hooks/useOrientation";

function HomeContent() {
  const { ratios, atleast } = useOrientation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFeed(ratios, atleast);

  const wallpapers = data?.pages.flatMap((p) => p.wallpapers) ?? [];

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <Box sx={{ pb: { xs: 10, sm: 4 } }}>
        <Header />
        <LoadingSkeleton count={15} />
        <BottomNav />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ pb: { xs: 10, sm: 4 } }}>
        <Header />
        <ErrorState
          type="network"
          message="Couldn't load wallpapers"
          onRetry={() => refetch()}
        />
        <BottomNav />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      {wallpapers.length > 0 ? (
        <>
          <WallpaperGrid wallpapers={wallpapers} />
          {isFetchingNextPage && <LoadingSkeleton count={5} />}
          <div ref={sentinelRef} style={{ height: 1 }} />
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
}

export default function HomePage() {
  return <HomeContent />;
}
