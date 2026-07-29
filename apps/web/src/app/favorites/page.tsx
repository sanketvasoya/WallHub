"use client";

import { useState, useMemo } from "react";
import { InputAdornment } from "@mui/material";
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

function FavoritesContent() {
  const router = useRouter();
  const { wallpapers, count, isLoading, isError } = useFavorites();
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: tokens.radius.button,
              background: tokens.color.primaryAlpha20, display: "flex",
              alignItems: "center", justifyContent: "center", color: tokens.color.primary,
            }}>
              <Heart size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: tokens.color.textPrimary }}>
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
        <LoadingSkeleton count={8} />
      ) : count === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", gap: 16, textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: tokens.radius.card,
            background: tokens.color.surface, border: `1px solid ${tokens.color.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: tokens.color.textTertiary,
          }}>
            <Heart size={36} strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: tokens.color.textPrimary }}>
            No favorites yet
          </div>
          <div style={{ fontSize: "0.85rem", color: tokens.color.textSecondary, maxWidth: 300, lineHeight: 1.5 }}>
            Tap the heart icon on any wallpaper to save it here
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "10px 24px", borderRadius: tokens.radius.button,
              border: "none", background: tokens.color.primary, color: "#fff",
              fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
              marginTop: 8,
            }}
          >
            Browse Wallpapers
          </button>
        </div>
      ) : isError ? (
        <ErrorState message="Failed to load favorites" />
      ) : filteredWallpapers.length === 0 ? (
        <ErrorState type="notFound" message={`No favorites match "${searchQuery}"`} />
      ) : (
        <WallpaperGrid wallpapers={filteredWallpapers} />
      )}

      <BottomNav />
    </div>
  );
}

export default function FavoritesPage() {
  return <FavoritesContent />;
}
