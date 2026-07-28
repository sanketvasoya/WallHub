"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { tokens } from "@/lib/tokens";
import type { Wallpaper } from "@/types";

const MotionBox = motion.create(Box);

interface WallpaperHeroProps {
  wallpapers?: Wallpaper[];
}

export default function WallpaperHero({ wallpapers = [] }: WallpaperHeroProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroItems = wallpapers.slice(0, 5);

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const currentWallpaper = heroItems[currentIndex];

  return (
    <Box sx={{ position: "relative", mx: { xs: 0, sm: 2, md: 3 }, mt: 0 }}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: "relative",
          height: { xs: 380, sm: 440, md: 520 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: { xs: 0, sm: 4, md: 4 },
        }}
      >
        {/* Background Image Carousel or Gradient Fallback */}
        <AnimatePresence mode="wait">
          {currentWallpaper ? (
            <motion.img
              key={currentWallpaper.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              src={currentWallpaper.preview || currentWallpaper.image}
              alt="Hero Wallpaper Backdrop"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.55)",
              }}
            />
          ) : (
            <Box
              key="fallback-bg"
              sx={{
                position: "absolute",
                inset: 0,
                background: isDark
                  ? "linear-gradient(160deg, #0a0020 0%, #15003a 25%, #001a2e 50%, #05050a 100%)"
                  : "linear-gradient(160deg, #e8eaf6 0%, #e3f2fd 25%, #f3e5f5 50%, #f8f8fc 100%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Ambient Overlay Gradients */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? tokens.gradient.hero
              : tokens.gradient.heroLight,
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            px: { xs: 3, sm: 4, md: 6 },
            pb: { xs: 6, sm: 8 },
            zIndex: 2,
            width: "100%",
          }}
        >
          <MotionBox
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="h1"
              fontWeight={800}
              sx={{
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.8rem" },
                mb: 1.5,
                lineHeight: 1.1,
                background: currentWallpaper ? "linear-gradient(135deg, #ffffff, #e0e0e0)" : tokens.gradient.text,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                dropShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              Discover Wallpapers
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="body1"
              sx={{
                mb: 3.5,
                maxWidth: 440,
                mx: "auto",
                fontWeight: 500,
                lineHeight: 1.6,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                color: currentWallpaper ? "rgba(255,255,255,0.85)" : "text.secondary",
                textShadow: currentWallpaper ? "0 1px 4px rgba(0,0,0,0.6)" : "none",
              }}
            >
              Stunning wallpapers in 4K resolution.
              Free to download, curated for high performance.
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <SearchBar />
          </MotionBox>

          {/* Carousel Indicators */}
          {heroItems.length > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 3,
              }}
            >
              {heroItems.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  sx={{
                    width: i === currentIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: i === currentIndex ? "primary.main" : "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </MotionBox>
    </Box>
  );
}
