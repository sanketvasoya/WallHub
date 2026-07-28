"use client";

import { createTheme, alpha } from "@mui/material/styles";
import { tokens } from "@/lib/tokens";

const darkPalette = {
  primary: { main: tokens.color.primary, light: tokens.color.primaryLight, dark: tokens.color.primaryDark },
  secondary: { main: tokens.color.secondary, light: tokens.color.secondaryLight, dark: tokens.color.secondaryDark },
  background: { default: tokens.color.bgDark, paper: tokens.color.bgDarkPaper },
  text: { primary: "#f0f0f5", secondary: "rgba(240,240,245,0.65)" },
  divider: tokens.color.borderDark,
  error: { main: tokens.color.error },
  warning: { main: tokens.color.warning },
  success: { main: tokens.color.success },
  info: { main: tokens.color.info },
};

const lightPalette = {
  primary: { main: "#6200ea", light: "#9d46ff", dark: "#2700b3" },
  secondary: { main: "#0097a7", light: "#56c8d8", dark: "#006978" },
  background: { default: tokens.color.bgLight, paper: tokens.color.bgLightPaper },
  text: { primary: "#111118", secondary: "rgba(17,17,24,0.60)" },
  divider: tokens.color.borderLight,
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
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: 'var(--font-plus-jakarta), "Roboto", "Helvetica", sans-serif',
      h1: {
        fontWeight: tokens.typography.weight.extrabold,
        letterSpacing: "-0.03em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        lineHeight: 1.1,
      },
      h2: {
        fontWeight: tokens.typography.weight.bold,
        letterSpacing: "-0.025em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        lineHeight: 1.15,
      },
      h3: {
        fontWeight: tokens.typography.weight.bold,
        letterSpacing: "-0.02em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        lineHeight: 1.2,
      },
      h4: {
        fontWeight: tokens.typography.weight.bold,
        letterSpacing: "-0.015em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        lineHeight: 1.25,
      },
      h5: {
        fontWeight: tokens.typography.weight.semibold,
        letterSpacing: "-0.01em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        lineHeight: 1.3,
      },
      h6: {
        fontWeight: tokens.typography.weight.semibold,
        letterSpacing: "-0.005em",
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        lineHeight: 1.35,
      },
      subtitle1: { fontWeight: tokens.typography.weight.medium, letterSpacing: "-0.005em", lineHeight: 1.4 },
      subtitle2: { fontWeight: tokens.typography.weight.semibold, letterSpacing: "0em", lineHeight: 1.4 },
      body1: { fontWeight: tokens.typography.weight.regular, lineHeight: 1.6 },
      body2: { fontWeight: tokens.typography.weight.regular, lineHeight: 1.5 },
      button: { textTransform: "none", fontWeight: tokens.typography.weight.semibold, letterSpacing: "0.01em" },
      caption: { fontWeight: tokens.typography.weight.medium, letterSpacing: "0.02em" },
      overline: { fontWeight: tokens.typography.weight.semibold, letterSpacing: "0.08em", lineHeight: 1.5 },
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
          "::-webkit-scrollbar-thumb:hover": {
            background: alpha(palette.primary.main, 0.45),
          },
          // Global focus-visible styles
          "*:focus-visible": {
            outline: `2px solid ${palette.primary.main}`,
            outlineOffset: "2px",
          },
          // Reduced motion
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
            borderRadius: tokens.radius.md,
            padding: "10px 24px",
            fontWeight: tokens.typography.weight.semibold,
            fontSize: tokens.typography.size.base,
            letterSpacing: "0.01em",
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.spring}`,
          },
          contained: {
            boxShadow: isDark ? tokens.shadows.dark.primarySm : tokens.shadows.light.primarySm,
            "&:hover": {
              boxShadow: isDark ? tokens.shadows.dark.primaryMd : tokens.shadows.light.primaryMd,
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
            borderRadius: tokens.radius.lg,
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
          rounded: { borderRadius: tokens.radius.lg },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.sm,
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.spring}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.sm,
            fontWeight: tokens.typography.weight.medium,
            fontSize: tokens.typography.size.sm,
            transition: `all ${tokens.animation.duration.fast}ms ${tokens.animation.ease.spring}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: tokens.radius.xl,
            backgroundImage: "none",
            boxShadow: isDark ? tokens.shadows.dark.xl : tokens.shadows.light.xl,
          },
          backdrop: {
            backdropFilter: "blur(8px)",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.lg,
            boxShadow: isDark ? tokens.shadows.dark.primaryMd : tokens.shadows.light.primaryMd,
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.md,
            overflow: "hidden",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: `${tokens.radius.md}px !important`,
            border: "none",
            textTransform: "none",
            fontWeight: tokens.typography.weight.semibold,
            fontSize: tokens.typography.size.sm,
            letterSpacing: "0.01em",
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.spring}`,
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            background: isDark
              ? "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)"
              : "linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.09) 50%, rgba(0,0,0,0.04) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 64,
            background: "transparent",
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            minWidth: 0,
            padding: "8px 4px",
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.spring}`,
            "&.Mui-selected": {
              color: palette.primary.main,
            },
            "&.Mui-selected .MuiBottomNavigationAction-label": {
              fontWeight: tokens.typography.weight.bold,
              fontSize: "0.65rem",
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.6rem",
              fontWeight: tokens.typography.weight.medium,
              marginTop: 2,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            backdropFilter: "blur(40px) saturate(1.5)",
            WebkitBackdropFilter: "blur(40px) saturate(1.5)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: tokens.radius.md,
              transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.spring}`,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.md,
            transition: `all ${tokens.animation.duration.normal}ms ${tokens.animation.ease.spring}`,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.full,
            overflow: "hidden",
          },
        },
      },
      MuiCircularProgress: {
        defaultProps: {
          thickness: 3,
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: tokens.radius.sm,
            fontSize: tokens.typography.size.xs,
            fontWeight: tokens.typography.weight.semibold,
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
