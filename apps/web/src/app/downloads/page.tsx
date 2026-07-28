"use client";

import { useEffect } from "react";
import { Box, Typography, IconButton, Chip, useTheme, Button } from "@mui/material";
import { Delete, Download as DownloadIcon, DeleteSweep } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useDownloadHistoryStore } from "@/lib/stores";
import { formatRelativeTime } from "@/lib/utils";
import NextLink from "next/link";

const MotionBox = motion.create(Box);

export default function DownloadsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();
  const { history, loaded, loadHistory, removeDownload, clearHistory } = useDownloadHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <PageHeader
          title="Download Manager"
          subtitle={history.length > 0 ? `${history.length} wallpapers downloaded` : "History of downloaded wallpapers"}
          icon={<DownloadIcon sx={{ color: "primary.main" }} />}
          action={
            history.length > 0 ? (
              <Chip
                label="Clear History"
                onClick={clearHistory}
                icon={<DeleteSweep sx={{ fontSize: 16 }} />}
                size="small"
                sx={{
                  bgcolor: "rgba(244,67,54,0.1)",
                  color: "#f44336",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(244,67,54,0.2)" },
                }}
              />
            ) : undefined
          }
        />

        {!loaded ? (
          <LoadingSkeleton variant="list" count={5} />
        ) : history.length === 0 ? (
          <ErrorState type="empty" message="No download history found" />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {history.map((entry, i) => (
              <MotionBox
                key={entry.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: "1px solid",
                    borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <NextLink href={`/wallpaper/${entry.wallpaperId}`}>
                    <Box
                      component="img"
                      src={entry.thumbnail}
                      alt={entry.title}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2.5,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </NextLink>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <NextLink
                      href={`/wallpaper/${entry.wallpaperId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "0.9rem",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {entry.title}
                      </Typography>
                    </NextLink>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", display: "block", mt: 0.25 }}>
                      {entry.filesize} &bull; Downloaded {formatRelativeTime(entry.downloadedAt)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    aria-label="Remove download entry"
                    onClick={() => removeDownload(entry.id)}
                    sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                  >
                    <Delete sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </MotionBox>
            ))}
          </Box>
        )}
      </Box>
      <BottomNav />
    </Box>
  );
}

