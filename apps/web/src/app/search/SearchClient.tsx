"use client";

import { Suspense, useState, useCallback, useRef } from "react";
import { Box, Typography, Chip, Select, MenuItem, FormControl } from "@mui/material";
import { Search, X, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch, useTrendingSearches } from "@/hooks/useQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSearchHistoryStore } from "@/lib/stores";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { tokens } from "@/lib/tokens";

type OrientationFilter = "all" | "portrait" | "landscape" | "square";
type ResolutionFilter = "all" | "4k" | "1080p" | "1440p";
type SortOption = "relevance" | "date" | "popularity" | "resolution";

const ORIENTATION_OPTIONS: { value: OrientationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "square", label: "Square" },
];

const RESOLUTION_OPTIONS: { value: ResolutionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "4k", label: "4K" },
  { value: "1080p", label: "1080p" },
  { value: "1440p", label: "1440p" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Date" },
  { value: "popularity", label: "Popularity" },
  { value: "resolution", label: "Resolution" },
];

function getResolutionParams(resolution: ResolutionFilter): { atleast?: string; ratios?: string } {
  switch (resolution) {
    case "4k":
      return { atleast: "3840x2160" };
    case "1080p":
      return { atleast: "1920x1080" };
    case "1440p":
      return { atleast: "2560x1440" };
    default:
      return {};
  }
}

function getOrientationRatios(orientation: OrientationFilter): string | undefined {
  switch (orientation) {
    case "portrait":
      return "9x16,9x18,9x19,9x20,10x16";
    case "landscape":
      return "16x9,16x10,21x9,32x9";
    case "square":
      return "1x1";
    default:
      return undefined;
  }
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialOrientation = (searchParams.get("orientation") as OrientationFilter) || "all";
  const initialResolution = (searchParams.get("resolution") as ResolutionFilter) || "all";
  const initialSort = (searchParams.get("sort") as SortOption) || "relevance";
  
  const [query, setQuery] = useState(initialQuery);
  const [orientation, setOrientation] = useState<OrientationFilter>(initialOrientation);
  const [resolution, setResolution] = useState<ResolutionFilter>(initialResolution);
  const [sort, setSort] = useState<SortOption>(initialSort);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { history, addSearch: addToHistory, clearHistory } = useSearchHistoryStore();
  const { data: trendingSearches = [], isLoading: isLoadingTrending } = useTrendingSearches();

  const ratios = getOrientationRatios(orientation);
  const { atleast } = getResolutionParams(resolution);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearch(query, sort, ratios, atleast);

  const wallpapers = data?.pages.flatMap((page) => page.wallpapers) ?? [];
  const totalResults = data?.pages[0]?.totalResults ?? 0;

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  const updateUrlParams = useCallback(
    (newOrientation: OrientationFilter, newResolution: ResolutionFilter, newSort: SortOption) => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (newOrientation !== "all") params.set("orientation", newOrientation);
      if (newResolution !== "all") params.set("resolution", newResolution);
      if (newSort !== "relevance") params.set("sort", newSort);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    },
    [query, router],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        addToHistory(trimmed);
        updateUrlParams(orientation, resolution, sort);
      }
    },
    [query, addToHistory, orientation, resolution, sort, updateUrlParams],
  );

  const handleTrending = useCallback(
    (term: string) => {
      setQuery(term);
      addToHistory(term);
      updateUrlParams(orientation, resolution, sort);
    },
    [addToHistory, orientation, resolution, sort, updateUrlParams],
  );

  const clearInput = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
    router.replace("/search", { scroll: false });
  }, [router]);

  const handleOrientationChange = useCallback(
    (value: OrientationFilter) => {
      setOrientation(value);
      updateUrlParams(value, resolution, sort);
    },
    [resolution, sort, updateUrlParams],
  );

  const handleResolutionChange = useCallback(
    (value: ResolutionFilter) => {
      setResolution(value);
      updateUrlParams(orientation, value, sort);
    },
    [orientation, sort, updateUrlParams],
  );

  const handleSortChange = useCallback(
    (value: SortOption) => {
      setSort(value);
      updateUrlParams(orientation, resolution, value);
    },
    [orientation, resolution, updateUrlParams],
  );

  const clearFilters = useCallback(() => {
    setOrientation("all");
    setResolution("all");
    setSort("relevance");
    updateUrlParams("all", "all", "relevance");
  }, [updateUrlParams]);

  const hasFilters = orientation !== "all" || resolution !== "all" || sort !== "relevance";
  const activeFilterCount = (orientation !== "all" ? 1 : 0) + (resolution !== "all" ? 1 : 0) + (sort !== "relevance" ? 1 : 0);

  const hasQuery = query.trim().length > 0;

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 }, minHeight: "100vh" }}>
      <Header />
      <Box sx={{ px: { xs: 3, sm: 4 }, maxWidth: 800, mx: "auto", pt: 2 }}>
        <form onSubmit={handleSubmit} role="search">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: tokens.radius.pill,
              background: tokens.color.surface,
              border: `1px solid ${tokens.color.border}`,
              px: 2,
              height: 52,
              transition: "border-color 0.2s ease",
              "&:focus-within": {
                borderColor: tokens.color.primary,
              },
            }}
          >
            <Search size={18} color={tokens.color.textSecondary} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wallpapers..."
              aria-label="Search wallpapers"
              autoComplete="off"
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: tokens.color.textPrimary,
                fontSize: "0.9375rem",
                fontWeight: 500,
                outline: "none",
                padding: "0 12px",
                height: "100%",
              }}
            />
            {hasQuery && (
              <button
                type="button"
                onClick={clearInput}
                aria-label="Clear search"
                style={{
                  width: 28, height: 28, borderRadius: "50%", border: "none",
                  background: tokens.color.surfaceVariant, color: tokens.color.textSecondary,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={14} />
              </button>
            )}
          </Box>
        </form>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: tokens.color.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Orientation
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>
            {ORIENTATION_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => handleOrientationChange(option.value)}
                variant={orientation === option.value ? "filled" : "outlined"}
                sx={{
                  height: 44,
                  borderRadius: tokens.radius.pill,
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  ...(orientation === option.value
                    ? {
                        background: tokens.color.primary,
                        color: tokens.color.bg,
                        "&:hover": { background: tokens.color.primaryLight },
                      }
                    : {
                        background: tokens.color.surfaceVariant,
                        color: tokens.color.textSecondary,
                        borderColor: tokens.color.border,
                        "&:hover": { background: tokens.color.surfaceElevated },
                      }),
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: tokens.color.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Resolution
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>
            {RESOLUTION_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => handleResolutionChange(option.value)}
                variant={resolution === option.value ? "filled" : "outlined"}
                sx={{
                  height: 44,
                  borderRadius: tokens.radius.pill,
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  ...(resolution === option.value
                    ? {
                        background: tokens.color.primary,
                        color: tokens.color.bg,
                        "&:hover": { background: tokens.color.primaryLight },
                      }
                    : {
                        background: tokens.color.surfaceVariant,
                        color: tokens.color.textSecondary,
                        borderColor: tokens.color.border,
                        "&:hover": { background: tokens.color.surfaceElevated },
                      }),
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: tokens.color.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Sort by
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              sx={{
                height: 44,
                borderRadius: tokens.radius.pill,
                background: tokens.color.surfaceVariant,
                color: tokens.color.textPrimary,
                fontSize: "0.8rem",
                fontWeight: 500,
                "& .MuiSelect-select": {
                  py: 1,
                  px: 2,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: `1px solid ${tokens.color.border}`,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: tokens.color.borderHover,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: tokens.color.primary,
                },
              }}
              IconComponent={ChevronDown}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: sort === option.value ? 600 : 400,
                    color: sort === option.value ? tokens.color.primary : tokens.color.textPrimary,
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {hasFilters && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="caption" sx={{ fontSize: "0.75rem", color: tokens.color.textSecondary }}>
              {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} active
            </Typography>
            <button
              onClick={clearFilters}
              style={{
                background: "none",
                border: "none",
                color: tokens.color.primary,
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 500,
                padding: "4px 8px",
                borderRadius: tokens.radius.button,
              }}
            >
              Clear all
            </button>
          </Box>
        )}

        {!hasQuery && (
          <Box sx={{ mt: 3 }}>
            {history.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: tokens.color.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Recent Searches
                  </Typography>
                  <button
                    onClick={clearHistory}
                    style={{
                      background: "none", border: "none", color: tokens.color.textTertiary,
                      cursor: "pointer", fontSize: "0.75rem", fontWeight: 500,
                    }}
                  >
                    Clear
                  </button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {history.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleTrending(term)}
                      style={{
                        padding: "6px 14px", borderRadius: tokens.radius.pill,
                        border: `1px solid ${tokens.color.border}`, background: tokens.color.surface,
                        color: tokens.color.textSecondary, cursor: "pointer", fontSize: "0.8rem",
                        fontWeight: 500, transition: "all 0.2s ease",
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: tokens.color.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", mb: 1.5, display: "block" }}>
                Trending Searches
              </Typography>
              {isLoadingTrending ? (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-shimmer"
                      style={{
                        width: 80,
                        height: 32,
                        borderRadius: tokens.radius.pill,
                        background: tokens.color.surfaceVariant,
                      }}
                    />
                  ))}
                </Box>
              ) : trendingSearches.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleTrending(term)}
                      style={{
                        padding: "6px 14px", borderRadius: tokens.radius.pill,
                        border: `1px solid ${tokens.color.border}`, background: tokens.color.surface,
                        color: tokens.color.textSecondary, cursor: "pointer", fontSize: "0.8rem",
                        fontWeight: 500, transition: "all 0.2s ease",
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </Box>
              ) : null}
            </Box>
          </Box>
        )}

        {hasQuery && (
          <Box sx={{ mt: 3, animation: "fadeInUp 0.4s ease-out forwards" }}>
            {isLoading ? (
              <LoadingSkeleton count={10} />
            ) : isError ? (
              <ErrorState
                type="network"
                message="Search failed"
                onRetry={() => refetch()}
              />
            ) : wallpapers.length > 0 ? (
              <>
                <Typography variant="body2" sx={{ color: tokens.color.textSecondary, mb: 2, fontSize: "0.8rem", fontWeight: 500 }}>
                  {totalResults} results for &quot;{query}&quot;
                </Typography>
                <WallpaperGrid wallpapers={wallpapers} />
                {isFetchingNextPage && (
                  <Box sx={{ py: 2 }}>
                    <LoadingSkeleton count={4} />
                  </Box>
                )}
                <div ref={sentinelRef} style={{ height: 1 }} />
              </>
            ) : (
              <ErrorState
                type="empty"
                message={`No results for "${query}"`}
                description="Try different keywords or browse trending searches."
              />
            )}
          </Box>
        )}
      </Box>
      <BottomNav />
    </Box>
  );
}

export default function SearchClient() {
  return (
    <Suspense fallback={<LoadingSkeleton count={5} />}>
      <SearchContent />
    </Suspense>
  );
}
