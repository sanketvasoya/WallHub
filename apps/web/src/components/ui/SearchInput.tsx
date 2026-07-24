"use client";

import { Box, TextField, InputAdornment, IconButton, Chip, Typography } from "@mui/material";
import { Search, Close, TrendingUp, History } from "@mui/icons-material";
import { useSearchHistoryStore } from "@/lib/stores";
import { TRENDING_SEARCHES } from "@/lib/constants";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelect: (term: string) => void;
  autoFocus?: boolean;
  showSuggestions?: boolean;
}

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
                  <Search sx={{ color: "text.secondary", fontSize: 20 }} />
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
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
              sx: {
                borderRadius: 100,
                height: 48,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.03)",
                "& fieldset": { border: "1px solid", borderColor: (theme) => theme.palette.divider },
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.05)",
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(0,0,0,0.12)",
                  },
                },
                "&.Mui-focused": {
                  "& fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 1.5,
                  },
                },
                fontSize: "0.9rem",
              },
            },
          }}
        />
      </Box>

      {showSuggestions && hasSuggestions && (
        <Box sx={{ mt: 1.5, px: 0.5 }}>
          {history.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Recent
                </Typography>
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ cursor: "pointer", fontSize: "0.7rem", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
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
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => handleSelect(term)}
                >
                  <History sx={{ fontSize: 15, color: "text.secondary" }} />
                  <Typography variant="body2" sx={{ flex: 1, fontSize: "0.85rem" }}>
                    {term}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(term);
                    }}
                    sx={{ width: 24, height: 24 }}
                  >
                    <Close sx={{ fontSize: 13 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {TRENDING_SEARCHES.length > 0 && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, mb: 1 }}>
                <TrendingUp sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
                      borderRadius: 100,
                      fontSize: "0.75rem",
                      height: 30,
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(124,77,255,0.15)"
                            : "rgba(98,0,234,0.1)",
                        borderColor: "primary.main",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
