"use client";

import { Box, Typography } from "@mui/material";
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
  const IconComponent = getCategoryIcon(category.icon);

  return (
    <NextLink href={`/category/${category.slug}`} style={{ textDecoration: "none" }}>
      <motion.div
        role="button"
        aria-label={`Explore ${category.name} wallpapers`}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.35), ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.25,
            cursor: "pointer",
            textAlign: "center",
            borderRadius: 3.5,
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? tokens.color.surfaceDark
                : tokens.color.surfaceLight,
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? tokens.color.borderDark
                : tokens.color.borderLight,
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(124,77,255,0.08)"
                  : "rgba(98,0,234,0.04)",
              borderColor: "primary.main",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? tokens.shadows.dark.primarySm
                  : tokens.shadows.light.primarySm,
            },
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(124,77,255,0.25) 0%, rgba(0,229,255,0.15) 100%)"
                  : "linear-gradient(135deg, rgba(98,0,234,0.12) 0%, rgba(0,151,167,0.08) 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease",
            }}
          >
            <IconComponent sx={{ color: "primary.main", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ fontSize: "0.85rem", color: "text.primary", lineHeight: 1.2 }}
            >
              {category.name}
            </Typography>
            {category.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.68rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mt: 0.25,
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

