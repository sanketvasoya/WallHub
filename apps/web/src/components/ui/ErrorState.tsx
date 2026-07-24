"use client";

import { Box, Typography, Button } from "@mui/material";
import { SentimentDissatisfied, Refresh } from "@mui/icons-material";
import { motion } from "framer-motion";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = "Something went wrong", onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          gap: 2,
          px: 3,
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
          }}
        >
          <SentimentDissatisfied sx={{ fontSize: 40, color: "text.secondary" }} />
        </Box>
        <Typography variant="h6" color="text.secondary" fontWeight={600} sx={{ fontSize: "1rem" }}>
          {message}
        </Typography>
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
