"use client";

import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            background: "linear-gradient(135deg, #7c4dff, #00e5ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Oops!
        </Typography>
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: "1rem" }}>
          Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", maxWidth: 360, fontSize: "0.9rem" }}>
          {error.message || "An unexpected error occurred"}
        </Typography>
        <Button
          variant="contained"
          onClick={reset}
          sx={{ mt: 2, borderRadius: 3 }}
        >
          Try Again
        </Button>
      </Box>
    </motion.div>
  );
}
