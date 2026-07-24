"use client";

import { Box, Typography, Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { motion } from "framer-motion";
import NextLink from "next/link";

export default function NotFound() {
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
          variant="h1"
          fontWeight={800}
          sx={{
            fontSize: { xs: "5rem", sm: "8rem" },
            background: "linear-gradient(135deg, #7c4dff, #00e5ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography variant="h5" fontWeight={600} color="text.secondary" sx={{ fontSize: "1.1rem" }}>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", maxWidth: 360, fontSize: "0.9rem" }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <NextLink href="/" style={{ textDecoration: "none" }}>
          <Button variant="contained" startIcon={<Home sx={{ fontSize: 18 }} />} sx={{ borderRadius: 3, mt: 2 }}>
            Go Home
          </Button>
        </NextLink>
      </Box>
    </motion.div>
  );
}
