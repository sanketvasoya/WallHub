"use client";

import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Divider,
  FormControl,
} from "@mui/material";
import { DarkMode, LightMode, Brightness6 } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useSettingsStore } from "@/lib/stores";

function SettingsContent() {
  const router = useRouter();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <Box sx={{ pb: { xs: 10, sm: 4 } }}>
      <Header />

      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
            Settings
          </Typography>
        </Box>

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
              secondary="Choose your preferred theme"
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
              primary="WallHub"
              secondary="Version 1.0.0"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
              secondaryTypographyProps={{ fontSize: "0.78rem" }}
            />
          </ListItem>
          <Divider sx={{ opacity: 0.06 }} />
          <ListItem>
            <ListItemText
              primary="Premium Wallpaper Platform"
              secondary="Built with Next.js, MUI, and Fastify"
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
