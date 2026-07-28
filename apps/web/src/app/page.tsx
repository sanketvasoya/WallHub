"use client";

import { Box, Typography, Button } from "@mui/material";
import { TrendingUp, ArrowForward, Whatshot, AutoAwesome } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import CategoryCard from "@/components/wallpaper/CategoryCard";
import CollectionCard from "@/components/wallpaper/CollectionCard";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import WallpaperHero from "@/components/wallpaper/WallpaperHero";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useHomepage, useCollections } from "@/hooks/useQueries";

const quickCategories = [
  { slug: "minimal", name: "Minimal", icon: "Minimize", description: "Clean & simple", subreddits: [] },
  { slug: "space", name: "Space", icon: "RocketLaunch", description: "Cosmic & galaxy", subreddits: [] },
  { slug: "nature", name: "Nature", icon: "Park", description: "Landscapes & forests", subreddits: [] },
  { slug: "amoled", name: "AMOLED", icon: "Circle", description: "Pure darks", subreddits: [] },
  { slug: "architecture", name: "Architecture", icon: "AccountBalance", description: "Modern design", subreddits: [] },
  { slug: "abstract", name: "Abstract", icon: "BubbleChart", description: "Art & gradients", subreddits: [] },
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
  const { data: homepage, isLoading, isError, refetch } = useHomepage();
  const { data: collectionsData } = useCollections();
  const collections = collectionsData?.collections?.slice(0, 4) ?? [];

  if (isLoading) {
    return (
      <Box sx={{ pb: { xs: 10, sm: 4 } }}>
        <Header />
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton count={12} />
        <BottomNav />
      </Box>
    );
  }

  if (isError || !homepage) {
    return (
      <Box sx={{ pb: { xs: 10, sm: 4 } }}>
        <Header />
        <ErrorState message="Failed to load homepage" onRetry={() => refetch()} />
        <BottomNav />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      
      {/* Hero Banner */}
      <WallpaperHero wallpapers={homepage.hero} />

      {/* Quick Categories */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <SectionHeader
          title="Categories"
          icon={<Whatshot sx={{ color: "primary.main", fontSize: 22 }} />}
          onSeeAll={() => router.push("/category/minimal")}
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

      {/* Curated Sections */}
      {homepage.sections.map((section) => (
        <Box key={section.id} sx={{ mt: 5 }}>
          <SectionHeader
            title={section.name}
            icon={<TrendingUp sx={{ color: "error.main", fontSize: 22 }} />}
            onSeeAll={() => router.push(`/category/${section.id}`)}
          />
          <WallpaperGrid wallpapers={section.wallpapers} />
        </Box>
      ))}

      <BottomNav />
    </Box>
  );
}

export default function HomePage() {
  return <HomeContent />;
}
