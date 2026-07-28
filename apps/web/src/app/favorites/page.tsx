"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Heart,
  HeartOff,
  Search,
  Trash2,
  Compass,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoritesStore } from "@/lib/stores";
import { tokens } from "@/lib/tokens";

const MotionBox = motion.create(Box);

function FavoritesContent() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
    if (
      window.confirm(
        "Are you sure you want to remove all wallpapers from your favorites?"
      )
    ) {
      useFavoritesStore.setState({ favorites: [] });
    }
  };

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: tokens.animation.curve.standard }}
        >
          <PageHeader
            title="Favorites"
            subtitle={
              count > 0
                ? `${count} saved wallpapers`
                : "Your saved wallpaper collection"
            }
            icon={<Heart size={18} strokeWidth={2.2} />}
            action={
              count > 0 ? (
                <Chip
                  label="Clear All"
                  onClick={clearFavorites}
                  icon={<Trash2 size={14} />}
                  size="small"
                  sx={{
                    bgcolor: isDark ? tokens.color.errorAlpha : tokens.color.errorAlpha,
                    color: tokens.color.error,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(239, 68, 68, 0.15)",
                    },
                  }}
                />
              ) : undefined
            }
          />
        </MotionBox>

        {count > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: tokens.animation.curve.standard }}
          >
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search in favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          size={18}
                          style={{ color: tokens.color.textDarkSecondary }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 100,
                    fontSize: "0.85rem",
                    height: 44,
                    bgcolor: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
                    border: "1px solid",
                    borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: isDark ? tokens.color.borderDarkHover : tokens.color.borderLightHover,
                    },
                    "&.Mui-focused": {
                      borderColor: "primary.main",
                    },
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>
          </MotionBox>
        )}
      </Box>

      {isLoading ? (
        <LoadingSkeleton count={8} />
      ) : count === 0 ? (
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: tokens.animation.curve.standard }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              gap: 2.5,
              px: 3,
            }}
          >
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
                border: "1px solid",
                borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
              }}
            >
              <HeartOff
                size={40}
                strokeWidth={1.5}
                style={{ color: tokens.color.textDarkSecondary }}
              />
            </Box>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={700}
              sx={{ fontSize: "1.1rem" }}
            >
              No favorites yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: "center",
                maxWidth: 300,
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
            >
              Tap the heart icon on any wallpaper card to save it here for quick
              access
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/")}
              startIcon={<Compass size={16} />}
              sx={{
                mt: 1,
                borderRadius: 2.5,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: isDark ? tokens.shadows.dark.primary : tokens.shadows.light.primary,
                "&:hover": {
                  boxShadow: isDark ? tokens.shadows.dark.lg : tokens.shadows.light.lg,
                },
              }}
            >
              Explore Wallpapers
            </Button>
          </Box>
        </MotionBox>
      ) : isError ? (
        <ErrorState message="Failed to load favorites" />
      ) : filteredWallpapers.length === 0 ? (
        <ErrorState
          type="notFound"
          message={`No favorites match "${searchQuery}"`}
        />
      ) : (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Box sx={{ mt: 1 }}>
            <WallpaperGrid wallpapers={filteredWallpapers} />
          </Box>
        </MotionBox>
      )}

      <BottomNav />
    </Box>
  );
}

export default function FavoritesPage() {
  return <FavoritesContent />;
}
