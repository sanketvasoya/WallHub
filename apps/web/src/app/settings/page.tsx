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
} from "@mui/material";
import { DarkMode, LightMode, Brightness6, Settings as SettingsIcon, DeleteOutline, PhoneIphone, DesktopWindows, Wallpaper } from "@mui/icons-material";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import { useSettingsStore, useSearchHistoryStore, useDownloadHistoryStore } from "@/lib/stores";
import { useOrientation } from "@/hooks/useOrientation";
import toast from "react-hot-toast";

function SettingsContent() {
  const theme = useSettingsStore((s) => s.theme);
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

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <PageHeader
          title="Settings"
          subtitle="Customize your app preferences and manage local storage"
          icon={<SettingsIcon sx={{ color: "primary.main" }} />}
        />

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
          Appearance
        </Typography>
        <List
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <ListItem>
            <ListItemText
              primary="Theme"
              secondary="Choose your preferred color theme"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
              secondaryTypographyProps={{ fontSize: "0.78rem" }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                sx={{
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  "& .MuiSelect-select": { py: 1 },
                }}
              >
                <MenuItem value="dark">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DarkMode sx={{ fontSize: 17 }} /> Dark
                  </Box>
                </MenuItem>
                <MenuItem value="light">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LightMode sx={{ fontSize: 17 }} /> Light
                  </Box>
                </MenuItem>
                <MenuItem value="system">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Brightness6 sx={{ fontSize: 17 }} /> System
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
                onChange={(e) => setGridDensity(e.target.value as "compact" | "comfortable" | "spacious")}
                sx={{
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  "& .MuiSelect-select": { py: 1 },
                }}
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
                onChange={(e) => setOrientation(e.target.value as "phone" | "desktop" | "all")}
                sx={{
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  "& .MuiSelect-select": { py: 1 },
                }}
              >
                <MenuItem value="phone">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhoneIphone sx={{ fontSize: 17 }} /> Phone
                  </Box>
                </MenuItem>
                <MenuItem value="desktop">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DesktopWindows sx={{ fontSize: 17 }} /> Desktop
                  </Box>
                </MenuItem>
                <MenuItem value="all">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Wallpaper sx={{ fontSize: 17 }} /> All
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>

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
          Data & Privacy
        </Typography>
        <List
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
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
              startIcon={<DeleteOutline sx={{ fontSize: 16 }} />}
              sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}
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
              startIcon={<DeleteOutline sx={{ fontSize: 16 }} />}
              sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}
            >
              Clear
            </Button>
          </ListItem>
        </List>

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
          About
        </Typography>
        <List
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
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
      </Box>

      <BottomNav />
    </Box>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}

