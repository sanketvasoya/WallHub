/**
 * Wallection Design Tokens
 * Single source of truth for all design values.
 * Brand: Modern, Premium, Minimal, Fast, Beautiful
 * Inspired by Linear, Arc, Raycast, Apple, Material 3 Expressive
 */

// ─── Color Primitives ─────────────────────────────────────────────────────────

const colorPrimitives = {
  indigo: {
    400: "#818CF8",
    500: "#5B5FEF",
    600: "#4F46E5",
    700: "#4338CA",
  },
  violet: {
    400: "#A78BFA",
    500: "#7C3AED",
    600: "#6D28D9",
    700: "#5B21B6",
  },
  cyan: {
    300: "#67E8F9",
    400: "#22D3EE",
    500: "#06B6D4",
  },
} as const;

// ─── Semantic Colors ───────────────────────────────────────────────────────────

const semanticColors = {
  primaryAlpha8: "rgba(91, 95, 239, 0.08)",
  primaryAlpha10: "rgba(91, 95, 239, 0.10)",
  primaryAlpha15: "rgba(91, 95, 239, 0.15)",
  primaryAlpha20: "rgba(91, 95, 239, 0.20)",
  primaryAlpha30: "rgba(91, 95, 239, 0.30)",
  secondaryAlpha10: "rgba(124, 58, 237, 0.10)",
  secondaryAlpha15: "rgba(124, 58, 237, 0.15)",
  accentAlpha10: "rgba(34, 211, 238, 0.10)",
  accentAlpha15: "rgba(34, 211, 238, 0.15)",

  error: "#EF4444",
  errorAlpha: "rgba(239, 68, 68, 0.10)",
  warning: "#F59E0B",
  warningAlpha: "rgba(245, 158, 11, 0.10)",
  success: "#22C55E",
  successAlpha: "rgba(34, 197, 94, 0.10)",
  info: "#3B82F6",
  infoAlpha: "rgba(59, 130, 246, 0.10)",

  bgDark: "#09090B",
  bgDarkPaper: "#18181B",
  bgDarkElevated: "#1C1C20",
  bgLight: "#FAFBFF",
  bgLightPaper: "#FFFFFF",
  bgLightElevated: "#FFFFFF",

  textDark: "#FAFAFA",
  textDarkSecondary: "#A1A1AA",
  textLight: "#0F172A",
  textLightSecondary: "#64748B",

  borderDark: "rgba(255, 255, 255, 0.08)",
  borderDarkHover: "rgba(255, 255, 255, 0.14)",
  borderLight: "rgba(0, 0, 0, 0.06)",
  borderLightHover: "rgba(0, 0, 0, 0.12)",

  surfaceDark: "rgba(255, 255, 255, 0.04)",
  surfaceDarkHover: "rgba(255, 255, 255, 0.07)",
  surfaceLight: "rgba(0, 0, 0, 0.02)",
  surfaceLightHover: "rgba(0, 0, 0, 0.04)",
} as const;

// ─── Spacing Scale (8px grid) ─────────────────────────────────────────────────

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ─── Radius Scale ─────────────────────────────────────────────────────────────

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
} as const;

// ─── Shadow / Elevation ───────────────────────────────────────────────────────

export const shadows = {
  dark: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.3)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.4)",
    md: "0 4px 8px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 20px rgba(0, 0, 0, 0.5)",
    xl: "0 20px 40px rgba(0, 0, 0, 0.6)",
    primary: "0 4px 14px rgba(91, 95, 239, 0.35)",
  },
  light: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
    primary: "0 4px 14px rgba(91, 95, 239, 0.2)",
  },
} as const;

// ─── Animation ────────────────────────────────────────────────────────────────

export const animation = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 400,
    xslow: 600,
  },
  curve: {
    standard: [0.16, 1, 0.3, 1] as const,
    decelerate: [0.0, 0.0, 0.2, 1.0] as const,
    spring: [0.34, 1.56, 0.64, 1.0] as const,
  },
  ease: {
    standard: "cubic-bezier(0.16, 1, 0.3, 1)",
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1.0)",
  },
} as const;

// ─── Typography Scale ─────────────────────────────────────────────────────────

export const typography = {
  size: {
    xs: "0.75rem",
    sm: "0.8125rem",
    base: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.65,
  },
  letterSpacing: {
    tighter: "-0.03em",
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em",
    wider: "0.06em",
  },
} as const;

// ─── Grid Density Configs ─────────────────────────────────────────────────────

export const gridDensity = {
  compact: {
    columns: { xs: 3, sm: 4, md: 5, lg: 6 },
    gap: 8,
  },
  comfortable: {
    columns: { xs: 2, sm: 3, md: 4, lg: 5 },
    gap: 12,
  },
  spacious: {
    columns: { xs: 2, sm: 2, md: 3, lg: 4 },
    gap: 16,
  },
} as const;

// ─── Main Export ──────────────────────────────────────────────────────────────

export const tokens = {
  gradient: {
    brand: "linear-gradient(135deg, #5B5FEF 0%, #7C3AED 50%, #22D3EE 100%)",
    primary: "linear-gradient(135deg, #5B5FEF 0%, #7C3AED 100%)",
    primaryHover: "linear-gradient(135deg, #6B6FF5 0%, #8B4AF0 100%)",
    surface: "linear-gradient(135deg, rgba(91,95,239,0.06) 0%, rgba(124,58,237,0.04) 100%)",
    surfaceCard: "linear-gradient(135deg, rgba(91,95,239,0.04) 0%, rgba(124,58,237,0.02) 100%)",
    hero: "linear-gradient(180deg, transparent 0%, rgba(250,251,255,0.95) 100%)",
    heroDark: "linear-gradient(180deg, transparent 0%, rgba(9,9,11,0.95) 100%)",
    heroFull: "linear-gradient(180deg, rgba(250,251,255,0.1) 0%, transparent 30%, transparent 60%, rgba(250,251,255,0.95) 100%)",
    heroFullDark: "linear-gradient(180deg, rgba(9,9,11,0.1) 0%, transparent 30%, transparent 60%, rgba(9,9,11,0.95) 100%)",
    text: "linear-gradient(135deg, #5B5FEF, #7C3AED)",
    textBrand: "linear-gradient(135deg, #5B5FEF 0%, #7C3AED 50%, #22D3EE 100%)",
  },
  color: {
    primary: "#5B5FEF",
    primaryLight: colorPrimitives.indigo[400],
    primaryDark: colorPrimitives.indigo[700],
    secondary: "#7C3AED",
    secondaryLight: colorPrimitives.violet[400],
    secondaryDark: colorPrimitives.violet[700],
    accent: "#22D3EE",
    accentLight: colorPrimitives.cyan[300],
    surface: {
      dark: semanticColors.surfaceDark,
      darkHover: semanticColors.surfaceDarkHover,
      light: semanticColors.surfaceLight,
      lightHover: semanticColors.surfaceLightHover,
    },
    primitives: colorPrimitives,
    ...semanticColors,
  },
  spacing,
  radius,
  shadows,
  animation,
  typography,
  gridDensity,
} as const;

export type Tokens = typeof tokens;
