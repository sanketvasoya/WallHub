"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { getCategoryIcon } from "@/lib/icons";
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
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
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
            borderRadius: 3,
            transition: "all 0.3s ease",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(124,77,255,0.08)"
                  : "rgba(98,0,234,0.05)",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(124,77,255,0.2)"
                  : "rgba(98,0,234,0.15)",
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(124,77,255,0.2) 0%, rgba(0,229,255,0.12) 100%)"
                  : "linear-gradient(135deg, rgba(98,0,234,0.15) 0%, rgba(0,151,167,0.1) 100%)",
              transition: "all 0.3s ease",
            }}
          >
            <IconComponent sx={{ color: "primary.main", fontSize: 24 }} />
          </Box>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ fontSize: "0.8rem", color: "text.primary" }}
          >
            {category.name}
          </Typography>
        </Box>
      </motion.div>
    </NextLink>
  );
}
