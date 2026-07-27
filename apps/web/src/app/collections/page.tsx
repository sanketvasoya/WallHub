"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { Collections as CollectionsIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useCollections } from "@/hooks/useQueries";
import { tokens } from "@/lib/tokens";
import type { Collection } from "@/types";

const MotionBox = motion.create(Box);

function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => router.push(`/collections/${collection.slug}`)}
      sx={{
        position: "relative",
        p: 2.5,
        borderRadius: 3,
        cursor: "pointer",
        overflow: "hidden",
        background: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.02)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "primary.main",
          boxShadow: `0 8px 32px ${isDark ? "rgba(124,77,255,0.15)" : "rgba(98,0,234,0.1)"}`,
        },
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem", mb: 0.5 }}>
        {collection.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
        {collection.description}
      </Typography>
    </MotionBox>
  );
}

export default function CollectionsPage() {
  const { data, isLoading, isError } = useCollections();
  const collections = data?.collections ?? [];

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <CollectionsIcon sx={{ color: "primary.main", fontSize: 22 }} />
          <Typography variant="h5" fontWeight={800}>
            Collections
          </Typography>
        </Box>

        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : isError ? (
          <ErrorState message="Failed to load collections" onRetry={() => window.location.reload()} />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 2,
            }}
          >
            {collections.map((collection, i) => (
              <CollectionCard key={collection.slug} collection={collection} index={i} />
            ))}
          </Box>
        )}
      </Box>
      <BottomNav />
    </Box>
  );
}
