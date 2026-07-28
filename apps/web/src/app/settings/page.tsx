"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Divider,
  FormControl,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Monitor,
  Settings,
  Trash2,
  Smartphone,
  Monitor as DesktopIcon,
  Image,
  Info,
  Layers,
} from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import { useSettingsStore, useSearchHistoryStore, useDownloadHistoryStore } from "@/lib/stores";
import { useOrientation } from "@/hooks/useOrientation";
import { tokens } from "@/lib/tokens";
import toast from "react-hot-toast";

const MotionBox = motion.create(Box);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      color="primary"
      fontWeight={700}
      sx={{
        mb: 1,
        ml: 1,
        display: "block",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: "0.65rem",
      }}
    >
      {children}
    </Typography>
  );
}

function SettingsContent() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const themeVal = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const gridDensity = useSettingsStore((s) => s.gridDensity);
  const setGridDensity = useSettingsStore((s) => s.setGridDensity);
  const clearSearchHistory = useSearchHistoryStore((s) => s.clearHistory);
  const clearDownloadHistory = useDownloadHistoryStore((s) => s.clearHistory);
  const { resolved: orientation, setPreference: setOrientation } = useOrientation();

  const handleClearSearch = () => {
    clearSearchHistory();
    toast.success("Search history cleared");
  };

  const handleClearDownloads = () => {
    clearDownloadHistory();
    toast.success("Download history cleared");
  };

  const listSx = {
    bgcolor: isDark ? tokens.color.surfaceDark : tokens.color.surfaceLight,
    borderRadius: 3,
    border: "1px solid",
    borderColor: isDark ? tokens.color.borderDark : tokens.color.borderLight,
    mb: 3,
  };

  const selectSx = {
    borderRadius: 2,
    fontSize: "0.85rem",
    fontWeight: 500,
    "& .MuiSelect-select": { py: 1 },
  };

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
            title="Settings"
            subtitle="Customize your app preferences and manage local storage"
            icon={<Settings size={18} strokeWidth={2.2} />}
          />
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: tokens.animation.curve.standard }}
        >
          <SectionLabel>Appearance</SectionLabel>
          <List sx={listSx}>
            <ListItem>
              <ListItemText
                primary="Theme"
                secondary="Choose your preferred color theme"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                secondaryTypographyProps={{ fontSize: "0.78rem" }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={themeVal}
                  onChange={(e) =>
                    setTheme(e.target.value as "light" | "dark" | "system")
                  }
                  sx={selectSx}
                >
                  <MenuItem value="dark">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Moon size={16} /> Dark
                    </Box>
                  </MenuItem>
                  <MenuItem value="light">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Sun size={16} /> Light
                    </Box>
                  </MenuItem>
                  <MenuItem value="system">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Monitor size={16} /> System
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <Divider sx={{ opacity: 0.06 }} />
            <ListItem>
              <ListItemText
                primary="Grid Density"
                secondary="Control wallpaper grid column count"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                secondaryTypographyProps={{ fontSize: "0.78rem" }}
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={gridDensity}
                  onChange={(e) =>
                    setGridDensity(
                      e.target.value as "compact" | "comfortable" | "spacious"
                    )
                  }
                  sx={selectSx}
                >
                  <MenuItem value="compact">Compact</MenuItem>
                  <MenuItem value="comfortable">Comfortable</MenuItem>
                  <MenuItem value="spacious">Spacious</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <Divider sx={{ opacity: 0.06 }} />
            <ListItem>
              <ListItemText
                primary="Wallpaper Orientation"
                secondary="Filter wallpapers by aspect ratio"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                secondaryTypographyProps={{ fontSize: "0.78rem" }}
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={orientation}
                  onChange={(e) =>
                    setOrientation(
                      e.target.value as "phone" | "desktop" | "all"
                    )
                  }
                  sx={selectSx}
                >
                  <MenuItem value="phone">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Smartphone size={16} /> Phone
                    </Box>
                  </MenuItem>
                  <MenuItem value="desktop">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DesktopIcon size={16} /> Desktop
                    </Box>
                  </MenuItem>
                  <MenuItem value="all">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Image size={16} /> All
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: tokens.animation.curve.standard }}
        >
          <SectionLabel>Data & Privacy</SectionLabel>
          <List sx={listSx}>
            <ListItem>
              <ListItemText
                primary="Clear Search History"
                secondary="Remove all saved search suggestions"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                secondaryTypographyProps={{ fontSize: "0.78rem" }}
              />
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleClearSearch}
                startIcon={<Trash2 size={14} />}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                Clear
              </Button>
            </ListItem>
            <Divider sx={{ opacity: 0.06 }} />
            <ListItem>
              <ListItemText
                primary="Clear Download History"
                secondary="Remove download history entries"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                secondaryTypographyProps={{ fontSize: "0.78rem" }}
              />
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleClearDownloads}
                startIcon={<Trash2 size={14} />}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                Clear
              </Button>
            </ListItem>
          </List>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: tokens.animation.curve.standard }}
        >
          <SectionLabel>About</SectionLabel>
          <List sx={listSx}>
            <ListItem>
              <ListItemText
                primary="Wallection"
                secondary="Version 2.0.0 (Production Polish)"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                secondaryTypographyProps={{ fontSize: "0.78rem" }}
              />
            </ListItem>
            <Divider sx={{ opacity: 0.06 }} />
            <ListItem>
              <ListItemText
                primary="Platform Stack"
                secondary="Next.js 15, MUI v7, TanStack Query & Fastify"
                primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
                secondaryTypographyProps={{ fontSize: "0.78rem" }}
              />
            </ListItem>
          </List>
        </MotionBox>
      </Box>

      <BottomNav />
    </Box>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}
