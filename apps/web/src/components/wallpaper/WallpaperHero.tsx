"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
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

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [heroItems.length, next]);

  const currentWallpaper = heroItems[currentIndex];

  return (
    <Box sx={{ position: "relative", mx: { xs: 0, sm: 2, md: 3 }, mt: 0 }}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: tokens.animation.curve.standard }}
        sx={{
          position: "relative",
          height: { xs: 380, sm: 440, md: 520 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: { xs: 0, sm: tokens.radius["2xl"], md: tokens.radius["2xl"] },
        }}
      >
        {/* Background image carousel or fallback gradient */}
        <AnimatePresence mode="wait">
          {currentWallpaper ? (
            <motion.img
              key={currentWallpaper.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: tokens.animation.curve.standard }}
              src={currentWallpaper.preview || currentWallpaper.image}
              alt="Hero wallpaper backdrop"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.5) saturate(1.1)",
              }}
            />
          ) : (
            <Box
              key="fallback-bg"
              sx={{
                position: "absolute",
                inset: 0,
                background: isDark
                  ? `linear-gradient(160deg, ${tokens.color.bgDark} 0%, #12083a 30%, #0a1628 60%, ${tokens.color.bgDark} 100%)`
                  : `linear-gradient(160deg, #eef0ff 0%, #e8ecff 30%, #f5f0ff 60%, ${tokens.color.bgLight} 100%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Ambient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? `linear-gradient(180deg, transparent 0%, rgba(9,9,11,0.4) 40%, rgba(9,9,11,0.95) 100%)`
              : `linear-gradient(180deg, transparent 0%, rgba(250,251,255,0.4) 40%, rgba(250,251,255,0.95) 100%)`,
            zIndex: 1,
          }}
        />

        {/* Hero content */}
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
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: tokens.animation.curve.standard }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                mb: 1.5,
                background: currentWallpaper
                  ? "linear-gradient(135deg, #ffffff 0%, #e2e2e2 100%)"
                  : tokens.gradient.text,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: currentWallpaper ? "none" : "none",
              }}
            >
              Discover Beautiful
              <br />
              Wallpapers
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.25, ease: tokens.animation.curve.standard }}
          >
            <Typography
              variant="body1"
              sx={{
                mb: 3.5,
                maxWidth: 440,
                mx: "auto",
                fontWeight: 500,
                lineHeight: 1.6,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                color: currentWallpaper ? "rgba(255,255,255,0.8)" : "text.secondary",
                letterSpacing: "0.005em",
              }}
            >
              Stunning wallpapers in 4K resolution.
              <br />
              Free to download, curated for high performance.
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.4, ease: tokens.animation.curve.standard }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <SearchBar />
          </MotionBox>

          {/* Carousel indicators */}
          {heroItems.length > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.75,
                mt: 3,
              }}
            >
              {heroItems.map((item, i) => (
                <Box
                  key={item.id}
                  onClick={() => setCurrentIndex(i)}
                  sx={{
                    width: i === currentIndex ? 28 : 8,
                    height: 8,
                    borderRadius: "8px",
                    bgcolor:
                      i === currentIndex
                        ? tokens.color.primary
                        : isDark
                          ? "rgba(255,255,255,0.25)"
                          : "rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    "&:hover": {
                      bgcolor:
                        i === currentIndex
                          ? tokens.color.primary
                          : isDark
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.35)",
                    },
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
