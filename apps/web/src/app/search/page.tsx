"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SearchInput from "@/components/ui/SearchInput";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useSearch } from "@/hooks/useQueries";

const PAGE_SIZE = 20;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError } = useSearch(debouncedQuery);
  const allWallpapers = data?.wallpapers ?? [];
  const wallpapers = allWallpapers.slice(0, visibleCount);
  const hasMore = visibleCount < allWallpapers.length;

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <IconButton
            onClick={() => router.back()}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
            Search
          </Typography>
        </Box>

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
              <ErrorState message="Search failed" onRetry={() => window.location.reload()} />
            ) : wallpapers.length === 0 ? (
              <ErrorState message={`No results for "${debouncedQuery}"`} />
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 1, fontSize: "0.8rem", fontWeight: 500 }}>
                  {allWallpapers.length} results for &quot;{debouncedQuery}&quot;
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
