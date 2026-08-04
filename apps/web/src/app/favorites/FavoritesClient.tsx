"use client";

import { useState, useMemo } from "react";
import { Search, Heart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoritesStore } from "@/lib/stores";
import { tokens } from "@/lib/tokens";

export default function FavoritesClient() {
  const router = useRouter();
  const { wallpapers, count, isLoading, isError, refetch } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWallpapers = useMemo(() => {
    if (!searchQuery.trim()) return wallpapers;
    const q = searchQuery.toLowerCase();
    return wallpapers.filter(
      (w) =>
        w.title?.toLowerCase().includes(q) ||
        w.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [wallpapers, searchQuery]);

  const clearFavorites = () => {
    if (window.confirm("Remove all favorites?")) {
      useFavoritesStore.setState({ favorites: [] });
    }
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />

      <div style={{ padding: "16px 24px 8px" }}>
        <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: tokens.radius.button,
              background: `linear-gradient(135deg, ${tokens.color.primaryAlpha20}, ${tokens.color.primaryAlpha10})`,
              display: "flex",
              alignItems: "center", justifyContent: "center", color: tokens.color.primary,
            }}>
              <Heart size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: tokens.color.textPrimary, letterSpacing: "-0.02em" }}>
                Favorites
              </h1>
              {count > 0 && (
                <span style={{ fontSize: "0.8rem", color: tokens.color.textSecondary }}>
                  {count} saved
                </span>
              )}
            </div>
          </div>
          {count > 0 && (
            <button
              onClick={clearFavorites}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: tokens.radius.button,
                border: "none", background: tokens.color.errorAlpha10,
                color: tokens.color.error, fontSize: "0.78rem", fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>

        {count > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0 16px", height: 44, borderRadius: tokens.radius.pill,
              background: tokens.color.surface,
              border: `1px solid ${tokens.color.border}`,
            }}>
              <Search size={18} color={tokens.color.textTertiary} />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, border: "none", background: "transparent",
                  color: tokens.color.textPrimary, fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton count={8} variant="list" />
      ) : count === 0 ? (
        <ErrorState
          type="empty"
          message="No favorites yet"
          description="Tap the heart icon on any wallpaper to add it to your favorites."
          action={{ label: "Browse Wallpapers", onClick: () => router.push("/") }}
        />
      ) : isError ? (
        <ErrorState
          message="Failed to load favorites"
          onRetry={() => refetch()}
        />
      ) : filteredWallpapers.length === 0 ? (
        <ErrorState type="notFound" message={`No favorites match "${searchQuery}"`} />
      ) : (
        <WallpaperGrid wallpapers={filteredWallpapers} />
      )}

      <BottomNav />
    </div>
  );
}
