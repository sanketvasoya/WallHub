"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, ToggleButtonGroup, ToggleButton, IconButton, Button } from "@mui/material";
import { Whatshot, NewReleases, TrendingUp, FilterList } from "@mui/icons-material";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import FilterSheet, { type FilterState } from "@/components/wallpaper/FilterSheet";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useWallpapers, useCategory } from "@/hooks/useQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSortPersistenceStore } from "@/lib/stores";
import { useOrientation } from "@/hooks/useOrientation";
import type { SortOption } from "@/types";

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "hot", label: "Hot", icon: <Whatshot sx={{ fontSize: 16 }} /> },
  { value: "new", label: "New", icon: <NewReleases sx={{ fontSize: 16 }} /> },
  { value: "top", label: "Top", icon: <TrendingUp sx={{ fontSize: 16 }} /> },
];

function CategoryContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "trending";
  const getSort = useSortPersistenceStore((s) => s.getSort);
  const setSortStore = useSortPersistenceStore((s) => s.setSort);
  const [sort, setSort] = useState<SortOption>(() => getSort(slug));
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sort: getSort(slug),
    resolution: "any",
    orientation: "any",
  });

  const { ratios, atleast } = useOrientation();
  const { data: categoryData } = useCategory(slug);

  useEffect(() => {
    const s = getSort(slug);
    setSort(s);
    setFilters((prev) => ({ ...prev, sort: s }));
  }, [slug, getSort]);

  const handleSortChange = (_: unknown, value: SortOption | null) => {
    if (!value) return;
    setSort(value);
    setSortStore(slug, value);
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useWallpapers(slug, sort, ratios, atleast);

  const rawWallpapers = data?.pages.flatMap((p) => p.wallpapers) ?? [];

  // Filter client-side if additional filters selected
  const wallpapers = useMemo(() => {
    return rawWallpapers.filter((w) => {
      if (filters.orientation !== "any" && w.orientation !== filters.orientation) {
        return false;
      }
      return true;
    });
  }, [rawWallpapers, filters]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  const categoryName = categoryData?.category?.name || slug.replace(/-/g, " ");

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <PageHeader
          title={categoryName}
          subtitle={categoryData?.category?.description || `Explore handpicked ${categoryName} wallpapers`}
          breadcrumbs={[{ label: "Categories", href: "/category/trending" }, { label: categoryName }]}
          action={
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterList sx={{ fontSize: 18 }} />}
              onClick={() => setFilterOpen(true)}
              sx={{ borderRadius: 3, px: 2, textTransform: "none", fontWeight: 600 }}
            >
              Filter
            </Button>
          }
        />

        {/* Sort controls */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, overflowX: "auto", pb: 0.5 }}>
          <ToggleButtonGroup
            value={sort}
            exclusive
            onChange={handleSortChange}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: "10px !important",
                border: "1px solid",
                borderColor: (theme) => `${theme.palette.divider} !important`,
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

      {/* Main Grid Content */}
      {isLoading ? (
        <LoadingSkeleton count={12} />
      ) : isError ? (
        <ErrorState message="Failed to load wallpapers" onRetry={() => refetch()} />
      ) : wallpapers.length === 0 ? (
        <ErrorState type="empty" message="No wallpapers found matching your filters" />
      ) : (
        <WallpaperGrid wallpapers={wallpapers} />
      )}

      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <LoadingSkeleton count={4} />
        </Box>
      )}

      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}

      {/* Filter Sheet Modal */}
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setSort(newFilters.sort);
          setSortStore(slug, newFilters.sort);
        }}
        onReset={() => {
          setFilters({ sort: "hot", resolution: "any", orientation: "any" });
          setSort("hot");
          setSortStore(slug, "hot");
        }}
      />

      <BottomNav />
    </Box>
  );
}

export default function CategoryPage() {
  return <CategoryContent />;
}

