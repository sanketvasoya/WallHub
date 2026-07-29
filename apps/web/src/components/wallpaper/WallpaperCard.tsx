"use client";

import { useCallback, useState, useRef } from "react";
import { Heart, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import { getResolutionBadge } from "@/lib/utils";
import { tokens } from "@/lib/tokens";
import type { Wallpaper } from "@/types";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  index?: number;
}

export default function WallpaperCard({ wallpaper, index = 0 }: WallpaperCardProps) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
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

  const delay = Math.min(index * 0.03, 0.4);
  const resBadge = getResolutionBadge(wallpaper.width, wallpaper.height);

  const actionBtn = {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  } as const;

  return (
    <NextLink href={`/wallpaper/${wallpaper.id}`} style={{ textDecoration: "none", display: "block" }}>
      <motion.div
        ref={cardRef}
        role="article"
        aria-label={wallpaper.title || `Wallpaper ${wallpaper.id}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay,
          ease: tokens.animation.ease,
        }}
        whileHover={{ scale: 1.02, transition: { duration: 0.25, ease: tokens.animation.ease } }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: "relative",
          borderRadius: tokens.radius.card,
          overflow: "hidden",
          cursor: "pointer",
          willChange: "transform",
        }}
      >
        <div style={{ position: "relative", overflow: "hidden" }}>
          {!loaded && !imgError && (
            <div
              className="animate-shimmer"
              style={{
                width: "100%",
                paddingBottom: `${(wallpaper.height / wallpaper.width) * 100}%`,
                borderRadius: tokens.radius.card,
              }}
            />
          )}

          {!imgError ? (
            <img
              src={wallpaper.preview || wallpaper.thumbnail}
              alt={wallpaper.title || `Wallpaper ${wallpaper.id}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                display: "block",
                borderRadius: tokens.radius.card,
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "16/9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: tokens.color.surface,
                color: tokens.color.textTertiary,
                borderRadius: tokens.radius.card,
                fontSize: "0.75rem",
              }}
            >
              Unavailable
            </div>
          )}

          <div
            className="card-overlay"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px 12px 12px",
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              opacity: 0,
              transition: "opacity 0.25s ease",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              borderRadius: `0 0 ${tokens.radius.card}px ${tokens.radius.card}px`,
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {resBadge}
            </span>

            <div style={{ display: "flex", gap: 6 }}>
              <button
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                onClick={handleFavorite}
                style={{
                  ...actionBtn,
                  background: "rgba(0,0,0,0.5)",
                  color: isFavorite ? "#FF6B9D" : "rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
              >
                <Heart size={14} fill={isFavorite ? "#FF6B9D" : "none"} strokeWidth={2} />
              </button>
              <button
                aria-label="Download wallpaper"
                onClick={handleDownloadClick}
                style={{
                  ...actionBtn,
                  background: "rgba(0,0,0,0.5)",
                  color: "rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
              >
                <Download size={14} strokeWidth={2} />
              </button>
              <button
                aria-label="Share wallpaper"
                onClick={handleShareClick}
                style={{
                  ...actionBtn,
                  background: "rgba(0,0,0,0.5)",
                  color: "rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
              >
                <Share2 size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .card-overlay {
            pointer-events: none;
          }
          .card-overlay button {
            pointer-events: auto;
          }
          div:hover > div > .card-overlay {
            opacity: 1;
          }
        `}</style>
      </motion.div>
    </NextLink>
  );
}
