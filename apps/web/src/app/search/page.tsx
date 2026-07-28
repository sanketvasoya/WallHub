"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Box, Typography, Button, Chip, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import FilterSheet, { type FilterState } from "@/components/wallpaper/FilterSheet";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useSearch } from "@/hooks/useQueries";
import { useOrientation } from "@/hooks/useOrientation";
import { tokens } from "@/lib/tokens";
import type { SortOption } from "@/types";

const PAGE_SIZE = 20;

const MotionBox = motion.create(Box);

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sort: "relevance" as SortOption,
    resolution: "any",
    orientation: "any",
  });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { ratios, atleast } = useOrientation();
  const { data, isLoading, isError, refetch } = useSearch(
    debouncedQuery,
    filters.sort,
    ratios,
    atleast
  );
  const allWallpapers = data?.wallpapers ?? [];

  const filteredWallpapers = allWallpapers.filter((w) => {
    if (filters.orientation !== "any" && w.orientation !== filters.orientation) {
      return false;
    }
    return true;
  });

  const wallpapers = filteredWallpapers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredWallpapers.length;

  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setVisibleCount(PAGE_SIZE);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const handleSubmit = () => {
    if (query.trim()) {
      setDebouncedQuery(query.trim());
      setVisibleCount(PAGE_SIZE);
      router.replace(`/search?q=${encodeURIComponent(query.trim())}`, {
        scroll: false,
      });
    }
  };

  const handleSelect = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    setVisibleCount(PAGE_SIZE);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const showResults = debouncedQuery.trim().length > 0;

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: tokens.animation.curve.standard }}
        >
          <PageHeader
            title="Search Wallpapers"
            subtitle="Explore millions of 4K wallpapers by keyword, tag, or topic"
            icon={<Search size={18} strokeWidth={2.2} />}
            action={
              showResults ? (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SlidersHorizontal size={15} />}
                  onClick={() => setFilterOpen(true)}
                  sx={{
                    borderRadius: 2.5,
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    borderColor: "divider",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: isDark
                        ? tokens.color.primaryAlpha8
                        : tokens.color.primaryAlpha8,
                    },
                  }}
                >
                  Filter
                </Button>
              ) : undefined
            }
          />
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: tokens.animation.curve.standard }}
        >
          <Box sx={{ mb: 3 }}>
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              onSelect={handleSelect}
              autoFocus
              showSuggestions={!debouncedQuery}
            />
          </Box>
        </MotionBox>

        {showResults && (
          <>
            {isLoading ? (
              <LoadingSkeleton count={10} />
            ) : isError ? (
              <ErrorState message="Search failed" onRetry={() => refetch()} />
            ) : wallpapers.length === 0 ? (
              <ErrorState
                type="notFound"
                message={`No wallpapers found for "${debouncedQuery}"`}
              />
            ) : (
              <>
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      ml: 1,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    Showing {wallpapers.length} of {filteredWallpapers.length}{" "}
                    results for &quot;{debouncedQuery}&quot;
                  </Typography>
                </MotionBox>
                <WallpaperGrid wallpapers={wallpapers} />
                {hasMore && (
                  <Box ref={sentinelRef} sx={{ py: 2 }}>
                    <LoadingSkeleton count={4} />
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {!showResults && (
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: tokens.animation.curve.standard }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 8,
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDark
                  ? tokens.color.surfaceDark
                  : tokens.color.surfaceLight,
                border: "1px solid",
                borderColor: isDark
                  ? tokens.color.borderDark
                  : tokens.color.borderLight,
              }}
            >
              <Sparkles
                size={32}
                strokeWidth={1.5}
                style={{ color: tokens.color.primary }}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ fontSize: "1.05rem", mb: 0.5 }}
              >
                Search for anything
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem", maxWidth: 300 }}
              >
                Type a keyword, tag, or subreddit to find the perfect wallpaper
              </Typography>
            </Box>
          </MotionBox>
        )}
      </Box>

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setVisibleCount(PAGE_SIZE);
        }}
        onReset={() => {
          setFilters({
            sort: "relevance" as SortOption,
            resolution: "any",
            orientation: "any",
          });
          setVisibleCount(PAGE_SIZE);
        }}
      />

      <BottomNav />
    </Box>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton count={8} />}>
      <SearchContent />
    </Suspense>
  );
}
