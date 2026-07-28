"use client";

import { useCallback, useState } from "react";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Heart, Download, Share2, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import { getResolutionBadge } from "@/lib/utils";
import { tokens } from "@/lib/tokens";
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isFavorite, handleDownload, handleShare, handleToggleFavorite } = useWallpaperActions(wallpaper);

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleToggleFavorite();
    },
    [handleToggleFavorite],
  );

  const handleDownloadClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleDownload();
    },
    [handleDownload],
  );

  const handleShareClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleShare();
    },
    [handleShare],
  );

  const delay = Math.min(index * 0.04, 0.5);
  const resBadge = getResolutionBadge(wallpaper.width, wallpaper.height);

  const aspectRatio =
    variant === "masonry"
      ? `${wallpaper.width} / ${wallpaper.height}`
      : wallpaper.orientation === "portrait"
        ? "3/4"
        : "16/9";

  const actionBtnBase = {
    width: 34,
    height: 34,
    borderRadius: "10px",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
    "&:hover": {
      transform: "scale(1.1)",
    },
  } as const;

  return (
    <NextLink href={`/wallpaper/${wallpaper.id}`} style={{ textDecoration: "none" }}>
      <motion.div
        role="article"
        aria-label={wallpaper.title || `Wallpaper ${wallpaper.id}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: tokens.animation.curve.standard,
        }}
        whileHover={{ scale: 1.015, transition: { duration: 0.3, ease: tokens.animation.curve.standard } }}
        whileTap={{ scale: 0.985 }}
        style={{ position: "relative", borderRadius: tokens.radius.xl, overflow: "hidden", cursor: "pointer" }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: tokens.radius.xl,
            bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            "&:hover .card-img": { transform: "scale(1.06)" },
            "&:hover .card-gradient": { opacity: 1 },
            "&:hover .card-info": { opacity: 1, transform: "translateY(0)" },
            "&:hover .card-actions": { opacity: 1, transform: "translateY(0)" },
          }}
        >
          {!imgError ? (
            <Box
              component="img"
              src={wallpaper.preview || wallpaper.thumbnail}
              alt={wallpaper.title || `Wallpaper ${wallpaper.id}`}
              loading="lazy"
              decoding="async"
              className="card-img"
              onError={() => setImgError(true)}
              sx={{
                width: "100%",
                display: "block",
                aspectRatio,
                objectFit: "cover",
                transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
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
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <ImageIcon size={32} strokeWidth={1.5} />
              <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "0.7rem" }}>
                Unavailable
              </Typography>
            </Box>
          )}

          {/* Gradient overlay */}
          <Box
            className="card-gradient"
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)`,
              opacity: 0,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
              borderRadius: tokens.radius.xl,
            }}
          />

          {/* Top badges */}
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
              <BadgePill dark={isDark}>{wallpaper.orientation}</BadgePill>
              <BadgePill
                dark={isDark}
                sx={{
                  background: isDark
                    ? "rgba(91,95,239,0.65)"
                    : "rgba(91,95,239,0.85)",
                }}
              >
                {resBadge}
              </BadgePill>
            </Box>
            <BadgePill dark={isDark} sx={{ color: tokens.color.accent }}>
              {formatUpvotes(wallpaper.upvotes)}
            </BadgePill>
          </Box>

          {/* Bottom info */}
          <Box
            className="card-info"
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 110,
              opacity: 0,
              transform: "translateY(8px)",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.78rem",
                lineHeight: 1.2,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                mb: 0.5,
              }}
            >
              {wallpaper.title || wallpaper.subreddit}
            </Typography>
            {wallpaper.colors && wallpaper.colors.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.4 }}>
                {wallpaper.colors.slice(0, 5).map((c, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: c,
                      border: "1.5px solid rgba(255,255,255,0.45)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Action buttons */}
          <Box
            className="card-actions"
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              display: "flex",
              gap: 0.5,
              opacity: 0,
              transform: "translateY(8px)",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              zIndex: 2,
            }}
          >
            <Tooltip title={isFavorite ? "Remove favorite" : "Add to favorites"} arrow placement="top">
              <IconButton
                size="small"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                onClick={handleFavorite}
                sx={{
                  ...actionBtnBase,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: isFavorite ? "#FF6B9D" : "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                <Heart size={15} fill={isFavorite ? "#FF6B9D" : "none"} strokeWidth={2} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download" arrow placement="top">
              <IconButton
                size="small"
                aria-label="Download wallpaper"
                onClick={handleDownloadClick}
                sx={{
                  ...actionBtnBase,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                <Download size={15} strokeWidth={2} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share" arrow placement="top">
              <IconButton
                size="small"
                aria-label="Share wallpaper"
                onClick={handleShareClick}
                sx={{
                  ...actionBtnBase,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                <Share2 size={15} strokeWidth={2} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>
    </NextLink>
  );
}

function BadgePill({
  children,
  dark,
  sx,
}: {
  children: React.ReactNode;
  dark: boolean;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: "8px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: dark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.45)",
        fontSize: "0.6rem",
        fontWeight: 700,
        color: "#fff",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        lineHeight: 1.6,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
