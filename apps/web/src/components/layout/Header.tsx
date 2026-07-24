"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Divider,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu,
  DarkMode,
  LightMode,
  Brightness6,
  Whatshot,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/stores";
import { useResolvedTheme } from "@/providers/ThemeProvider";
import SearchBar from "@/components/ui/SearchBar";
import { navItems, isActive } from "@/lib/nav";
import { tokens } from "@/lib/tokens";

const MotionAppBar = motion.create(AppBar);

const themeOptions = [
  { value: "dark" as const, icon: <DarkMode sx={{ fontSize: 20 }} />, label: "Dark" },
  { value: "light" as const, icon: <LightMode sx={{ fontSize: 20 }} />, label: "Light" },
  { value: "system" as const, icon: <Brightness6 sx={{ fontSize: 20 }} />, label: "System" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const muiTheme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useSettingsStore();
  const { resolved } = useResolvedTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const currentThemeIdx = themeOptions.findIndex((t) => t.value === theme);
  const cycleTheme = () => {
    const next = (currentThemeIdx + 1) % themeOptions.length;
    setTheme(themeOptions[next]!.value);
  };

  return (
    <>
      <MotionAppBar
        position="sticky"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        elevation={0}
        sx={{
          bgcolor: "transparent",
          borderBottom: "none",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          backgroundColor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(5,5,10,0.8)"
              : "rgba(248,248,252,0.8)",
        }}
      >
        <Toolbar sx={{ gap: 1, px: { xs: 1.5, sm: 3 }, minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{
              mr: 0.5,
              color: "text.primary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Menu sx={{ fontSize: 22 }} />
          </IconButton>

          <NextLink href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2.5,
                background: tokens.gradient.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 16px ${tokens.color.primaryLightCss}`,
              }}
            >
              <Whatshot sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: tokens.gradient.text,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
                fontSize: "1.15rem",
              }}
            >
              WallHub
            </Typography>
          </NextLink>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", mx: 2 }}>
            {!isMobile && <SearchBar />}
          </Box>

          <Tooltip title={`Theme: ${themeOptions[currentThemeIdx]?.label}`}>
            <IconButton
              onClick={cycleTheme}
              sx={{
                color: "text.secondary",
                transition: "all 0.25s ease",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "action.hover",
                  transform: "rotate(15deg)",
                },
              }}
            >
              {themeOptions[currentThemeIdx]?.icon}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </MotionAppBar>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "background.default",
            borderRight: "none",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          },
        }}
      >
        <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              background: tokens.gradient.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 16px ${tokens.color.primaryLightCss}`,
            }}
          >
            <Whatshot sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Typography variant="h6" fontWeight={800}>
            WallHub
          </Typography>
        </Box>
        <Divider sx={{ opacity: 0.06 }} />
        <List sx={{ px: 1, py: 0.5 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, pathname);
            return (
              <ListItemButton
                key={item.href}
                selected={active}
                onClick={() => {
                  router.push(item.href);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2.5,
                  mb: 0.25,
                  py: 1.25,
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(124,77,255,0.12)"
                        : "rgba(98,0,234,0.08)",
                    "&:hover": {
                      bgcolor: (t) =>
                        t.palette.mode === "dark"
                          ? "rgba(124,77,255,0.18)"
                          : "rgba(98,0,234,0.12)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38 }}>
                  <Icon sx={{ fontSize: 21, color: active ? "primary.main" : "text.secondary" }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
        <Divider sx={{ mx: 2, opacity: 0.06 }} />
        <List sx={{ px: 1, mt: 0.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 2, mb: 1, display: "block", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.65rem" }}
          >
            Theme
          </Typography>
          {themeOptions.map((opt) => (
            <ListItemButton
              key={opt.value}
              selected={theme === opt.value}
              onClick={() => {
                setTheme(opt.value);
                setDrawerOpen(false);
              }}
              sx={{
                borderRadius: 2.5,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: (t) =>
                    t.palette.mode === "dark"
                      ? "rgba(124,77,255,0.12)"
                      : "rgba(98,0,234,0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{opt.icon}</ListItemIcon>
              <ListItemText primary={opt.label} primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
