"use client";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { TrendingUp, ArrowForward, Whatshot, NewReleases, AutoAwesome } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SearchBar from "@/components/ui/SearchBar";
import CategoryCard from "@/components/wallpaper/CategoryCard";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useWallpapers } from "@/hooks/useQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCollections } from "@/hooks/useQueries";
import { tokens } from "@/lib/tokens";

const MotionBox = motion.create(Box);

const quickCategories = [
  { slug: "space", name: "Space", icon: "RocketLaunch" },
  { slug: "nature", name: "Nature", icon: "Park" },
  { slug: "amoled", name: "AMOLED", icon: "Circle" },
  { slug: "anime", name: "Anime", icon: "Animation" },
  { slug: "minimal", name: "Minimal", icon: "Minimize" },
  { slug: "cyberpunk", name: "Cyberpunk", icon: "Memory" },
];

function HeroBanner() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ position: "relative", mx: { xs: 0, sm: 2, md: 3 }, mt: 0 }}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: "relative",
          height: { xs: 380, sm: 440, md: 520 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: { xs: 0, sm: 4, md: 4 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? "linear-gradient(160deg, #0a0020 0%, #15003a 25%, #001a2e 50%, #05050a 100%)"
              : "linear-gradient(160deg, #e8eaf6 0%, #e3f2fd 25%, #f3e5f5 50%, #f8f8fc 100%)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            background: `
              radial-gradient(ellipse 600px 400px at 15% 40%, ${tokens.color.primary} 0%, transparent 70%),
              radial-gradient(ellipse 500px 300px at 85% 60%, ${tokens.color.secondary} 0%, transparent 70%),
              radial-gradient(ellipse 300px 200px at 50% 20%, ${tokens.color.accent || '#ff6b9d'} 0%, transparent 70%)
            `,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: isDark
              ? "radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.15), transparent), radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.1), transparent), radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.12), transparent), radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.08), transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.15), transparent), radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.1), transparent)"
              : "none",
            backgroundSize: "200px 200px",
            animation: isDark ? "pulse-glow 4s ease-in-out infinite" : "none",
          }}
        />

        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            px: { xs: 3, sm: 4, md: 6 },
            pb: { xs: 6, sm: 8 },
            zIndex: 1,
            width: "100%",
          }}
        >
          <MotionBox
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="h1"
              fontWeight={800}
              sx={{
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.8rem" },
                mb: 1.5,
                lineHeight: 1.1,
                background: tokens.gradient.text,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {"Discover Wallpapers"}
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 3.5,
                maxWidth: 420,
                mx: "auto",
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: "0.95rem", sm: "1rem" },
              }}
            >
              Stunning wallpapers in 4K resolution.
              Free to download, free to use.
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <SearchBar />
          </MotionBox>
        </Box>
      </MotionBox>
    </Box>
  );
}

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
          fontWeight={700}
          sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
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

function CollectionCard({ collection, index }: { collection: { slug: string; name: string; description: string }; index: number }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => router.push(`/collections/${collection.slug}`)}
      sx={{
        p: 2,
        borderRadius: 2.5,
        cursor: "pointer",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.85rem" }}>
        {collection.name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
        {collection.description}
      </Typography>
    </MotionBox>
  );
}

function HomeContent() {
  const router = useRouter();
  const { data: wallpapersData, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useWallpapers("trending", "hot");
  const allWallpapers = wallpapersData?.pages.flatMap((p) => p.wallpapers) ?? [];

  const newArrivals = useWallpapers("trending", "new");
  const newWallpapers = newArrivals.data?.pages.flatMap((p) => p.wallpapers).slice(0, 10) ?? [];

  const editorsPicks = useWallpapers("trending", "top");
  const editorWallpapers = editorsPicks.data?.pages.flatMap((p) => p.wallpapers).slice(0, 10) ?? [];

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
      <HeroBanner />

      <Box sx={{ mt: 4, mb: 2 }}>
        <SectionHeader
          title="Quick Categories"
          icon={<Whatshot sx={{ color: "primary.main", fontSize: 20 }} />}
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
            <CategoryCard key={cat.slug} category={{ slug: cat.slug, name: cat.name, icon: cat.icon, subreddits: [], description: "" }} index={i} />
          ))}
        </Box>
      </Box>

      {collections.length > 0 && (
        <Box sx={{ mt: 4, mb: 2 }}>
          <SectionHeader
            title="Collections"
            icon={<AutoAwesome sx={{ color: "warning.main", fontSize: 20 }} />}
            onSeeAll={() => router.push("/collections")}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
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

      <Box sx={{ mt: 4 }}>
        <SectionHeader
          title="Trending Now"
          icon={<TrendingUp sx={{ color: "error.main", fontSize: 20 }} />}
          onSeeAll={() => router.push("/category/trending")}
        />
        {isLoading ? (
          <LoadingSkeleton count={10} />
        ) : isError ? (
          <ErrorState message="Failed to load wallpapers" onRetry={() => window.location.reload()} />
        ) : (
          <WallpaperGrid wallpapers={allWallpapers} />
        )}
      </Box>

      {newWallpapers.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <SectionHeader
            title="New Arrivals"
            icon={<NewReleases sx={{ color: "success.main", fontSize: 20 }} />}
            onSeeAll={() => router.push("/category/trending?sort=new")}
          />
          <WallpaperGrid wallpapers={newWallpapers} />
        </Box>
      )}

      {editorWallpapers.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <SectionHeader
            title="Editor's Picks"
            icon={<AutoAwesome sx={{ color: "warning.main", fontSize: 20 }} />}
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
