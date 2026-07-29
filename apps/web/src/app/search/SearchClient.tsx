"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useQueries";
import { useSearchHistoryStore } from "@/lib/stores";
import { useOrientation } from "@/hooks/useOrientation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { tokens } from "@/lib/tokens";
import { TRENDING_SEARCHES } from "@/lib/constants";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ratios, atleast } = useOrientation();
  const { history, addSearch: addToHistory, clearHistory } = useSearchHistoryStore();

  useKeyboardShortcuts();

  const { data, isLoading, isError, refetch } = useSearch(query, "relevance", ratios, atleast);
  const wallpapers = data?.wallpapers ?? [];

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        addToHistory(trimmed);
        router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
      }
    },
    [query, addToHistory, router],
  );

  const handleTrending = useCallback(
    (term: string) => {
      setQuery(term);
      addToHistory(term);
      router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false });
    },
    [addToHistory, router],
  );

  const clearInput = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
    router.replace("/search", { scroll: false });
  }, [router]);

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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {TRENDING_SEARCHES.map((term) => (
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
            </Box>
          </Box>
        )}

        {hasQuery && (
          <Box sx={{ mt: 3 }}>
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
                <Typography variant="body2" sx={{ color: tokens.color.textSecondary, mb: 2, fontSize: "0.8rem" }}>
                  {data?.totalResults ?? wallpapers.length} results for &quot;{query}&quot;
                </Typography>
                <WallpaperGrid wallpapers={wallpapers} />
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
