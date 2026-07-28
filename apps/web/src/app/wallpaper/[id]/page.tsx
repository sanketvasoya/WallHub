"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip,
  Snackbar,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  HeartOff,
  Download,
  Share2,
  ExternalLink,
  X,
  Info,
  Eye,
  Calendar,
  Maximize,
  HardDrive,
  Palette,
  Tag,
  Folder,
  Link2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useWallpaper, useSimilarWallpapers } from "@/hooks/useQueries";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useOrientation } from "@/hooks/useOrientation";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { tokens } from "@/lib/tokens";

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}>
      <Box
        sx={{
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          width: 20,
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 90, fontSize: "0.8rem" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{ fontSize: "0.8rem" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

const ZOOM_SCALE = 2.5;
const SWIPE_DISMISS_THRESHOLD = 120;

function WallpaperViewerContent() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const id = (params?.id as string) || "";

  const { data: wallpaper, isLoading, isError } = useWallpaper(id);
  const { ratios, atleast } = useOrientation();
  const {
    data: similarData,
    fetchNextPage: fetchNextSimilar,
    hasNextPage: hasSimilarNext,
    isFetchingNextPage: fetchingSimilar,
  } = useSimilarWallpapers(id, ratios, atleast);
  const {
    isFavorite,
    handleDownload,
    handleShare,
    handleToggleFavorite,
    downloading,
    downloadProgress,
  } = useWallpaperActions(wallpaper);

  const [showInfo, setShowInfo] = useState(false);
  const showInfoRef = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [usePreview, setUsePreview] = useState(true);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const [zoomed, setZoomed] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [showShortcuts, setShowShortcuts] = useState(false);
  const showShortcutsRef = useRef(false);

  const similarWallpapers =
    similarData?.pages.flatMap((p) => p.wallpapers) ?? [];

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextSimilar,
    hasMore: !!hasSimilarNext,
    isLoading: fetchingSimilar,
  });

  useEffect(() => {
    showInfoRef.current = showInfo;
  }, [showInfo]);

  useEffect(() => {
    showShortcutsRef.current = showShortcuts;
  }, [showShortcuts]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts((s) => !s);
        return;
      }
      if (e.key === "Escape") {
        if (showShortcutsRef.current) {
          setShowShortcuts(false);
        } else if (showInfoRef.current) {
          setShowInfo(false);
        } else {
          router.back();
        }
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        handleToggleFavorite();
      }
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleDownload();
      }
      if (e.key === "i" || e.key === "I") {
        setShowInfo((s) => !s);
      }
      if (e.key === "ArrowLeft" && similarWallpapers.length > 0) {
        const currentIdx = similarWallpapers.findIndex((w) => w.id === id);
        const prevIdx =
          currentIdx > 0 ? currentIdx - 1 : similarWallpapers.length - 1;
        router.push(`/wallpaper/${similarWallpapers[prevIdx].id}`);
      }
      if (e.key === "ArrowRight" && similarWallpapers.length > 0) {
        const currentIdx = similarWallpapers.findIndex((w) => w.id === id);
        const nextIdx =
          currentIdx < similarWallpapers.length - 1 ? currentIdx + 1 : 0;
        router.push(`/wallpaper/${similarWallpapers[nextIdx].id}`);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    router,
    handleToggleFavorite,
    handleDownload,
    id,
    similarWallpapers,
  ]);

  const showToast = useCallback((message: string) => {
    setToast({ open: true, message });
  }, []);

  const handleDoubleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        if (zoomed) {
          setZoomed(false);
          setPanOffset({ x: 0, y: 0 });
        } else {
          setZoomed(true);
        }
      }
      lastTap.current = now;
    },
    [zoomed]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!zoomed) return;
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...panOffset };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [zoomed, panOffset]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !zoomed) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPanOffset({
        x: panStart.current.x + dx,
        y: panStart.current.y + dy,
      });
    },
    [zoomed]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleFullImageLoad = useCallback(() => {
    setUsePreview(false);
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleColorClick = (color: string) => {
    navigator.clipboard.writeText(color).then(
      () => showToast(`Copied ${color}`),
      () => showToast(`Color: ${color}`)
    );
  };

  const handleTagClick = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  const iconBtnSx = {
    color: isDark ? "white" : "text.primary",
    bgcolor: isDark
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.06)",
    backdropFilter: "blur(12px)",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: isDark
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.1)",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#05050a" : "#f8f8fc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ open: false, message: "" })}
        message={toast.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {/* Top Bar */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: tokens.animation.curve.standard }}
        >
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              background: isDark
                ? "linear-gradient(to bottom, rgba(5,5,10,0.85) 0%, transparent 100%)"
                : "linear-gradient(to bottom, rgba(248,248,252,0.85) 0%, transparent 100%)",
            }}
          >
            <IconButton
              onClick={() => router.back()}
              aria-label="Back"
              sx={iconBtnSx}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              <Tooltip
                title={isFavorite ? "Unfavorite (F)" : "Favorite (F)"}
              >
                <IconButton
                  onClick={handleToggleFavorite}
                  sx={{
                    ...iconBtnSx,
                    color: isFavorite
                      ? "#ff6b9d"
                      : isDark
                      ? "white"
                      : "text.primary",
                  }}
                >
                  <motion.div
                    animate={
                      isFavorite ? { scale: [1, 1.4, 1] } : { scale: 1 }
                    }
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ display: "flex" }}
                  >
                    {isFavorite ? (
                      <Heart size={20} fill="#ff6b9d" />
                    ) : (
                      <HeartOff size={20} />
                    )}
                  </motion.div>
                </IconButton>
              </Tooltip>
              <Tooltip title="Download (D)">
                <IconButton
                  onClick={handleDownload}
                  disabled={downloading}
                  sx={iconBtnSx}
                >
                  {downloading ? (
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width={22} height={22} viewBox="0 0 22 22">
                        <circle
                          cx={11}
                          cy={11}
                          r={9}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          opacity={0.2}
                        />
                        <circle
                          cx={11}
                          cy={11}
                          r={9}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeDasharray={`${
                            (downloadProgress ?? 0) * 0.56
                          } 56`}
                          strokeLinecap="round"
                          transform="rotate(-90 11 11)"
                        />
                      </svg>
                    </Box>
                  ) : (
                    <Download size={20} />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton
                  onClick={handleShare}
                  sx={iconBtnSx}
                >
                  <Share2 size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Info (I)">
                <IconButton
                  onClick={() => setShowInfo((s) => !s)}
                  sx={{
                    ...iconBtnSx,
                    color: showInfo
                      ? tokens.color.accent
                      : isDark
                      ? "white"
                      : "text.primary",
                  }}
                >
                  <Info size={20} />
                </IconButton>
              </Tooltip>
              {wallpaper && (
                <Tooltip title="Open original">
                  <IconButton
                    onClick={() =>
                      window.open(
                        wallpaper.originalUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    sx={iconBtnSx}
                  >
                    <ExternalLink size={20} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Download Progress */}
      <AnimatePresence>
        {downloading &&
          downloadProgress !== null &&
          downloadProgress < 100 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 56,
                left: 0,
                right: 0,
                zIndex: 11,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={downloadProgress}
                sx={{
                  height: 3,
                  bgcolor: isDark
                    ? tokens.color.primaryAlpha15
                    : tokens.color.primaryAlpha10,
                  "& .MuiLinearProgress-bar": {
                    background: tokens.gradient.primary,
                  },
                }}
              />
            </motion.div>
          )}
      </AnimatePresence>

      {/* Main Image Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 0, sm: 3 },
          pt: { xs: 0, sm: 8 },
          pb: showInfo ? 12 : 10,
          transition: "padding-bottom 0.3s ease",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <LoadingSkeleton count={1} variant="list" />
        ) : isError || !wallpaper ? (
          <ErrorState
            message="Wallpaper not found"
            onRetry={() => router.back()}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              ease: tokens.animation.curve.standard,
            }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              drag={zoomed ? false : "y"}
              dragConstraints={{ top: 0, bottom: 300 }}
              dragElastic={0.2}
              onDragEnd={(_e, info) => {
                if (info.offset.y > SWIPE_DISMISS_THRESHOLD) {
                  router.back();
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                ref={imageContainerRef}
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: zoomed ? "grab" : "zoom-in",
                  touchAction: zoomed ? "none" : "auto",
                }}
                onDoubleClick={handleDoubleTap}
                onTouchEnd={handleDoubleTap}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {usePreview && wallpaper.preview && !imageError && (
                  <Box
                    component="img"
                    src={wallpaper.preview}
                    alt=""
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "blur(20px)",
                      transform: "scale(1.1)",
                      opacity: 0.6,
                    }}
                  />
                )}

                {!imageError && (
                  <motion.img
                    layoutId={`wallpaper-image-${wallpaper.id}`}
                    src={
                      usePreview
                        ? wallpaper.thumbnail || wallpaper.preview
                        : wallpaper.image
                    }
                    alt={wallpaper.title}
                    onLoad={
                      usePreview ? handleFullImageLoad : undefined
                    }
                    onError={handleImageError}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: 8,
                      position: "relative",
                      zIndex: 1,
                      transform: `scale(${
                        zoomed ? ZOOM_SCALE : 1
                      }) translate(${
                        panOffset.x / (zoomed ? ZOOM_SCALE : 1)
                      }px, ${panOffset.y / (zoomed ? ZOOM_SCALE : 1)}px)`,
                      transition: isDragging.current
                        ? "none"
                        : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      opacity: imageLoaded || usePreview ? 1 : 0,
                    }}
                  />
                )}

                {imageError && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <X size={40} style={{ opacity: 0.5 }} />
                    <Typography variant="body2">
                      Failed to load image
                    </Typography>
                    <Chip
                      label="Open original"
                      onClick={() =>
                        window.open(
                          wallpaper.originalUrl,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      icon={<ExternalLink size={14} />}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background: `linear-gradient(to top, ${
                      isDark ? "#05050a" : "#f8f8fc"
                    } 0%, transparent 100%)`,
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />

                <AnimatePresence>
                  {zoomed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "absolute",
                        bottom: 48,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 3,
                      }}
                    >
                      <Chip
                        label={`${ZOOM_SCALE}x \u00B7 Double-tap to exit`}
                        size="small"
                        sx={{
                          bgcolor: isDark
                            ? "rgba(0,0,0,0.7)"
                            : "rgba(255,255,255,0.8)",
                          backdropFilter: "blur(8px)",
                          fontSize: "0.7rem",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </Box>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && wallpaper && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{
              duration: 0.35,
              ease: tokens.animation.curve.standard,
            }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <Box
              sx={{
                bgcolor: isDark
                  ? "rgba(14,14,22,0.96)"
                  : "rgba(255,255,255,0.96)",
                backdropFilter: "blur(40px) saturate(1.5)",
                WebkitBackdropFilter: "blur(40px) saturate(1.5)",
                borderRadius: "28px 28px 0 0",
                p: 3,
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 4,
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.12)",
                  borderRadius: 3,
                  mx: "auto",
                  mb: 2.5,
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2, fontSize: "1.05rem" }}
              >
                Wallpaper Details
              </Typography>

              <Box sx={{ mb: 2 }}>
                <DetailRow
                  icon={<Maximize size={16} />}
                  label="Resolution"
                  value={`${wallpaper.width} x ${wallpaper.height}`}
                />
                <DetailRow
                  icon={<Maximize size={16} />}
                  label="Aspect"
                  value={wallpaper.aspectRatio}
                />
                <DetailRow
                  icon={<HardDrive size={16} />}
                  label="File size"
                  value={wallpaper.filesize}
                />
                <DetailRow
                  icon={<Folder size={16} />}
                  label="Category"
                  value={wallpaper.subreddit}
                />
                <DetailRow
                  icon={<Link2 size={16} />}
                  label="Source"
                  value={wallpaper.source || "Wallhaven"}
                />
                <DetailRow
                  icon={<Eye size={16} />}
                  label="Views"
                  value={wallpaper.views?.toLocaleString() || "N/A"}
                />
                <DetailRow
                  icon={<Calendar size={16} />}
                  label="Date"
                  value={formatDate(wallpaper.createdAt)}
                />
              </Box>

              {wallpaper.colors && wallpaper.colors.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Palette
                      size={16}
                      style={{ color: tokens.color.textDarkSecondary }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Color Palette
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                  >
                    {wallpaper.colors.map((color, i) => (
                      <Tooltip
                        key={i}
                        title={`Click to copy ${color}`}
                      >
                        <Box
                          onClick={() => handleColorClick(color)}
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 2,
                            bgcolor: color,
                            border: "2px solid",
                            borderColor: isDark
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.08)",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
                            "&:hover": {
                              transform: "scale(1.15)",
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              )}

              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Tag
                      size={16}
                      style={{ color: tokens.color.textDarkSecondary }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Tags
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75,
                    }}
                  >
                    {wallpaper.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        onClick={() => handleTagClick(tag)}
                        sx={{
                          borderRadius: 100,
                          fontSize: "0.72rem",
                          height: 26,
                          fontWeight: 500,
                          cursor: "pointer",
                          bgcolor: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                          "&:hover": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.12)"
                              : "rgba(0,0,0,0.08)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Chip
                  label={
                    downloading ? "Downloading..." : "Download"
                  }
                  onClick={handleDownload}
                  icon={<Download size={15} />}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                    height: 36,
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                />
                <Chip
                  label="Open Original"
                  onClick={() =>
                    window.open(
                      wallpaper.originalUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  icon={<ExternalLink size={15} />}
                  variant="outlined"
                  sx={{
                    color: isDark ? "white" : "text.primary",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    height: 36,
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowShortcuts(false)}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
              }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: "relative", zIndex: 1 }}
            >
              <Box
                sx={{
                  bgcolor: isDark
                    ? "rgba(14,14,22,0.96)"
                    : "rgba(255,255,255,0.96)",
                  borderRadius: 4,
                  p: 3,
                  minWidth: 280,
                  backdropFilter: "blur(40px)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 2, fontSize: "1rem" }}
                >
                  Keyboard Shortcuts
                </Typography>
                {[
                  ["F", "Toggle favorite"],
                  ["D", "Download"],
                  ["I", "Toggle info panel"],
                  ["?", "Show/hide shortcuts"],
                  ["\u2190 / \u2192", "Navigate similar wallpapers"],
                  ["Esc", "Close panel / Go back"],
                ].map(([key, desc]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {desc}
                    </Typography>
                    <Chip
                      label={key}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        ml: 2,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Similar Wallpapers Section */}
      {wallpaper && (
        <Box sx={{ pb: { xs: 12, sm: 4 } }}>
          <Box sx={{ px: { xs: 2, sm: 3 }, mb: 2 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
              Similar Wallpapers
            </Typography>
          </Box>
          {similarWallpapers.length > 0 ? (
            <>
              <WallpaperGrid wallpapers={similarWallpapers} />
              {fetchingSimilar && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 3,
                  }}
                >
                  <LinearProgress
                    sx={{
                      width: 120,
                      height: 3,
                      borderRadius: 2,
                      bgcolor: isDark
                        ? tokens.color.primaryAlpha15
                        : tokens.color.primaryAlpha10,
                      "& .MuiLinearProgress-bar": {
                        background: tokens.gradient.primary,
                      },
                    }}
                  />
                </Box>
              )}
              <Box ref={sentinelRef} sx={{ height: 1 }} />
            </>
          ) : (
            !fetchingSimilar && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 2,
                }}
              >
                No similar wallpapers found.
              </Typography>
            )
          )}
        </Box>
      )}

      {/* Mobile Bottom Action Bar */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          justifyContent: "center",
          gap: 1,
          p: 1.5,
          pb: 2,
          background: isDark
            ? "rgba(10,10,18,0.75)"
            : "rgba(248,248,252,0.75)",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          borderTop: "1px solid",
          borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)",
        }}
      >
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            color: isFavorite
              ? "#ff6b9d"
              : isDark
              ? "white"
              : "text.primary",
          }}
        >
          <motion.div
            animate={
              isFavorite ? { scale: [1, 1.4, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ display: "flex" }}
          >
            {isFavorite ? (
              <Heart size={20} fill="#ff6b9d" />
            ) : (
              <HeartOff size={20} />
            )}
          </motion.div>
        </IconButton>
        <IconButton
          onClick={handleDownload}
          disabled={downloading}
          sx={{
            color: isDark ? "white" : "text.primary",
          }}
        >
          <Download size={20} />
        </IconButton>
        <IconButton
          onClick={handleShare}
          sx={{
            color: isDark ? "white" : "text.primary",
          }}
        >
          <Share2 size={20} />
        </IconButton>
        <IconButton
          onClick={() => setShowInfo((s) => !s)}
          sx={{
            color: showInfo
              ? tokens.color.accent
              : isDark
              ? "white"
              : "text.primary",
          }}
        >
          <Info size={20} />
        </IconButton>
        {wallpaper && (
          <IconButton
            onClick={() =>
              window.open(
                wallpaper.originalUrl,
                "_blank",
                "noopener,noreferrer"
              )
            }
            sx={{
              color: isDark ? "white" : "text.primary",
            }}
          >
            <ExternalLink size={20} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default function WallpaperViewerPage() {
  return <WallpaperViewerContent />;
}
