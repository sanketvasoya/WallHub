"use client";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { AlertCircle, RefreshCw, WifiOff, Clock, SearchX, FolderX } from "lucide-react";
import { motion } from "framer-motion";
import { tokens } from "@/lib/tokens";

export type ErrorType = "notFound" | "network" | "rateLimit" | "empty" | "generic";

interface ErrorStateProps {
  message?: string;
  description?: string;
  type?: ErrorType;
  onRetry?: () => void;
}

const iconConfig: Record<ErrorType, { icon: React.ReactNode; color: string }> = {
  network: { icon: null, color: tokens.color.warning },
  rateLimit: { icon: null, color: tokens.color.error },
  notFound: { icon: null, color: "" },
  empty: { icon: null, color: "" },
  generic: { icon: null, color: "" },
};

function getErrorIcon(type: ErrorType, size = 36) {
  switch (type) {
    case "network":
      return <WifiOff size={size} strokeWidth={1.5} color={tokens.color.warning} />;
    case "rateLimit":
      return <Clock size={size} strokeWidth={1.5} color={tokens.color.error} />;
    case "notFound":
      return <SearchX size={size} strokeWidth={1.5} />;
    case "empty":
      return <FolderX size={size} strokeWidth={1.5} />;
    default:
      return <AlertCircle size={size} strokeWidth={1.5} />;
  }
}

function getDefaultDescription(type: ErrorType): string | null {
  switch (type) {
    case "network":
      return "Please check your internet connection and try reloading the page.";
    case "rateLimit":
      return "You've made too many requests. Please wait a moment before trying again.";
    case "notFound":
      return "The content you're looking for might have been moved or doesn't exist.";
    case "empty":
      return "There's nothing here yet. Try adjusting your filters or check back later.";
    default:
      return null;
  }
}

export default function ErrorState({
  message = "Something went wrong",
  description,
  type = "generic",
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const displayDescription = description || getDefaultDescription(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: tokens.animation.curve.standard }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, md: 8 },
          gap: 2,
          px: 3,
          textAlign: "center",
        }}
      >
        {/* Icon container */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: tokens.radius.xl,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
            border: "1px solid",
            borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
            mb: 0.5,
          }}
        >
          <Box sx={{ color: "text.secondary" }}>{getErrorIcon(type)}</Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          {message}
        </Typography>

        {displayDescription && (
          <Typography
            variant="body2"
            sx={{
              maxWidth: 340,
              fontSize: "0.85rem",
              lineHeight: 1.55,
              color: "text.secondary",
            }}
          >
            {displayDescription}
          </Typography>
        )}

        {onRetry && (
          <Button
            variant="contained"
            startIcon={<RefreshCw size={16} strokeWidth={2} />}
            onClick={onRetry}
            sx={{ mt: 1, borderRadius: tokens.radius.lg, px: 3, py: 1.25 }}
          >
            Try Again
          </Button>
        )}
      </Box>
    </motion.div>
  );
}
