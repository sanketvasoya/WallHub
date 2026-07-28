"use client";

import { useState, useMemo, useCallback } from "react";
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
  Divider,
  Tooltip,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu,
  X,
  Search as SearchIcon,
  Smartphone,
  Monitor,
  Layers,
  Moon,
  Sun,
  MonitorSpeaker,
  Flame,
  ChevronRight,
} from "lucide-react";
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
import type { ThemeMode } from "@/types";

const MotionAppBar = motion.create(AppBar);

const themeOptions: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
  { value: "dark", icon: <Moon size={18} />, label: "Dark" },
  { value: "light", icon: <Sun size={18} />, label: "Light" },
  { value: "system", icon: <MonitorSpeaker size={18} />, label: "System" },
];

const drawerVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

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
  const cycleTheme = useCallback(() => {
    const next = (currentThemeIdx + 1) % themeOptions.length;
    setTheme(themeOptions[next]!.value);
  }, [currentThemeIdx, setTheme]);

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

  const handleNav = useCallback(
    (href: string) => {
      router.push(href);
      setDrawerOpen(false);
    },
    [router]
  );

  return (
    <>
      <MotionAppBar
        position="sticky"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        elevation={0}
        sx={{
          bgcolor: "transparent",
          borderBottom: "none",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          backgroundColor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(9, 9, 11, 0.78)"
              : "rgba(250, 251, 255, 0.78)",
        }}
      >
        <Toolbar
          sx={{
            gap: 1,
            px: { xs: 1.5, sm: 3 },
            minHeight: { xs: 56, sm: 64 },
          }}
        >
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
            <Menu size={20} />
          </IconButton>

          <NextLink
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: tokens.gradient.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 16px ${tokens.color.primaryAlpha30}`,
              }}
            >
              <Flame size={18} color="#fff" strokeWidth={2.5} />
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
                letterSpacing: "-0.02em",
              }}
            >
              Wallection
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
                <SearchIcon size={20} />
              </IconButton>
            )}
          </Box>

          {!isMobile && (
            <Tooltip
              title={`Orientation: ${orientation === "phone" ? "Phone" : orientation === "desktop" ? "Desktop" : "All"}`}
            >
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
                    borderRadius: "10px !important",
                    textTransform: "none",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    gap: 0.5,
                    color: "text.secondary",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      borderColor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    },
                  },
                }}
              >
                <ToggleButton value="phone">
                  <Smartphone size={14} />
                  Phone
                </ToggleButton>
                <ToggleButton value="desktop">
                  <Monitor size={14} />
                  Desktop
                </ToggleButton>
                <ToggleButton value="all">
                  <Layers size={14} />
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
            bgcolor: "transparent",
            borderRight: "none",
            backdropFilter: "blur(40px) saturate(1.8)",
            WebkitBackdropFilter: "blur(40px) saturate(1.8)",
            backgroundColor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(9, 9, 11, 0.92)"
                : "rgba(250, 251, 255, 0.92)",
          },
        }}
      >
        <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: tokens.gradient.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 16px ${tokens.color.primaryAlpha30}`,
              }}
            >
              <Flame size={18} color="#fff" strokeWidth={2.5} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              Wallection
            </Typography>
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: "text.secondary", "&:hover": { bgcolor: "action.hover" } }}
          >
            <X size={18} />
          </IconButton>
        </Box>

        <Divider sx={{ opacity: 0.06 }} />

        <List sx={{ px: 1, py: 0.5 }}>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.href, pathname);
            return (
              <motion.div key={item.href} custom={i} variants={listItemVariants} initial="hidden" animate="visible">
                <ListItemButton
                  selected={active}
                  onClick={() => handleNav(item.href)}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.25,
                    py: 1.25,
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                      bgcolor: (t) =>
                        t.palette.mode === "dark"
                          ? tokens.color.primaryAlpha15
                          : tokens.color.primaryAlpha10,
                      "&:hover": {
                        bgcolor: (t) =>
                          t.palette.mode === "dark"
                            ? tokens.color.primaryAlpha20
                            : tokens.color.primaryAlpha15,
                      },
                    },
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38 }}>
                    <Icon
                      size={19}
                      style={{ color: active ? tokens.color.primary : undefined }}
                      className={active ? "" : "MuiTypography-colorSecondary"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: "0.9rem",
                      color: active ? "text.primary" : "text.secondary",
                    }}
                  />
                  {active && (
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                      }}
                    />
                  )}
                </ListItemButton>
              </motion.div>
            );
          })}
        </List>

        <Divider sx={{ mx: 2, opacity: 0.06 }} />

        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "block",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.65rem",
            }}
          >
            Browse Categories
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={16} style={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontSize: "0.8rem",
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? tokens.color.surface.dark
                    : tokens.color.surface.light,
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
                sx={{
                  borderRadius: "10px",
                  py: 0.75,
                  minHeight: 36,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ListItemText
                  primary={cat.name}
                  primaryTypographyProps={{ fontSize: "0.82rem", fontWeight: 500 }}
                />
                <ChevronRight size={14} style={{ color: tokens.color.textLightSecondary, opacity: 0.5 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Divider sx={{ mx: 2, opacity: 0.06 }} />

        <List sx={{ px: 1, mt: 0.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              px: 2,
              mb: 1,
              display: "block",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.65rem",
            }}
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
                borderRadius: "12px",
                py: 1,
                "&.Mui-selected": {
                  bgcolor: (t) =>
                    t.palette.mode === "dark"
                      ? tokens.color.primaryAlpha15
                      : tokens.color.primaryAlpha10,
                },
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{opt.icon}</ListItemIcon>
              <ListItemText
                primary={opt.label}
                primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
              />
              {theme === opt.value && (
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                  }}
                />
              )}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
