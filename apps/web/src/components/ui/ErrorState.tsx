"use client";

import { Box, Typography, Button } from "@mui/material";
import {
  SentimentDissatisfied,
  Refresh,
  WifiOff,
  Timer,
  SearchOff,
  FolderOff,
} from "@mui/icons-material";
import { motion } from "framer-motion";

export type ErrorType = "notFound" | "network" | "rateLimit" | "empty" | "generic";

interface ErrorStateProps {
  message?: string;
  type?: ErrorType;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong",
  type = "generic",
  onRetry,
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case "network":
        return <WifiOff sx={{ fontSize: 40, color: "warning.main" }} />;
      case "rateLimit":
        return <Timer sx={{ fontSize: 40, color: "error.main" }} />;
      case "notFound":
        return <SearchOff sx={{ fontSize: 40, color: "text.secondary" }} />;
      case "empty":
        return <FolderOff sx={{ fontSize: 40, color: "text.secondary" }} />;
      default:
        return <SentimentDissatisfied sx={{ fontSize: 40, color: "text.secondary" }} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          gap: 2,
          px: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.03)",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
          }}
        >
          {getIcon()}
        </Box>
        <Typography variant="h6" color="text.primary" fontWeight={700} sx={{ fontSize: "1.05rem" }}>
          {message}
        </Typography>
        {type === "network" && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, fontSize: "0.825rem" }}>
            Please check your internet connection and try reloading the page.
          </Typography>
        )}
        {onRetry && (
          <Button
            variant="contained"
            startIcon={<Refresh sx={{ fontSize: 18 }} />}
            onClick={onRetry}
            sx={{ borderRadius: 3, mt: 1 }}
          >
            Try Again
          </Button>
        )}
      </Box>
    </motion.div>
  );
}

