"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  HeartOff,
  Download,
  Share2,
  ExternalLink,
  Info,
  Maximize,
  HardDrive,
  Tag,
  Palette,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useWallpaper, useSimilarWallpapers } from "@/hooks/useQueries";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { tokens } from "@/lib/tokens";

function WallpaperViewerContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const { data: wallpaper, isLoading, isError } = useWallpaper(id);
  const {
    data: similarData,
    fetchNextPage: fetchNextSimilar,
    hasNextPage: hasSimilarNext,
    isFetchingNextPage: fetchingSimilar,
    isLoading: similarLoading,
  } = useSimilarWallpapers(id);
  const {
    isFavorite,
    handleDownload,
    handleShare,
    handleToggleFavorite,
    downloading,
  } = useWallpaperActions(wallpaper);

  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const similarWallpapers =
    similarData?.pages.flatMap((p) => p.wallpapers) ?? [];

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextSimilar,
    hasMore: !!hasSimilarNext,
    isLoading: fetchingSimilar,
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

      if (e.key === "Escape") {
        if (showInfo) setShowInfo(false);
        else router.back();
        return;
      }
      if (e.key === "f" || e.key === "F") { e.preventDefault(); handleToggleFavorite(); }
      if (e.key === "d" || e.key === "D") { e.preventDefault(); handleDownload(); }
      if (e.key === "i" || e.key === "I") { setShowInfo((s) => !s); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router, handleToggleFavorite, handleDownload, showInfo]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch { return dateStr; }
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: tokens.color.bg }}>
        <LoadingSkeleton variant="detail" />
      </Box>
    );
  }

  if (isError || !wallpaper) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: tokens.color.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ErrorState message="Wallpaper not found" onRetry={() => router.back()} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: tokens.color.bg, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            p: 1.5,
            background: "linear-gradient(to bottom, rgba(11,11,12,0.9) 0%, transparent 100%)",
          }}
        >
          <button
            onClick={() => router.back()}
            aria-label="Back"
            style={{
              width: 40, height: 40, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.08)", color: "white",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(12px)",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <Box sx={{ display: "flex", gap: 0.75 }}>
            {[
              {
                icon: isFavorite ? <Heart size={20} fill="#FF6B9D" /> : <HeartOff size={20} />,
                onClick: handleToggleFavorite,
                active: isFavorite,
                label: isFavorite ? "Remove favorite (F)" : "Favorite (F)",
              },
              {
                icon: downloading ? (
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.6s linear infinite" }} />
                ) : <Download size={20} />,
                onClick: handleDownload,
                disabled: downloading,
                label: "Download (D)",
              },
              {
                icon: <Share2 size={20} />,
                onClick: handleShare,
                label: "Share",
              },
              {
                icon: <Info size={20} />,
                onClick: () => setShowInfo((s) => !s),
                active: showInfo,
                label: "Info (I)",
              },
              {
                icon: <ExternalLink size={20} />,
                onClick: () => window.open(wallpaper.originalUrl, "_blank", "noopener,noreferrer"),
                label: "Open original",
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                disabled={btn.disabled}
                aria-label={btn.label}
                style={{
                  width: 40, height: 40, borderRadius: "50%", border: "none",
                  background: btn.active ? tokens.color.primaryAlpha20 : "rgba(255,255,255,0.08)",
                  color: btn.active ? tokens.color.primary : "white",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(12px)", transition: "all 0.2s ease",
                  ...(btn.disabled ? { opacity: 0.5 } : {}),
                }}
                onMouseEnter={(e) => { if (!btn.disabled) e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                onMouseLeave={(e) => { if (!btn.disabled) e.currentTarget.style.background = btn.active ? tokens.color.primaryAlpha20 : "rgba(255,255,255,0.08)"; }}
              >
                {btn.icon}
              </button>
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* Main image */}
      <Box
        sx={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          p: { xs: 0, sm: 4 }, pt: { xs: 7, sm: 8 },
          maxWidth: 1200, mx: "auto", width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: tokens.animation.ease }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box sx={{ position: "relative", width: "100%", maxHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!imageError && (
              <motion.img
                layoutId={`wallpaper-image-${wallpaper.id}`}
                src={wallpaper.image}
                alt={wallpaper.title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: tokens.radius.card,
                }}
              />
            )}
            {imageError && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, color: tokens.color.textSecondary, py: 8 }}>
                <Typography variant="body2">Failed to load image</Typography>
                <button
                  onClick={() => window.open(wallpaper.originalUrl, "_blank", "noopener,noreferrer")}
                  style={{
                    padding: "8px 16px", borderRadius: tokens.radius.button, border: `1px solid ${tokens.color.border}`,
                    background: "transparent", color: tokens.color.textPrimary, cursor: "pointer", fontSize: "0.8rem",
                  }}
                >
                  Open original
                </button>
              </Box>
            )}
          </Box>
        </motion.div>
      </Box>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && wallpaper && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: tokens.animation.ease }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10,
            }}
          >
            <Box
              sx={{
                bgcolor: tokens.color.surface,
                backdropFilter: "blur(40px) saturate(1.5)",
                WebkitBackdropFilter: "blur(40px) saturate(1.5)",
                borderRadius: "28px 28px 0 0",
                p: 3,
                maxHeight: "60vh",
                overflowY: "auto",
                borderTop: `1px solid ${tokens.color.border}`,
              }}
            >
              <Box sx={{ width: 36, height: 4, bgcolor: tokens.color.surfaceVariant, borderRadius: 3, mx: "auto", mb: 2.5 }} />

              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: "1rem" }}>
                Details
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                <InfoRow icon={<Maximize size={15} />} label="Resolution" value={`${wallpaper.width} × ${wallpaper.height}`} />
                <InfoRow icon={<Maximize size={15} />} label="Aspect ratio" value={wallpaper.aspectRatio} />
                <InfoRow icon={<HardDrive size={15} />} label="File size" value={wallpaper.filesize} />
                <InfoRow icon={<Palette size={15} />} label="Source" value={wallpaper.source || "Wallhaven"} />
              </Box>

              {wallpaper.colors && wallpaper.colors.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: tokens.color.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", mb: 1, display: "block" }}>
                    Colors
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                    {wallpaper.colors.map((color, i) => (
                      <Box
                        key={i}
                        sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: color, border: `2px solid ${tokens.color.border}` }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 600, color: tokens.color.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", mb: 1, display: "block" }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {wallpaper.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        sx={{
                          borderRadius: tokens.radius.pill,
                          fontSize: "0.72rem",
                          height: 26,
                          fontWeight: 500,
                          bgcolor: tokens.color.surfaceVariant,
                          color: tokens.color.textSecondary,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "10px 24px", borderRadius: tokens.radius.button, border: "none",
                    background: tokens.color.primary, color: "#fff", fontWeight: 600, cursor: "pointer",
                    fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <Download size={16} />
                  {downloading ? "Downloading..." : "Download"}
                </button>
                <button
                  onClick={() => window.open(wallpaper.originalUrl, "_blank", "noopener,noreferrer")}
                  style={{
                    padding: "10px 24px", borderRadius: tokens.radius.button,
                    border: `1px solid ${tokens.color.border}`, background: "transparent",
                    color: tokens.color.textPrimary, fontWeight: 500, cursor: "pointer",
                    fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <ExternalLink size={16} />
                  Open Original
                </button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Similar wallpapers */}
      <Box sx={{ pb: { xs: 12, sm: 4 }, mt: 4 }}>
        <Box sx={{ px: { xs: 3, sm: 4 }, mb: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9375rem" }}>
            Similar Wallpapers
          </Typography>
        </Box>
        {similarLoading ? (
          <LoadingSkeleton variant="card" count={4} />
        ) : similarWallpapers.length > 0 ? (
          <>
            <WallpaperGrid wallpapers={similarWallpapers} />
            {fetchingSimilar && <LoadingSkeleton variant="card" count={4} />}
            <div ref={sentinelRef} style={{ height: 1 }} />
          </>
        ) : (
          <Box sx={{ px: { xs: 3, sm: 4 } }}>
            <Typography variant="body2" sx={{ color: tokens.color.textSecondary }}>
              No similar wallpapers found.
            </Typography>
          </Box>
        )}
      </Box>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Box>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
      <Box sx={{ color: tokens.color.textTertiary, display: "flex", alignItems: "center", width: 20, justifyContent: "center" }}>
        {icon}
      </Box>
      <Typography variant="body2" sx={{ color: tokens.color.textSecondary, minWidth: 90, fontSize: "0.8rem" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8rem", color: tokens.color.textPrimary }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function WallpaperViewerPage() {
  return <WallpaperViewerContent />;
}
