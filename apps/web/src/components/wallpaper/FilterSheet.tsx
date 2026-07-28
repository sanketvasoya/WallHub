"use client";

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from "@mui/material";
import { Close, FilterList, Refresh } from "@mui/icons-material";
import { useState } from "react";
import type { SortOption } from "@/types";

export interface FilterState {
  sort: SortOption;
  resolution: string;
  orientation: string;
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  onReset: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "hot", label: "Hot" },
  { value: "new", label: "New" },
  { value: "top", label: "Top" },
];

const resolutionOptions = [
  { value: "any", label: "Any Resolution" },
  { value: "3840x2160", label: "4K (2160p)" },
  { value: "2560x1440", label: "2K (1440p)" },
  { value: "1920x1080", label: "FHD (1080p)" },
];

const orientationOptions = [
  { value: "any", label: "Any Aspect" },
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "square", label: "Square" },
];

export default function FilterSheet({
  open,
  onClose,
  filters,
  onApply,
  onReset,
}: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleSortChange = (_: unknown, val: SortOption | null) => {
    if (val) setLocalFilters((prev) => ({ ...prev, sort: val }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setLocalFilters({ sort: "hot", resolution: "any", orientation: "any" });
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "24px 24px 0 0",
          maxHeight: "85vh",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(14,14,22,0.98)" : "rgba(255,255,255,0.98)",
          backdropFilter: "blur(40px)",
        },
      }}
    >
      <Box sx={{ p: 3, maxWidth: 500, mx: "auto", width: "100%" }}>
        {/* Handle */}
        <Box
          sx={{
            width: 36,
            height: 4,
            bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"),
            borderRadius: 2,
            mx: "auto",
            mb: 2,
          }}
        />

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterList sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight={700}>
              Filters & Sorting
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Close filters">
            <Close />
          </IconButton>
        </Box>

        {/* Sorting */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
            SORT BY
          </Typography>
          <ToggleButtonGroup
            value={localFilters.sort}
            exclusive
            onChange={handleSortChange}
            fullWidth
            size="small"
          >
            {sortOptions.map((opt) => (
              <ToggleButton key={opt.value} value={opt.value}>
                {opt.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ my: 2.5, opacity: 0.08 }} />

        {/* Orientation */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
            ASPECT RATIO
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {orientationOptions.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setLocalFilters((prev) => ({ ...prev, orientation: opt.value }))}
                color={localFilters.orientation === opt.value ? "primary" : "default"}
                variant={localFilters.orientation === opt.value ? "filled" : "outlined"}
                sx={{ borderRadius: 2, cursor: "pointer", fontWeight: 600 }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2.5, opacity: 0.08 }} />

        {/* Resolution */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
            MINIMUM RESOLUTION
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {resolutionOptions.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setLocalFilters((prev) => ({ ...prev, resolution: opt.value }))}
                color={localFilters.resolution === opt.value ? "primary" : "default"}
                variant={localFilters.resolution === opt.value ? "filled" : "outlined"}
                sx={{ borderRadius: 2, cursor: "pointer", fontWeight: 600 }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<Refresh />}
            sx={{ flex: 1, borderRadius: 3 }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{ flex: 2, borderRadius: 3 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
