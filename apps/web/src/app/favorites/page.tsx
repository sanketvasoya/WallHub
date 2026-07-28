"use client";

import { useState, useMemo } from "react";
import { Box, Typography, Button, TextField, InputAdornment, Chip } from "@mui/material";
import { FavoriteBorder, Favorite as FavoriteIcon, Search as SearchIcon, DeleteSweep } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoritesStore } from "@/lib/stores";

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
        w.subreddit?.toLowerCase().includes(q) ||
        w.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [wallpapers, searchQuery]);

  const clearFavorites = () => {
    if (window.confirm("Are you sure you want to remove all wallpapers from your favorites?")) {
      useFavoritesStore.setState({ favorites: [] });
    }
  };

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <PageHeader
          title="Favorites"
          subtitle={count > 0 ? `${count} saved wallpapers` : "Your saved wallpaper collection"}
          icon={<FavoriteIcon sx={{ color: "error.main" }} />}
          action={
            count > 0 ? (
              <Chip
                label="Clear All"
                onClick={clearFavorites}
                icon={<DeleteSweep sx={{ fontSize: 16 }} />}
                size="small"
                sx={{
                  bgcolor: "rgba(244,67,54,0.1)",
                  color: "#f44336",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(244,67,54,0.2)" },
                }}
              />
            ) : undefined
          }
        />

        {count > 0 && (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search in favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, fontSize: "0.85rem" },
              }}
            />
          </Box>
        )}
      </Box>

      {isLoading ? (
        <LoadingSkeleton count={8} />
      ) : count === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            gap: 2,
            px: 3,
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
              }}
            >
              <FavoriteBorder sx={{ fontSize: 42, color: "text.secondary" }} />
            </Box>
          </motion.div>
          <Typography variant="h6" color="text.primary" fontWeight={700} sx={{ fontSize: "1.1rem" }}>
            No favorites yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 300, fontSize: "0.85rem" }}>
            Tap the heart icon on any wallpaper card to save it here for quick access
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            sx={{ mt: 1.5, borderRadius: 3, px: 3 }}
          >
            Explore Wallpapers
          </Button>
        </Box>
      ) : isError ? (
        <ErrorState message="Failed to load favorites" />
      ) : filteredWallpapers.length === 0 ? (
        <ErrorState type="notFound" message={`No favorites match "${searchQuery}"`} />
      ) : (
        <Box sx={{ mt: 1 }}>
          <WallpaperGrid wallpapers={filteredWallpapers} />
        </Box>
      )}

      <BottomNav />
    </Box>
  );
}

export default function FavoritesPage() {
  return <FavoritesContent />;
}

