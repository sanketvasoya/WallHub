"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
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
  const isPriority = index < 2;

  return (
    <NextLink href={`/wallpaper/${wallpaper.id}`} style={{ textDecoration: "none", display: "block" }}>
      <motion.div
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
        <div
          className="card-image-wrap"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
            overflow: "hidden",
            borderRadius: tokens.radius.card,
          }}
        >
          {!imgError ? (
            <Image
              src={wallpaper.preview || wallpaper.thumbnail}
              alt={wallpaper.title || `Wallpaper ${wallpaper.id}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={isPriority}
              placeholder={wallpaper.blurDataURL ? "blur" : undefined}
              blurDataURL={wallpaper.blurDataURL}
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setImgError(true)}
              className="card-image"
              style={{
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
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

          {!loaded && !imgError && (
            <div
              className="animate-shimmer"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: tokens.radius.card,
              }}
            />
          )}

          <div className="card-overlay">
            <span className="card-badge">{resBadge}</span>

            <div style={{ display: "flex", gap: 4 }}>
              <button
                className="card-action-btn"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                onClick={handleFavorite}
                style={{ color: isFavorite ? tokens.color.favorite : tokens.color.textPrimary }}
              >
                <Heart size={16} fill={isFavorite ? tokens.color.favorite : "none"} strokeWidth={2} />
              </button>
              <button
                className="card-action-btn"
                aria-label="Download wallpaper"
                onClick={handleDownloadClick}
                style={{ color: tokens.color.textPrimary }}
              >
                <Download size={16} strokeWidth={2} />
              </button>
              <button
                className="card-action-btn"
                aria-label="Share wallpaper"
                onClick={handleShareClick}
                style={{ color: tokens.color.textPrimary }}
              >
                <Share2 size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </NextLink>
  );
}
