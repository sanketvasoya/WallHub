"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  Palette,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWallpaper, useSimilarWallpapers } from "@/hooks/useQueries";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import ZoomableView from "@/components/ui/ZoomableView";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { tokens } from "@/lib/tokens";

export default function WallpaperClient({ id }: { id: string }) {
  const router = useRouter();

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
    progress,
  } = useWallpaperActions(wallpaper);

  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const similarWallpapers =
    similarData?.pages.flatMap((p) => p.wallpapers) ?? [];

  const currentIndex = useMemo(() => {
    return similarWallpapers.findIndex((w) => w.id === id);
  }, [similarWallpapers, id]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextSimilar,
    hasMore: !!hasSimilarNext,
    isLoading: fetchingSimilar,
  });

  const handleSwipeLeft = useCallback(() => {
    if (isZoomed) return;
    if (currentIndex < 0 || currentIndex >= similarWallpapers.length - 1) {
      setSwipeDirection("left");
      setTimeout(() => setSwipeDirection(null), 300);
      return;
    }
    setShowSwipeHint(false);
    router.push(`/wallpaper/${similarWallpapers[currentIndex + 1].id}`);
  }, [isZoomed, currentIndex, similarWallpapers, router]);

  const handleSwipeRight = useCallback(() => {
    if (isZoomed) return;
    if (currentIndex <= 0) {
      setSwipeDirection("right");
      setTimeout(() => setSwipeDirection(null), 300);
      return;
    }
    setShowSwipeHint(false);
    router.push(`/wallpaper/${similarWallpapers[currentIndex - 1].id}`);
  }, [isZoomed, currentIndex, similarWallpapers, router]);

  const { onPointerDown, onPointerUp } = useSwipeNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 80,
  });

  const handleScaleChange = useCallback((scale: number) => {
    setIsZoomed(scale > 1);
  }, []);

  const favoriteRef = useRef(handleToggleFavorite)
  const downloadRef = useRef(handleDownload)
  favoriteRef.current = handleToggleFavorite
  downloadRef.current = handleDownload

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

      if (e.key === "Escape") {
        setShowInfo((s) => { if (s) return false; router.back(); return false; });
        return;
      }
      if (e.key === "f" || e.key === "F") { e.preventDefault(); favoriteRef.current(); }
      if (e.key === "d" || e.key === "D") { e.preventDefault(); downloadRef.current(); }
      if (e.key === "i" || e.key === "I") { setShowInfo((s) => !s); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router]);

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
              width: 44, height: 44, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.08)", color: "white",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)",
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
                  <Box sx={{ position: "relative", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {progress > 0 && (
                      <svg width="20" height="20" viewBox="0 0 20 20" style={{ position: "absolute", top: 0, left: 0 }}>
                        <circle
                          cx="10" cy="10" r="9"
                          fill="none" stroke={tokens.color.primary} strokeWidth="1.5"
                          strokeDasharray={`${2 * Math.PI * 9}`}
                          strokeDashoffset={`${2 * Math.PI * 9 * (1 - progress / 100)}`}
                          transform="rotate(-90 10 10)"
                          style={{ transition: "stroke-dashoffset 0.3s ease" }}
                        />
                      </svg>
                    )}
                    {progress === 100 ? (
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: tokens.color.accent }} />
                    ) : (
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.6s linear infinite" }} />
                    )}
                  </Box>
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
                  width: 44, height: 44, borderRadius: "50%", border: "none",
                  background: btn.active ? tokens.color.primaryAlpha20 : "rgba(255,255,255,0.08)",
                  color: btn.active ? tokens.color.primary : "white",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(8px)", transition: "all 0.2s ease",
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
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: tokens.animation.ease }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box sx={{ position: "relative", width: "100%", maxHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", touchAction: isZoomed ? "none" : "pan-y" }}>
            {!imageError && (
              <ZoomableView onScaleChange={handleScaleChange} maxScale={5} minScale={1}>
                <LayoutGroup>
                  <motion.img
                    layoutId={`wallpaper-image-${wallpaper.id}`}
                    src={wallpaper.image}
                    alt={wallpaper.title || `${wallpaper.width}x${wallpaper.height} wallpaper`}
                    title={wallpaper.title || `Wallpaper ${wallpaper.width}x${wallpaper.height}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80vh",
                      objectFit: "contain",
                      borderRadius: tokens.radius.card,
                    }}
                  />
                </LayoutGroup>
              </ZoomableView>
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
            
            {/* Swipe hint indicators */}
            {showSwipeHint && similarWallpapers.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <Box
                    sx={{
                      position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                      width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0.6, pointerEvents: "none",
                    }}
                  >
                    <ArrowLeft size={16} color="white" />
                  </Box>
                )}
                {currentIndex < similarWallpapers.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute", right: 8, top: "50%", transform: "translateY(-50%) rotate(180deg)",
                      width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0.6, pointerEvents: "none",
                    }}
                  >
                    <ArrowLeft size={16} color="white" />
                  </Box>
                )}
              </>
            )}
            
            {/* End of list indicator */}
            <AnimatePresence>
              {swipeDirection && (
                <motion.div
                  initial={{ opacity: 0, x: swipeDirection === "left" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    fontSize: "0.75rem",
                    pointerEvents: "none",
                  }}
                >
                  {swipeDirection === "left" ? "Last wallpaper" : "First wallpaper"}
                </motion.div>
              )}
            </AnimatePresence>
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
                backdropFilter: "blur(8px) saturate(1.5)",
                WebkitBackdropFilter: "blur(8px) saturate(1.5)",
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
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {downloading && progress > 0 && (
                    <span
                      style={{
                        position: "absolute", bottom: 0, left: 0, height: "100%",
                        width: `${progress}%`, background: "rgba(255,255,255,0.15)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                    <Download size={16} />
                    {downloading ? `${progress}%` : "Download"}
                  </span>
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
