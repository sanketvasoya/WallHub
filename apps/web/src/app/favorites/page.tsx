"use client";

import { Box, Typography, IconButton, Button } from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useFavorites } from "@/hooks/useFavorites";

function FavoritesContent() {
  const router = useRouter();
  const { favorites, wallpapers, count, isLoading, isError } = useFavorites();

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
            Favorites
          </Typography>
          {count > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontWeight: 500 }}>
              ({count})
            </Typography>
          )}
        </Box>
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
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
              }}
            >
              <FavoriteBorder sx={{ fontSize: 44, color: "text.secondary" }} />
            </Box>
          </motion.div>
          <Typography variant="h6" color="text.secondary" fontWeight={600} sx={{ fontSize: "1rem" }}>
            No favorites yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 280 }}>
            Tap the heart icon on any wallpaper to save it here
          </Typography>
          <Button variant="contained" onClick={() => router.push("/")} sx={{ mt: 2, borderRadius: 3 }}>
            Explore Wallpapers
          </Button>
        </Box>
      ) : isError ? (
        <ErrorState message="Failed to load favorites" onRetry={() => window.location.reload()} />
      ) : wallpapers.length === 0 ? (
        <ErrorState message="No wallpapers found for your favorites" />
      ) : (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: { xs: 1.5, sm: 2, md: 3 }, fontSize: "0.8rem" }}>
            Your saved wallpapers
          </Typography>
          <WallpaperGrid wallpapers={wallpapers} />
        </Box>
      )}

      <BottomNav />
    </Box>
  );
}

export default function FavoritesPage() {
  return <FavoritesContent />;
}
