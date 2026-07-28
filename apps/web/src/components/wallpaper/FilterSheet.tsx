"use client";

import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  useTheme,
} from "@mui/material";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useState } from "react";
import { tokens } from "@/lib/tokens";
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
  { value: "relevance", label: "Relevance" },
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

export default function FilterSheet({ open, onClose, filters, onApply, onReset }: FilterSheetProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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

  const sectionLabel = {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "text.secondary",
    mb: 1.5,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: tokens.radius["2xl"],
            m: 2,
            maxHeight: "85vh",
            background: isDark ? "rgba(18,18,24,0.98)" : "rgba(255,255,255,0.98)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          },
        },
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          },
        },
      }}
    >
      <Box sx={{ p: 3, maxWidth: 460, mx: "auto", width: "100%" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SlidersHorizontal size={18} color={tokens.color.primary} strokeWidth={2.5} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>
              Filters & Sorting
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close filters"
            sx={{
              width: 32,
              height: 32,
              borderRadius: tokens.radius.sm,
              bgcolor: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
              "&:hover": { bgcolor: isDark ? tokens.color.surfaceDarkHover : tokens.color.surfaceLightHover },
            }}
          >
            <X size={16} strokeWidth={2} />
          </IconButton>
        </Box>

        {/* Sorting */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={sectionLabel}>Sort By</Typography>
          <ToggleButtonGroup
            value={localFilters.sort}
            exclusive
            onChange={handleSortChange}
            fullWidth
            size="small"
          >
            {sortOptions.map((opt) => (
              <ToggleButton key={opt.value} value={opt.value} sx={{ borderRadius: `${tokens.radius.md}px !important` }}>
                {opt.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ my: 2.5, opacity: isDark ? 0.08 : 0.06 }} />

        {/* Orientation */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={sectionLabel}>Aspect Ratio</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {orientationOptions.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setLocalFilters((prev) => ({ ...prev, orientation: opt.value }))}
                color={localFilters.orientation === opt.value ? "primary" : "default"}
                variant={localFilters.orientation === opt.value ? "filled" : "outlined"}
                sx={{ borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2.5, opacity: isDark ? 0.08 : 0.06 }} />

        {/* Resolution */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={sectionLabel}>Minimum Resolution</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {resolutionOptions.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setLocalFilters((prev) => ({ ...prev, resolution: opt.value }))}
                color={localFilters.resolution === opt.value ? "primary" : "default"}
                variant={localFilters.resolution === opt.value ? "filled" : "outlined"}
                sx={{ borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<RotateCcw size={16} strokeWidth={2} />}
            sx={{ flex: 1, borderRadius: tokens.radius.lg }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{ flex: 2, borderRadius: tokens.radius.lg }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
