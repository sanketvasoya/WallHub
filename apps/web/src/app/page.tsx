"use client";

import { Box, Typography, Button } from "@mui/material";
import { TrendingUp, ArrowForward, Whatshot, NewReleases, AutoAwesome, Shuffle } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import CategoryCard from "@/components/wallpaper/CategoryCard";
import CollectionCard from "@/components/wallpaper/CollectionCard";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import WallpaperHero from "@/components/wallpaper/WallpaperHero";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useWallpapers, useCollections } from "@/hooks/useQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useOrientation } from "@/hooks/useOrientation";
import { useMemo } from "react";

const quickCategories = [
  { slug: "space", name: "Space", icon: "RocketLaunch", description: "Cosmic & galaxy", subreddits: [] },
  { slug: "nature", name: "Nature", icon: "Park", description: "Landscapes & forests", subreddits: [] },
  { slug: "amoled", name: "AMOLED", icon: "Circle", description: "Pure darks", subreddits: [] },
  { slug: "anime", name: "Anime", icon: "Animation", description: "Art & illustration", subreddits: [] },
  { slug: "minimal", name: "Minimal", icon: "Minimize", description: "Clean & simple", subreddits: [] },
  { slug: "cyberpunk", name: "Cyberpunk", icon: "Memory", description: "Neon & futuristic", subreddits: [] },
];

function SectionHeader({ title, icon, onSeeAll }: { title: string; icon: React.ReactNode; onSeeAll?: () => void }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 1.5, sm: 2, md: 3 },
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.05rem", sm: "1.2rem" }, letterSpacing: "-0.01em" }}
        >
          {title}
        </Typography>
      </Box>
      {onSeeAll && (
        <Button
          endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
          onClick={onSeeAll}
          size="small"
          sx={{
            textTransform: "none",
            color: "text.secondary",
            fontSize: "0.8rem",
            fontWeight: 600,
            "&:hover": { color: "primary.main" },
          }}
        >
          See All
        </Button>
      )}
    </Box>
  );
}

function HomeContent() {
  const router = useRouter();
  const { ratios, atleast } = useOrientation();
  const {
    data: wallpapersData,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWallpapers("trending", "hot", ratios, atleast);
  
  const allWallpapers = useMemo(
    () => wallpapersData?.pages.flatMap((p) => p.wallpapers) ?? [],
    [wallpapersData]
  );

  const newArrivals = useWallpapers("trending", "new", ratios, atleast);
  const newWallpapers = useMemo(
    () => newArrivals.data?.pages.flatMap((p) => p.wallpapers).slice(0, 8) ?? [],
    [newArrivals.data]
  );

  const editorsPicks = useWallpapers("trending", "top", ratios, atleast);
  const editorWallpapers = useMemo(
    () => editorsPicks.data?.pages.flatMap((p) => p.wallpapers).slice(0, 8) ?? [],
    [editorsPicks.data]
  );

  const { data: collectionsData } = useCollections();
  const collections = collectionsData?.collections?.slice(0, 4) ?? [];

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      
      {/* Hero Banner */}
      {isLoading ? (
        <LoadingSkeleton variant="hero" />
      ) : (
        <WallpaperHero wallpapers={allWallpapers} />
      )}

      {/* Quick Categories */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <SectionHeader
          title="Categories"
          icon={<Whatshot sx={{ color: "primary.main", fontSize: 22 }} />}
          onSeeAll={() => router.push("/category/trending")}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 1.5,
            px: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          {quickCategories.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </Box>
      </Box>

      {/* Collections */}
      {collections.length > 0 && (
        <Box sx={{ mt: 4, mb: 2 }}>
          <SectionHeader
            title="Featured Collections"
            icon={<AutoAwesome sx={{ color: "warning.main", fontSize: 22 }} />}
            onSeeAll={() => router.push("/collections")}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 1.5,
              px: { xs: 1.5, sm: 2, md: 3 },
            }}
          >
            {collections.map((c, i) => (
              <CollectionCard key={c.slug} collection={c} index={i} />
            ))}
          </Box>
        </Box>
      )}

      {/* Trending Now */}
      <Box sx={{ mt: 4 }}>
        <SectionHeader
          title="Trending Now"
          icon={<TrendingUp sx={{ color: "error.main", fontSize: 22 }} />}
          onSeeAll={() => router.push("/category/trending")}
        />
        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : isError ? (
          <ErrorState message="Failed to load wallpapers" onRetry={() => refetch()} />
        ) : (
          <WallpaperGrid wallpapers={allWallpapers} />
        )}
      </Box>

      {/* New Arrivals */}
      {newWallpapers.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <SectionHeader
            title="New Arrivals"
            icon={<NewReleases sx={{ color: "success.main", fontSize: 22 }} />}
            onSeeAll={() => router.push("/category/trending?sort=new")}
          />
          <WallpaperGrid wallpapers={newWallpapers} />
        </Box>
      )}

      {/* Editor's Picks */}
      {editorWallpapers.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <SectionHeader
            title="Editor's Choice"
            icon={<Shuffle sx={{ color: "info.main", fontSize: 22 }} />}
            onSeeAll={() => router.push("/category/trending?sort=top")}
          />
          <WallpaperGrid wallpapers={editorWallpapers} />
        </Box>
      )}

      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <LoadingSkeleton count={4} />
        </Box>
      )}

      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}

      <BottomNav />
    </Box>
  );
}

export default function HomePage() {
  return <HomeContent />;
}

