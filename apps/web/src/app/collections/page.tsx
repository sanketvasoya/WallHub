"use client";

import { Box } from "@mui/material";
import { Collections as CollectionsIcon } from "@mui/icons-material";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import CollectionCard from "@/components/wallpaper/CollectionCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { useCollections } from "@/hooks/useQueries";

export default function CollectionsPage() {
  const { data, isLoading, isError, refetch } = useCollections();
  const collections = data?.collections ?? [];

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <PageHeader
          title="Collections"
          subtitle="Curated theme sets for every mood and aesthetic"
          icon={<CollectionsIcon sx={{ color: "primary.main" }} />}
        />

        {isLoading ? (
          <LoadingSkeleton variant="collection" count={6} />
        ) : isError ? (
          <ErrorState message="Failed to load collections" onRetry={() => refetch()} />
        ) : collections.length === 0 ? (
          <ErrorState type="empty" message="No collections found" />
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

