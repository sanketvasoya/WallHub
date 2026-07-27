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
} from "@mui/icons-material";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import type { Wallpaper } from "@/types";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  index?: number;
}

function formatUpvotes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function WallpaperCard({ wallpaper, index = 0 }: WallpaperCardProps) {
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

  if (imgError) return null;

  const delay = Math.min(index * 0.04, 0.6);

  return (
    <NextLink href={`/wallpaper/${wallpaper.id}`} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.015, transition: { duration: 0.3 } }}
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          cursor: "pointer",
          background: "transparent",
        }}
        className="wallpaper-card-group"
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 3,
            "&:hover .wallpaper-img": {
              transform: "scale(1.06)",
            },
            "&:hover .wallpaper-actions": {
              opacity: 1,
              transform: "translateY(0)",
            },
            "&:hover .wallpaper-gradient": {
              opacity: 1,
            },
          }}
        >
          <Box
            component="img"
            src={wallpaper.preview}
            alt={wallpaper.title}
            loading="lazy"
            className="wallpaper-img"
            onError={() => setImgError(true)}
            sx={{
              width: "100%",
              display: "block",
              aspectRatio: "16/9",
              objectFit: "cover",
              transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              borderRadius: 3,
            }}
          />

          <Box
            className="wallpaper-gradient"
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 40%)",
              opacity: 0,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
              borderRadius: 3,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1.5,
                backdropFilter: "blur(12px)",
                background: "rgba(0,0,0,0.45)",
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {wallpaper.orientation}
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1.5,
                backdropFilter: "blur(12px)",
                background: "rgba(0,0,0,0.45)",
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#00e5ff",
                display: "flex",
                alignItems: "center",
                gap: 0.25,
              }}
            >
              {formatUpvotes(wallpaper.upvotes)}
            </Box>
          </Box>

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
            <Tooltip title="Favorite" placement="top">
              <IconButton
                size="small"
                onClick={handleFavorite}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                  color: isFavorite ? "#ff6b9d" : "rgba(255,255,255,0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {isFavorite ? <Favorite sx={{ fontSize: 16 }} /> : <FavoriteBorder sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Download" placement="top">
              <IconButton
                size="small"
                onClick={handleDownloadClick}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                  color: "rgba(255,255,255,0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Download sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share" placement="top">
              <IconButton
                size="small"
                onClick={handleShareClick}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                  color: "rgba(255,255,255,0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                    transform: "scale(1.1)",
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
