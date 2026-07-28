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
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.4),
        ease: tokens.animation.curve.standard,
      }}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: tokens.animation.curve.standard } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/collections/${collection.slug}`)}
      sx={{
        position: "relative",
        p: 2.5,
        borderRadius: tokens.radius.xl,
        cursor: "pointer",
        overflow: "hidden",
        background: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
        border: "1px solid",
        borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
        transition: "border-color 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1)",
        "&:hover": {
          borderColor: tokens.color.primary,
          boxShadow: isDark ? tokens.shadows.dark.sm : tokens.shadows.light.md,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "0.95rem",
          mb: 0.5,
          color: "text.primary",
          letterSpacing: "-0.01em",
        }}
      >
        {collection.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.8rem",
          lineHeight: 1.45,
          color: "text.secondary",
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
