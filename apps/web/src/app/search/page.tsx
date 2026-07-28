"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Box, Typography, Button } from "@mui/material";
import { FilterList, Search as SearchIcon } from "@mui/icons-material";
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
import type { SortOption } from "@/types";

const PAGE_SIZE = 20;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const { data, isLoading, isError, refetch } = useSearch(debouncedQuery, filters.sort, ratios, atleast);
  const allWallpapers = data?.wallpapers ?? [];

  // Filter client-side if orientation filter selected
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
      router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
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
        <PageHeader
          title="Search Wallpapers"
          subtitle="Explore millions of 4K wallpapers by keyword, tag, or topic"
          icon={<SearchIcon />}
          action={
            showResults ? (
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterList sx={{ fontSize: 18 }} />}
                onClick={() => setFilterOpen(true)}
                sx={{ borderRadius: 3, px: 2, textTransform: "none", fontWeight: 600 }}
              >
                Filter
              </Button>
            ) : undefined
          }
        />

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

        {showResults && (
          <>
            {isLoading ? (
              <LoadingSkeleton count={10} />
            ) : isError ? (
              <ErrorState message="Search failed" onRetry={() => refetch()} />
            ) : wallpapers.length === 0 ? (
              <ErrorState type="notFound" message={`No wallpapers found for "${debouncedQuery}"`} />
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 1, fontSize: "0.8rem", fontWeight: 500 }}>
                  Showing {wallpapers.length} of {filteredWallpapers.length} results for &quot;{debouncedQuery}&quot;
                </Typography>
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
      </Box>

      {/* Filter Sheet Modal */}
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setVisibleCount(PAGE_SIZE);
        }}
        onReset={() => {
          setFilters({ sort: "relevance" as SortOption, resolution: "any", orientation: "any" });
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

