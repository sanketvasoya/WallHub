"use client";

import { Box, TextField, InputAdornment, IconButton, Chip, Typography } from "@mui/material";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useSearchHistoryStore } from "@/lib/stores";
import { TRENDING_SEARCHES } from "@/lib/constants";
import { tokens } from "@/lib/tokens";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelect: (term: string) => void;
  autoFocus?: boolean;
  showSuggestions?: boolean;
}

const suggestionsVariants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12 },
  },
};

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  onSelect,
  autoFocus = false,
  showSuggestions = true,
}: SearchInputProps) {
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistoryStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addSearch(value.trim());
      onSubmit();
    }
  };

  const handleSelect = (term: string) => {
    addSearch(term);
    onSelect(term);
  };

  const hasSuggestions = history.length > 0 || TRENDING_SEARCHES.length > 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search wallpapers..."
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} style={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: value ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onChange("")}
                    sx={{
                      width: 28,
                      height: 28,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <X size={15} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
              sx: {
                borderRadius: "100px",
                height: 44,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? tokens.color.surface.dark
                    : tokens.color.surface.light,
                "& fieldset": {
                  border: "1px solid",
                  borderColor: (theme) => theme.palette.divider,
                },
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? tokens.color.surface.darkHover
                      : tokens.color.surface.lightHover,
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? tokens.color.borderDarkHover
                        : tokens.color.borderLightHover,
                  },
                },
                "&.Mui-focused": {
                  "& fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 1.5,
                  },
                },
                fontSize: "0.875rem",
              },
            },
          }}
        />
      </Box>

      <AnimatePresence>
        {showSuggestions && hasSuggestions && (
          <motion.div
            variants={suggestionsVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ position: "absolute", zIndex: 10, left: 0, right: 0, top: "100%" }}
          >
            <Box
              sx={{
                mt: 1,
                mx: 0.5,
                p: 1.5,
                borderRadius: "16px",
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(24, 24, 27, 0.96)"
                    : "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(24px) saturate(1.8)",
                WebkitBackdropFilter: "blur(24px) saturate(1.8)",
                border: "1px solid",
                borderColor: (t) => t.palette.divider,
                boxShadow: (t) =>
                  t.palette.mode === "dark"
                    ? tokens.shadows.dark.lg
                    : tokens.shadows.light.lg,
              }}
            >
              {history.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{
                        fontSize: "0.68rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Recent
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{
                        cursor: "pointer",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={clearHistory}
                    >
                      Clear
                    </Typography>
                  </Box>
                  {history.slice(0, 5).map((term) => (
                    <Box
                      key={term}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1,
                        py: 0.75,
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                      onClick={() => handleSelect(term)}
                    >
                      <Clock size={14} style={{ color: tokens.color.textLightSecondary, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ flex: 1, fontSize: "0.85rem" }}>
                        {term}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSearch(term);
                        }}
                        sx={{ width: 24, height: 24, "&:hover": { bgcolor: "action.hover" } }}
                      >
                        <X size={12} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {TRENDING_SEARCHES.length > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1,
                      mb: 1,
                    }}
                  >
                    <TrendingUp size={13} style={{ color: tokens.color.textLightSecondary }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{
                        fontSize: "0.68rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Trending
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 0.5 }}>
                    {TRENDING_SEARCHES.map((term) => (
                      <Chip
                        key={term}
                        label={term}
                        size="small"
                        onClick={() => handleSelect(term)}
                        sx={{
                          cursor: "pointer",
                          borderRadius: "100px",
                          fontSize: "0.75rem",
                          height: 30,
                          fontWeight: 500,
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          bgcolor: (t) =>
                            t.palette.mode === "dark"
                              ? tokens.color.surface.dark
                              : tokens.color.surface.light,
                          "&:hover": {
                            bgcolor: (t) =>
                              t.palette.mode === "dark"
                                ? tokens.color.primaryAlpha15
                                : tokens.color.primaryAlpha10,
                            borderColor: "primary.main",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
