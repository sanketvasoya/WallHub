"use client";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowRight,
  Flame,
  Sparkles,
  Rocket,
  TreePine,
  CircleDot,
  Minus,
  Landmark,
} from "lucide-react";
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
import { tokens } from "@/lib/tokens";
import type { Category } from "@/types";

const quickCategories: Category[] = [
  { slug: "minimal", name: "Minimal", icon: "Minimize", description: "Clean & simple", subreddits: [] },
  { slug: "space", name: "Space", icon: "RocketLaunch", description: "Cosmic & galaxy", subreddits: [] },
  { slug: "nature", name: "Nature", icon: "Park", description: "Landscapes & forests", subreddits: [] },
  { slug: "amoled", name: "AMOLED", icon: "Circle", description: "Pure darks", subreddits: [] },
  { slug: "architecture", name: "Architecture", icon: "AccountBalance", description: "Modern design", subreddits: [] },
  { slug: "abstract", name: "Abstract", icon: "BubbleChart", description: "Art & gradients", subreddits: [] },
];

const MotionBox = motion.create(Box);

function SectionHeader({
  title,
  icon,
  onSeeAll,
}: {
  title: string;
  icon: React.ReactNode;
  onSeeAll?: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, sm: 3 },
        mb: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.05rem", sm: "1.2rem" },
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
      </Box>
      {onSeeAll && (
        <Button
          endIcon={<ArrowRight size={16} />}
          onClick={onSeeAll}
          size="small"
          sx={{
            textTransform: "none",
            color: "text.secondary",
            fontSize: "0.8rem",
            fontWeight: 600,
            gap: 0.5,
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            transition: "all 0.2s ease",
            "&:hover": {
              color: "primary.main",
              bgcolor: (t) =>
                t.palette.mode === "dark"
                  ? tokens.color.primaryAlpha10
                  : tokens.color.primaryAlpha8,
            },
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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

      <WallpaperHero wallpapers={homepage.hero} />

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: tokens.animation.curve.standard }}
      >
        <Box sx={{ mt: 4, mb: 2 }}>
          <SectionHeader
            title="Categories"
            icon={<Flame size={20} strokeWidth={2.2} />}
            onSeeAll={() => router.push("/category/minimal")}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: 1.5,
              px: { xs: 2, sm: 3 },
            }}
          >
            {quickCategories.map((cat, i) => (
              <CategoryCard key={cat.slug} category={cat} index={i} />
            ))}
          </Box>
        </Box>
      </MotionBox>

      {collections.length > 0 && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: tokens.animation.curve.standard }}
        >
          <Box sx={{ mt: 4, mb: 2 }}>
            <SectionHeader
              title="Featured Collections"
              icon={<Sparkles size={20} strokeWidth={2.2} />}
              onSeeAll={() => router.push("/collections")}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 1.5,
                px: { xs: 2, sm: 3 },
              }}
            >
              {collections.map((c, i) => (
                <CollectionCard key={c.slug} collection={c} index={i} />
              ))}
            </Box>
          </Box>
        </MotionBox>
      )}

      {homepage.sections.map((section, idx) => (
        <MotionBox
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + idx * 0.1, ease: tokens.animation.curve.standard }}
        >
          <Box sx={{ mt: 5 }}>
            <SectionHeader
              title={section.name}
              icon={<TrendingUp size={20} strokeWidth={2.2} />}
              onSeeAll={() => router.push(`/category/${section.id}`)}
            />
            <WallpaperGrid wallpapers={section.wallpapers} />
          </Box>
        </MotionBox>
      ))}

      <BottomNav />
    </Box>
  );
}

export default function HomePage() {
  return <HomeContent />;
}
