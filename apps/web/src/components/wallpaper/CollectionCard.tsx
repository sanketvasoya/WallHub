"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/tokens";
import type { Collection } from "@/types";

const MotionBox = motion.create(Box);

interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

export default function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  return (
    <MotionBox
      role="button"
      aria-label={`Explore ${collection.name} collection`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      onClick={() => router.push(`/collections/${collection.slug}`)}
      sx={{
        position: "relative",
        p: 2.5,
        borderRadius: 3.5,
        cursor: "pointer",
        overflow: "hidden",
        background: isDark
          ? tokens.color.surfaceDark
          : tokens.color.surfaceLight,
        border: "1px solid",
        borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
        transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "primary.main",
          boxShadow: isDark
            ? tokens.shadows.dark.primarySm
            : tokens.shadows.light.primarySm,
        },
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ fontSize: "0.95rem", mb: 0.5, color: "text.primary" }}>
        {collection.name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: "0.78rem",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {collection.description}
      </Typography>
    </MotionBox>
  );
}
