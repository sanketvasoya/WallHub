"use client";

import { useCallback, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  Download,
  Share,
  BrokenImage,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import { getResolutionBadge } from "@/lib/utils";
import type { Wallpaper } from "@/types";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  index?: number;
  variant?: "grid" | "masonry";
}

function formatUpvotes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function WallpaperCard({ wallpaper, index = 0, variant = "grid" }: WallpaperCardProps) {
  const [imgError, setImgError] = useState(false);
  const { isFavorite, handleDownload, handleShare, handleToggleFavorite } = useWallpaperActions(wallpaper);

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleToggleFavorite();
    },
    [handleToggleFavorite]
  );

  const handleDownloadClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleDownload();
    },
    [handleDownload]
  );

  const handleShareClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleShare();
    },
    [handleShare]
  );

  const delay = Math.min(index * 0.04, 0.5);
  const resBadge = getResolutionBadge(wallpaper.width, wallpaper.height);
  
  // Calculate dynamic aspect ratio for grid layout
  const aspectRatio = variant === "masonry" 
    ? `${wallpaper.width} / ${wallpaper.height}`
    : wallpaper.orientation === "portrait" 
      ? "3/4" 
      : "16/9";

  return (
    <NextLink href={`/wallpaper/${wallpaper.id}`} style={{ textDecoration: "none" }}>
      <motion.div
        role="article"
        aria-label={wallpaper.title || `Wallpaper ${wallpaper.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.018, transition: { duration: 0.25 } }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 3.5,
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            "&:hover .wallpaper-img": {
              transform: "scale(1.06)",
            },
            "&:hover .wallpaper-actions": {
              opacity: 1,
              transform: "translateY(0)",
            },
            "&:hover .wallpaper-info": {
              opacity: 1,
              transform: "translateY(0)",
            },
            "&:hover .wallpaper-gradient": {
              opacity: 1,
            },
          }}
        >
          {!imgError ? (
            <Box
              component="img"
              src={wallpaper.preview || wallpaper.thumbnail}
              alt={wallpaper.title || `Wallpaper ${wallpaper.id}`}
              loading="lazy"
              decoding="async"
              className="wallpaper-img"
              onError={() => setImgError(true)}
              sx={{
                width: "100%",
                display: "block",
                aspectRatio,
                objectFit: "cover",
                transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                borderRadius: 3.5,
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16/9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                borderRadius: 3.5,
                gap: 1,
                color: "text.secondary",
              }}
            >
              <BrokenImage sx={{ fontSize: 32, opacity: 0.5 }} />
              <Typography variant="caption">Image preview unavailable</Typography>
            </Box>
          )}

          <Box
            className="wallpaper-gradient"
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(5,5,10,0.85) 0%, rgba(5,5,10,0.2) 50%, rgba(0,0,0,0) 100%)",
              opacity: 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
              borderRadius: 3.5,
            }}
          />

          {/* Top Badges */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Box
                sx={{
                  px: 1,
                  py: 0.3,
                  borderRadius: 1.5,
                  backdropFilter: "blur(12px)",
                  background: "rgba(0,0,0,0.5)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {wallpaper.orientation}
              </Box>
              <Box
                sx={{
                  px: 1,
                  py: 0.3,
                  borderRadius: 1.5,
                  backdropFilter: "blur(12px)",
                  background: "rgba(124,77,255,0.6)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "0.04em",
                }}
              >
                {resBadge}
              </Box>
            </Box>

            <Box
              sx={{
                px: 1,
                py: 0.3,
                borderRadius: 1.5,
                backdropFilter: "blur(12px)",
                background: "rgba(0,0,0,0.5)",
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#00e5ff",
              }}
            >
              {formatUpvotes(wallpaper.upvotes)}
            </Box>
          </Box>

          {/* Hover Title & Color Dots */}
          <Box
            className="wallpaper-info"
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 110,
              opacity: 0,
              transform: "translateY(8px)",
              transition: "all 0.3s ease",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{
                color: "white",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontSize: "0.75rem",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {wallpaper.title || wallpaper.subreddit}
            </Typography>
            {wallpaper.colors && wallpaper.colors.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.4 }}>
                {wallpaper.colors.slice(0, 4).map((c, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: c,
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            className="wallpaper-actions"
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              display: "flex",
              gap: 0.5,
              opacity: 0,
              transform: "translateY(8px)",
              transition: "all 0.3s ease",
              zIndex: 2,
            }}
          >
            <Tooltip title={isFavorite ? "Remove favorite" : "Add to favorites"} placement="top">
              <IconButton
                size="small"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                onClick={handleFavorite}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(12px)",
                  color: isFavorite ? "#ff6b9d" : "rgba(255,255,255,0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.8)",
                    transform: "scale(1.12)",
                  },
                }}
              >
                {isFavorite ? <Favorite sx={{ fontSize: 16 }} /> : <FavoriteBorder sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Download" placement="top">
              <IconButton
                size="small"
                aria-label="Download wallpaper"
                onClick={handleDownloadClick}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(12px)",
                  color: "rgba(255,255,255,0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.8)",
                    transform: "scale(1.12)",
                  },
                }}
              >
                <Download sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share" placement="top">
              <IconButton
                size="small"
                aria-label="Share wallpaper"
                onClick={handleShareClick}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(12px)",
                  color: "rgba(255,255,255,0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.8)",
                    transform: "scale(1.12)",
                  },
                }}
              >
                <Share sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>
    </NextLink>
  );
}

