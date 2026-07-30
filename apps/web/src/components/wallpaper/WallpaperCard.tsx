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
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
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
          duration: 0.35,
          delay,
          ease: tokens.animation.ease,
        }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: tokens.animation.ease } }}
        whileTap={{ scale: 0.97 }}
        style={{
          position: "relative",
          borderRadius: tokens.radius.card,
          overflow: "hidden",
          cursor: "pointer",
          willChange: "transform",
          background: tokens.color.surface,
        }}
      >
        <div className="card-image-wrap" style={{ position: "relative", overflow: "hidden" }}>
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
              className="card-image"
              style={{
                width: "100%",
                display: "block",
                borderRadius: tokens.radius.card,
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
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
              padding: "48px 10px 10px",
              background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
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
                fontSize: "0.55rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "2px 6px",
                borderRadius: 4,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
              }}
            >
              {resBadge}
            </span>

            <div style={{ display: "flex", gap: 4 }}>
              <button
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                onClick={handleFavorite}
                style={{
                  ...actionBtn,
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(4px)",
                  color: isFavorite ? "#FF6B9D" : "rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.45)"; }}
              >
                <Heart size={13} fill={isFavorite ? "#FF6B9D" : "none"} strokeWidth={2} />
              </button>
              <button
                aria-label="Download wallpaper"
                onClick={handleDownloadClick}
                style={{
                  ...actionBtn,
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(4px)",
                  color: "rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.45)"; }}
              >
                <Download size={13} strokeWidth={2} />
              </button>
              <button
                aria-label="Share wallpaper"
                onClick={handleShareClick}
                style={{
                  ...actionBtn,
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(4px)",
                  color: "rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.45)"; }}
              >
                <Share2 size={13} strokeWidth={2} />
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
          .card-image-wrap:hover .card-image {
            transform: scale(1.05);
          }
          div:hover > div > .card-overlay {
            opacity: 1;
          }
        `}</style>
      </motion.div>
    </NextLink>
  );
}
