"use client";

import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import CollectionCard from "@/components/wallpaper/CollectionCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useCollections } from "@/hooks/useQueries";
import { tokens } from "@/lib/tokens";

const MotionBox = motion.create(Box);

export default function CollectionsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading, isError, refetch } = useCollections();
  const collections = data?.collections ?? [];

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: tokens.animation.curve.standard }}
        >
          <PageHeader
            title="Collections"
            subtitle="Curated theme sets for every mood and aesthetic"
            icon={<Grid3X3 size={18} strokeWidth={2.2} />}
          />
        </MotionBox>

        {isLoading ? (
          <LoadingSkeleton variant="collection" count={6} />
        ) : isError ? (
          <ErrorState
            message="Failed to load collections"
            onRetry={() => refetch()}
          />
        ) : collections.length === 0 ? (
          <ErrorState type="empty" message="No collections found" />
        ) : (
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: tokens.animation.curve.standard,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2,
              }}
            >
              {collections.map((collection, i) => (
                <CollectionCard
                  key={collection.slug}
                  collection={collection}
                  index={i}
                />
              ))}
            </Box>
          </MotionBox>
        )}
      </Box>
      <BottomNav />
    </Box>
  );
}
