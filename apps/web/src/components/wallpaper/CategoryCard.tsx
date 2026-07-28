"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { getCategoryIcon } from "@/lib/icons";
import { tokens } from "@/lib/tokens";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const IconComponent = getCategoryIcon(category.icon);

  return (
    <NextLink href={`/category/${category.slug}`} style={{ textDecoration: "none" }}>
      <motion.div
        role="button"
        aria-label={`Explore ${category.name} wallpapers`}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          delay: Math.min(index * 0.04, 0.35),
          ease: tokens.animation.curve.standard,
        }}
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            textAlign: "center",
            borderRadius: tokens.radius.xl,
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            background: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
            border: "1px solid",
            borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
            "&:hover": {
              background: isDark ? "rgba(91,95,239,0.08)" : "rgba(91,95,239,0.04)",
              borderColor: tokens.color.primary,
              boxShadow: isDark ? tokens.shadows.dark.sm : tokens.shadows.light.md,
            },
          }}
        >
          {/* Icon container */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: tokens.radius.md,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark
                ? `linear-gradient(135deg, ${tokens.color.primaryAlpha20} 0%, ${tokens.color.accentAlpha10} 100%)`
                : `linear-gradient(135deg, ${tokens.color.primaryAlpha15} 0%, ${tokens.color.accentAlpha10} 100%)`,
              transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <IconComponent size={26} color={tokens.color.primary} strokeWidth={2} />
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              {category.name}
            </Typography>
            {category.description && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  color: "text.secondary",
                  lineHeight: 1.4,
                  mt: 0.25,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {category.description}
              </Typography>
            )}
          </Box>
        </Box>
      </motion.div>
    </NextLink>
  );
}
