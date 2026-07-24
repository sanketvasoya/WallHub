"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  CircularProgress,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Download,
  Share,
  OpenInNew,
  Close,
  Info,
  Visibility,
  CalendarToday,
  AspectRatio,
  Storage,
  Palette,
  Label,
  Category,
  Source,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useWallpaper, useSimilarWallpapers } from "@/hooks/useQueries";
import { useWallpaperActions } from "@/hooks/useWallpaperActions";
import WallpaperGrid from "@/components/wallpaper/WallpaperGrid";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}>
      <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center", width: 20, justifyContent: "center" }}>
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90, fontSize: "0.8rem" }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ fontSize: "0.8rem" }}>
        {value}
      </Typography>
    </Box>
  );
}

function WallpaperViewerContent() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const id = (params?.id as string) || "";
  const { data: wallpaper, isLoading, isError } = useWallpaper(id);
  const { data: similarData, fetchNextPage: fetchNextSimilar, hasNextPage: hasSimilarNext, isFetchingNextPage: fetchingSimilar } = useSimilarWallpapers(id);
  const { isFavorite, handleDownload, handleShare, handleToggleFavorite, downloading, downloadProgress } = useWallpaperActions(wallpaper);
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const similarWallpapers = similarData?.pages.flatMap((p) => p.wallpapers) ?? [];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showInfo) {
          setShowInfo(false);
        } else {
          router.back();
        }
      }
      if (e.key === "f" || e.key === "F") handleToggleFavorite();
      if (e.key === "d" || e.key === "D") handleDownload();
      if (e.key === "i" || e.key === "I") setShowInfo((s) => !s);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router, handleToggleFavorite, handleDownload, showInfo]);

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#05050a" : "#f8f8fc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              sx={{
                color: isDark ? "white" : "text.primary",
                bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                backdropFilter: "blur(12px)",
                "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              <Tooltip title={isFavorite ? "Unfavorite (F)" : "Favorite (F)"}>
                <IconButton
                  onClick={handleToggleFavorite}
                  sx={{
                    color: isFavorite ? "#ff6b9d" : isDark ? "white" : "text.primary",
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" },
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Download (D)">
                <IconButton
                  onClick={handleDownload}
                  disabled={downloading}
                  sx={{
                    color: isDark ? "white" : "text.primary",
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" },
                  }}
                >
                  {downloading ? <CircularProgress size={22} sx={{ color: "primary.main" }} /> : <Download />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton
                  onClick={handleShare}
                  sx={{
                    color: isDark ? "white" : "text.primary",
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" },
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title="Info (I)">
                <IconButton
                  onClick={() => setShowInfo((s) => !s)}
                  sx={{
                    color: showInfo ? "#00e5ff" : isDark ? "white" : "text.primary",
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" },
                  }}
                >
                  <Info />
                </IconButton>
              </Tooltip>
              {wallpaper && (
                <Tooltip title="Open original">
                  <IconButton
                    onClick={() => window.open(wallpaper.originalUrl, "_blank")}
                    sx={{
                      color: isDark ? "white" : "text.primary",
                      bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                      backdropFilter: "blur(12px)",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" },
                    }}
                  >
                    <OpenInNew />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Download Progress */}
      <AnimatePresence>
        {downloading && downloadProgress !== null && downloadProgress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 11 }}
          >
            <LinearProgress
              variant="determinate"
              value={downloadProgress}
              sx={{
                height: 3,
                bgcolor: "rgba(124,77,255,0.15)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #7c4dff, #00e5ff)",
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 1, sm: 3 },
          pt: 8,
          pb: showInfo ? 12 : 10,
          transition: "padding-bottom 0.3s ease",
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ color: "primary.main" }} />
        ) : isError || !wallpaper ? (
          <ErrorState message="Failed to load wallpaper" onRetry={() => router.back()} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Box
              component="img"
              src={wallpaper.image}
              alt={wallpaper.title}
              onLoad={() => setImageLoaded(true)}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: 2,
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
          </motion.div>
        )}
      </Box>

      {/* Info Panel (bottom sheet) */}
      <AnimatePresence>
        {showInfo && wallpaper && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
          >
            <Box
              sx={{
                bgcolor: isDark ? "rgba(14,14,22,0.96)" : "rgba(255,255,255,0.96)",
                backdropFilter: "blur(40px) saturate(1.5)",
                WebkitBackdropFilter: "blur(40px) saturate(1.5)",
                borderRadius: "28px 28px 0 0",
                p: 3,
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <Box sx={{ width: 36, height: 4, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)", borderRadius: 3, mx: "auto", mb: 2.5 }} />

              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: "1.05rem" }}>
                Wallpaper Details
              </Typography>

              {/* Detail rows */}
              <Box sx={{ mb: 2 }}>
                <DetailRow icon={<AspectRatio sx={{ fontSize: 16 }} />} label="Resolution" value={`${wallpaper.width} x ${wallpaper.height}`} />
                <DetailRow icon={<AspectRatio sx={{ fontSize: 16 }} />} label="Aspect" value={wallpaper.aspectRatio} />
                <DetailRow icon={<Storage sx={{ fontSize: 16 }} />} label="File size" value={wallpaper.filesize} />
                <DetailRow icon={<Category sx={{ fontSize: 16 }} />} label="Category" value={wallpaper.subreddit} />
                <DetailRow icon={<Source sx={{ fontSize: 16 }} />} label="Source" value={wallpaper.source || "Wallhaven"} />
                <DetailRow icon={<Visibility sx={{ fontSize: 16 }} />} label="Views" value={wallpaper.views?.toLocaleString() || "N/A"} />
                <DetailRow icon={<CalendarToday sx={{ fontSize: 16 }} />} label="Date" value={formatDate(wallpaper.createdAt)} />
              </Box>

              {/* Color palette */}
              {wallpaper.colors && wallpaper.colors.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Palette sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Color Palette
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {wallpaper.colors.map((color, i) => (
                      <Tooltip key={i} title={color}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 2,
                            bgcolor: color,
                            border: "2px solid",
                            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
                            "&:hover": { transform: "scale(1.15)" },
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Tags */}
              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Label sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Tags
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {wallpaper.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        sx={{
                          borderRadius: 100,
                          fontSize: "0.72rem",
                          height: 26,
                          fontWeight: 500,
                          bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Action buttons */}
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Chip
                  label={downloading ? "Downloading..." : "Download"}
                  onClick={handleDownload}
                  icon={<Download sx={{ fontSize: 15 }} />}
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
                  onClick={() => window.open(wallpaper.originalUrl, "_blank")}
                  icon={<OpenInNew sx={{ fontSize: 15 }} />}
                  variant="outlined"
                  sx={{
                    color: isDark ? "white" : "text.primary",
                    borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
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

      {/* Similar Wallpapers Section */}
      {wallpaper && similarWallpapers.length > 0 && (
        <Box sx={{ pb: { xs: 10, sm: 4 } }}>
          <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, mb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
              Similar Wallpapers
            </Typography>
          </Box>
          <WallpaperGrid wallpapers={similarWallpapers} />
          {fetchingSimilar && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} sx={{ color: "primary.main" }} />
            </Box>
          )}
          {hasSimilarNext && !fetchingSimilar && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <Chip
                label="Load more similar"
                onClick={() => fetchNextSimilar()}
                sx={{ cursor: "pointer", px: 3, py: 2, fontWeight: 600, borderRadius: 100 }}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default function WallpaperViewerPage() {
  return <WallpaperViewerContent />;
}
