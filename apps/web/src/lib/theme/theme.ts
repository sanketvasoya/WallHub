"use client";

import { createTheme, alpha } from "@mui/material/styles";
import { tokens } from "@/lib/tokens";

const darkPalette = {
  primary: { main: tokens.color.primary, light: tokens.color.primaryLight, dark: tokens.color.primaryDark },
  secondary: { main: tokens.color.secondary, light: tokens.color.secondaryLight, dark: tokens.color.secondaryDark },
  background: { default: "#05050a", paper: "#0e0e16" },
  text: { primary: "#f0f0f5", secondary: "rgba(240,240,245,0.55)" },
  divider: "rgba(255,255,255,0.06)",
};

const lightPalette = {
  primary: { main: "#6200ea", light: "#9d46ff", dark: "#2700b3" },
  secondary: { main: "#0097a7", light: "#56c8d8", dark: "#006978" },
  background: { default: "#f8f8fc", paper: "#ffffff" },
  text: { primary: "#111118", secondary: "rgba(17,17,24,0.5)" },
  divider: "rgba(0,0,0,0.06)",
};

function buildTheme(mode: "light" | "dark") {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  return createTheme({
    palette: { mode, ...palette },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: 'var(--font-plus-jakarta), "Roboto", "Helvetica", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: "-0.03em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: "-0.025em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.015em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.005em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      subtitle1: { fontWeight: 500, letterSpacing: "-0.005em" },
      body1: { fontWeight: 400, lineHeight: 1.6 },
      body2: { fontWeight: 400, lineHeight: 1.5 },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
      caption: { fontWeight: 500, letterSpacing: "0.02em" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": { boxSizing: "border-box", margin: 0, padding: 0 },
          body: {
            scrollBehavior: "smooth",
            overflowX: "hidden",
          },
          "::-webkit-scrollbar": { width: 5 },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            background: alpha(palette.primary.main, 0.25),
            borderRadius: 10,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
          },
          contained: {
            boxShadow: `0 4px 20px ${alpha(palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 6px 28px ${alpha(palette.primary.main, 0.45)}`,
              transform: "translateY(-1px)",
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
            borderRadius: 16,
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
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: "all 0.2s ease",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: "0.75rem",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            backgroundImage: "none",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: { borderRadius: 14 },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: "hidden",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px !important",
            border: "none",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "0.01em",
            px: 2.5,
            py: 1,
          },
        },
      },
    },
  });
}

export function getTheme(mode: "light" | "dark") {
  return buildTheme(mode);
}
