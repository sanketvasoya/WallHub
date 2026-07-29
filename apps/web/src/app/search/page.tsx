"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useSearch } from "@/hooks/useQueries";
import { useOrientation } from "@/hooks/useOrientation";
import { tokens } from "@/lib/tokens";

const PAGE_SIZE = 20;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { ratios, atleast } = useOrientation();
  const { data, isLoading, isError, refetch } = useSearch(
    debouncedQuery,
    "relevance",
    ratios,
    atleast
  );
  const allWallpapers = data?.wallpapers ?? [];
  const wallpapers = allWallpapers.slice(0, visibleCount);
  const hasMore = visibleCount < allWallpapers.length;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setDebouncedQuery(query.trim());
      setVisibleCount(PAGE_SIZE);
      router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
    }
  };

  const showResults = debouncedQuery.trim().length > 0;

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />
      <div style={{ padding: "16px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 40, height: 40, borderRadius: "50%", border: "none",
              background: tokens.color.surface, color: tokens.color.textSecondary,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wallpapers"
              aria-label="Search wallpapers"
              style={{
                width: "100%",
                height: 48,
                borderRadius: tokens.radius.pill,
                padding: "0 20px",
                border: "none",
                background: tokens.color.surface,
                color: tokens.color.textPrimary,
                fontSize: "0.875rem",
                outline: "none",
                boxShadow: tokens.shadow.subtle,
              }}
            />
          </form>
        </div>

        {showResults && (
          <>
            {isLoading ? (
              <LoadingSkeleton count={10} />
            ) : isError ? (
              <ErrorState message="Search failed" onRetry={() => refetch()} />
            ) : wallpapers.length === 0 ? (
              <ErrorState
                type="notFound"
                message={`No results for "${debouncedQuery}"`}
              />
            ) : (
              <>
                <div style={{ fontSize: "0.8rem", color: tokens.color.textSecondary, marginBottom: 12, marginLeft: 4 }}>
                  {allWallpapers.length} results for &ldquo;{debouncedQuery}&rdquo;
                </div>
                <WallpaperGrid wallpapers={wallpapers} />
                {hasMore && (
                  <div ref={sentinelRef} style={{ padding: "16px 0" }}>
                    <LoadingSkeleton count={4} />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!showResults && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", gap: 16, textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: tokens.radius.card,
              background: tokens.color.surface, border: `1px solid ${tokens.color.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: tokens.color.primary,
            }}>
              <Search size={32} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: tokens.color.textPrimary }}>
              Search wallpapers
            </div>
            <div style={{ fontSize: "0.85rem", color: tokens.color.textSecondary, maxWidth: 300, lineHeight: 1.5 }}>
              Type a keyword to find the perfect wallpaper
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton count={8} />}>
      <SearchContent />
    </Suspense>
  );
}
