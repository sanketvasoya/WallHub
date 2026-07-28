"use client";

import { createTheme, alpha } from "@mui/material/styles";
import { tokens } from "@/lib/tokens";

const darkPalette = {
  primary: { main: tokens.color.primary, light: tokens.color.primaryLight, dark: tokens.color.primaryDark },
  secondary: { main: tokens.color.secondary, light: tokens.color.secondaryLight, dark: tokens.color.secondaryDark },
  background: { default: tokens.color.bgDark, paper: tokens.color.bgDarkPaper },
  text: { primary: "#FAFAFA", secondary: "#A1A1AA" },
  divider: "rgba(255, 255, 255, 0.08)",
  error: { main: tokens.color.error },
  warning: { main: tokens.color.warning },
  success: { main: tokens.color.success },
  info: { main: tokens.color.info },
};

const lightPalette = {
  primary: { main: tokens.color.primary, light: tokens.color.primaryLight, dark: tokens.color.primaryDark },
  secondary: { main: tokens.color.secondary, light: tokens.color.secondaryLight, dark: tokens.color.secondaryDark },
  background: { default: tokens.color.bgLight, paper: tokens.color.bgLightPaper },
  text: { primary: "#0F172A", secondary: "#64748B" },
  divider: "rgba(0, 0, 0, 0.06)",
  error: { main: tokens.color.error },
  warning: { main: tokens.color.warning },
  success: { main: tokens.color.success },
  info: { main: tokens.color.info },
};

function buildTheme(mode: "light" | "dark") {
  const palette = mode === "dark" ? darkPalette : lightPalette;
  const isDark = mode === "dark";

  return createTheme({
    palette: { mode, ...palette },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      h1: {
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.1,
      },
      h2: {
        fontWeight: 700,
        letterSpacing: "-0.025em",
        lineHeight: 1.15,
      },
      h3: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      },
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.015em",
        lineHeight: 1.25,
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.005em",
        lineHeight: 1.35,
      },
      subtitle1: { fontWeight: 500, letterSpacing: "-0.005em", lineHeight: 1.4 },
      subtitle2: { fontWeight: 600, letterSpacing: "0em", lineHeight: 1.4 },
      body1: { fontWeight: 400, lineHeight: 1.6 },
      body2: { fontWeight: 400, lineHeight: 1.5 },
      button: { textTransform: "none" as const, fontWeight: 600, letterSpacing: "0.01em" },
      caption: { fontWeight: 500, letterSpacing: "0.02em" },
      overline: { fontWeight: 600, letterSpacing: "0.08em", lineHeight: 1.5 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": { boxSizing: "border-box", margin: 0, padding: 0 },
          body: {
            scrollBehavior: "smooth",
            overflowX: "hidden",
          },
          "::-webkit-scrollbar": { width: 6 },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            background: alpha(palette.primary.main, 0.15),
            borderRadius: 10,
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: alpha(palette.primary.main, 0.3),
          },
          "*:focus-visible": {
            outline: `2px solid ${palette.primary.main}`,
            outlineOffset: "2px",
          },
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              animationDuration: "0.01ms !important",
              animationIterationCount: "1 !important",
              transitionDuration: "0.01ms !important",
              scrollBehavior: "auto !important",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.standard}`,
          },
          contained: {
            boxShadow: isDark ? tokens.shadows.dark.primary : tokens.shadows.light.primary,
            "&:hover": {
              boxShadow: isDark
                ? "0 6px 20px rgba(91, 95, 239, 0.45)"
                : "0 6px 20px rgba(91, 95, 239, 0.3)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
          outlined: {
            borderWidth: 1.5,
            "&:hover": { borderWidth: 1.5 },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backgroundImage: "none",
            background: "transparent",
            border: "none",
            overflow: "hidden",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
          rounded: { borderRadius: 20 },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.standard}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 100,
            fontWeight: 500,
            fontSize: "0.8125rem",
            transition: `all ${tokens.animation.duration.fast}ms ${tokens.animation.ease.standard}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            backgroundImage: "none",
            boxShadow: isDark ? tokens.shadows.dark.xl : tokens.shadows.light.xl,
          },
          backdrop: {
            backdropFilter: "blur(8px)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 16,
              transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.standard}`,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.standard}`,
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            background: isDark
              ? "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)"
              : "linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: "0.75rem",
            fontWeight: 500,
            background: isDark ? "rgba(24, 24, 27, 0.95)" : "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
          },
        },
      },
    },
  });
}

export function getTheme(mode: "light" | "dark") {
  return buildTheme(mode);
}
