"use client";

import { useState, Suspense } from "react";
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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(!!initialQuery);

  const { data, isLoading, isError } = useSearch(query);
  const wallpapers = data?.wallpapers ?? [];

  const handleSubmit = () => {
    if (query.trim()) {
      setSubmitted(true);
      router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
    }
  };

  const handleSelect = (term: string) => {
    setQuery(term);
    setSubmitted(true);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

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
            onChange={(v) => {
              setQuery(v);
              if (!v) setSubmitted(false);
            }}
            onSubmit={handleSubmit}
            onSelect={handleSelect}
            autoFocus
            showSuggestions={!submitted}
          />
        </Box>

        {submitted && (
          <>
            {isLoading ? (
              <LoadingSkeleton count={10} />
            ) : isError ? (
              <ErrorState message="Search failed" onRetry={() => window.location.reload()} />
            ) : wallpapers.length === 0 ? (
              <ErrorState message={`No results for "${query}"`} />
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 1, fontSize: "0.8rem", fontWeight: 500 }}>
                  {wallpapers.length} results for &quot;{query}&quot;
                </Typography>
                <WallpaperGrid wallpapers={wallpapers} />
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
