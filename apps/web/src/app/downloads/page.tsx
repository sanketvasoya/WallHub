"use client";

import { useEffect } from "react";
import { Box, Typography, IconButton, Chip, useTheme } from "@mui/material";
import { Delete, ArrowBack, Download as DownloadIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useDownloadHistoryStore } from "@/lib/stores";
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
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DownloadIcon sx={{ color: "primary.main", fontSize: 22 }} />
            <Typography variant="h5" fontWeight={800}>
              Downloads
            </Typography>
          </Box>
          {history.length > 0 && (
            <Chip
              label="Clear All"
              onClick={clearHistory}
              size="small"
              sx={{
                bgcolor: "rgba(244,67,54,0.1)",
                color: "#f44336",
                fontWeight: 600,
                "&:hover": { bgcolor: "rgba(244,67,54,0.2)" },
              }}
            />
          )}
        </Box>

        {!loaded ? (
          <Typography variant="body2" color="text.secondary">Loading...</Typography>
        ) : history.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <DownloadIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.3, mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No downloads yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {history.map((entry, i) => (
              <MotionBox
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: "1px solid",
                    borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  }}
                >
                  <Box
                    component="img"
                    src={entry.thumbnail}
                    alt={entry.title}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <NextLink
                      href={`/wallpaper/${entry.wallpaperId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {entry.title}
                      </Typography>
                    </NextLink>
                    <Typography variant="caption" color="text.secondary">
                      {entry.filesize} &middot; {new Date(entry.downloadedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeDownload(entry.id)}
                    sx={{ color: "text.secondary" }}
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
