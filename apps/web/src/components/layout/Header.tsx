"use client";

import { useState, useMemo } from "react";
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
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu,
  DarkMode,
  LightMode,
  Brightness6,
  Whatshot,
  Search as SearchIcon,
  PhoneIphone,
  DesktopWindows,
  Wallpaper,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/stores";
import { useResolvedTheme } from "@/providers/ThemeProvider";
import SearchBar from "@/components/ui/SearchBar";
import { navItems, isActive } from "@/lib/nav";
import { tokens } from "@/lib/tokens";
import { useCategories } from "@/hooks/useQueries";
import { useOrientation } from "@/hooks/useOrientation";
import type { OrientationPreference } from "@/types";

const MotionAppBar = motion.create(AppBar);

const themeOptions = [
  { value: "dark" as const, icon: <DarkMode sx={{ fontSize: 20 }} />, label: "Dark" },
  { value: "light" as const, icon: <LightMode sx={{ fontSize: 20 }} />, label: "Light" },
  { value: "system" as const, icon: <Brightness6 sx={{ fontSize: 20 }} />, label: "System" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const muiTheme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useSettingsStore();
  const { resolved } = useResolvedTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const { data: categoriesData } = useCategories();
  const { resolved: orientation, setPreference: setOrientation } = useOrientation();

  const currentThemeIdx = themeOptions.findIndex((t) => t.value === theme);
  const cycleTheme = () => {
    const next = (currentThemeIdx + 1) % themeOptions.length;
    setTheme(themeOptions[next]!.value);
  };

  const filteredCategories = useMemo(() => {
    if (!categoriesData?.categories) return [];
    if (!categorySearch.trim()) return categoriesData.categories;
    const q = categorySearch.toLowerCase();
    return categoriesData.categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [categoriesData?.categories, categorySearch]);

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
            aria-label="Open navigation menu"
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
            {!isMobile ? (
              <SearchBar />
            ) : (
              <IconButton
                aria-label="Search wallpapers"
                onClick={() => router.push("/search")}
                sx={{ ml: "auto", color: "text.secondary" }}
              >
                <SearchIcon sx={{ fontSize: 22 }} />
              </IconButton>
            )}
          </Box>

          {!isMobile && (
            <Tooltip title={`Orientation: ${orientation === "phone" ? "Phone" : orientation === "desktop" ? "Desktop" : "All"}`}>
              <ToggleButtonGroup
                value={orientation}
                exclusive
                onChange={(_, val) => val && setOrientation(val)}
                size="small"
                sx={{
                  mr: 1,
                  "& .MuiToggleButton-root": {
                    px: 1.25,
                    py: 0.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "8px !important",
                    textTransform: "none",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    gap: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                    },
                  },
                }}
              >
                <ToggleButton value="phone">
                  <PhoneIphone sx={{ fontSize: 16 }} />
                  Phone
                </ToggleButton>
                <ToggleButton value="desktop">
                  <DesktopWindows sx={{ fontSize: 16 }} />
                  Desktop
                </ToggleButton>
                <ToggleButton value="all">
                  <Wallpaper sx={{ fontSize: 16 }} />
                  All
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
          )}

          <Tooltip title={`Theme: ${themeOptions[currentThemeIdx]?.label}`}>
            <IconButton
              aria-label={`Toggle theme, current theme: ${themeOptions[currentThemeIdx]?.label}`}
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
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.65rem" }}
          >
            Browse Categories
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.8rem",
                bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              },
            }}
          />
          <List sx={{ maxHeight: 240, overflow: "auto", px: 0 }}>
            {filteredCategories.slice(0, 15).map((cat) => (
              <ListItemButton
                key={cat.slug}
                onClick={() => {
                  router.push(`/category/${cat.slug}`);
                  setDrawerOpen(false);
                  setCategorySearch("");
                }}
                sx={{ borderRadius: 2, py: 0.75, minHeight: 36 }}
              >
                <ListItemText
                  primary={cat.name}
                  primaryTypographyProps={{ fontSize: "0.82rem", fontWeight: 500 }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
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
