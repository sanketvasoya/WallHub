"use client";

import { createTheme } from "@mui/material/styles";
import { tokens } from "@/lib/tokens";

const darkPalette = {
  primary: { main: tokens.color.primary, light: tokens.color.primary, dark: tokens.color.primary },
  secondary: { main: tokens.color.secondary, light: tokens.color.secondary, dark: tokens.color.secondary },
  background: { default: tokens.color.bg, paper: tokens.color.surface },
  text: { primary: tokens.color.textPrimary, secondary: tokens.color.textSecondary },
  divider: tokens.color.border,
  error: { main: tokens.color.error },
};

export function getTheme(mode: "light" | "dark") {
  const palette = mode === "dark" ? darkPalette : {
    ...darkPalette,
    background: { default: "#F5F5F7", paper: "#FFFFFF" },
    text: { primary: "#1D1D1F", secondary: "#6E6E73" },
    divider: "rgba(0,0,0,0.08)",
  };

  return createTheme({
    palette: { mode, ...palette },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      h1: { fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 },
      h2: { fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15 },
      h3: { fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 },
      h4: { fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.25 },
      h5: { fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 },
      h6: { fontWeight: 600, letterSpacing: "-0.005em", lineHeight: 1.35 },
      subtitle1: { fontWeight: 500, letterSpacing: "-0.005em", lineHeight: 1.4 },
      subtitle2: { fontWeight: 600, letterSpacing: "0em", lineHeight: 1.4 },
      body1: { fontWeight: 400, lineHeight: 1.6 },
      body2: { fontWeight: 400, lineHeight: 1.5 },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
      caption: { fontWeight: 500, letterSpacing: "0.02em" },
      overline: { fontWeight: 600, letterSpacing: "0.08em", lineHeight: 1.5 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: "smooth",
            overflowX: "hidden",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.button,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "0.875rem",
            transition: "all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },
            "&:active": { transform: "translateY(0)" },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            transition: "all 0.2s ease",
          },
        },
      },
    },
  });
}
