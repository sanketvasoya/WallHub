/**
 * Wallection Design Tokens
 * Single source of truth for all design values.
 */

// ─── Color Primitives ─────────────────────────────────────────────────────────

const colorPrimitives = {
  violet: {
    300: "#a87aff",
    400: "#8f56ff",
    500: "#7c4dff",
    600: "#6a3de8",
    700: "#502dc4",
    800: "#3a1e9a",
  },
  cyan: {
    300: "#4df0ff",
    400: "#1aebff",
    500: "#00e5ff",
    600: "#00c4dc",
    700: "#0099b2",
  },
  pink: {
    400: "#ff8ab8",
    500: "#ff6b9d",
    600: "#e8527f",
  },
} as const;

// ─── Semantic Colors ───────────────────────────────────────────────────────────

const semanticColors = {
  primaryAlpha10: "rgba(124, 77, 255, 0.10)",
  primaryAlpha15: "rgba(124, 77, 255, 0.15)",
  primaryAlpha20: "rgba(124, 77, 255, 0.20)",
  primaryAlpha30: "rgba(124, 77, 255, 0.30)",
  primaryAlpha40: "rgba(124, 77, 255, 0.40)",
  secondaryAlpha10: "rgba(0, 229, 255, 0.10)",
  secondaryAlpha20: "rgba(0, 229, 255, 0.20)",
  error: "#f44336",
  errorAlpha: "rgba(244, 67, 54, 0.12)",
  warning: "#ff9800",
  warningAlpha: "rgba(255, 152, 0, 0.12)",
  success: "#4caf50",
  successAlpha: "rgba(76, 175, 80, 0.12)",
  info: "#2196f3",
  infoAlpha: "rgba(33, 150, 243, 0.12)",
  surfaceDark: "rgba(255, 255, 255, 0.03)",
  surfaceDarkElevated: "rgba(255, 255, 255, 0.05)",
  surfaceDarkHover: "rgba(255, 255, 255, 0.07)",
  surfaceDarkActive: "rgba(255, 255, 255, 0.10)",
  surfaceLight: "rgba(0, 0, 0, 0.02)",
  surfaceLightElevated: "rgba(0, 0, 0, 0.035)",
  surfaceLightHover: "rgba(0, 0, 0, 0.05)",
  surfaceLightActive: "rgba(0, 0, 0, 0.08)",
  borderDark: "rgba(255, 255, 255, 0.06)",
  borderDarkHover: "rgba(255, 255, 255, 0.12)",
  borderLight: "rgba(0, 0, 0, 0.06)",
  borderLightHover: "rgba(0, 0, 0, 0.12)",
  bgDark: "#05050a",
  bgDarkPaper: "#0e0e16",
  bgLight: "#f8f8fc",
  bgLightPaper: "#ffffff",
  backdropDark: "rgba(5, 5, 10, 0.80)",
  backdropDarkHeavy: "rgba(5, 5, 10, 0.95)",
  backdropLight: "rgba(248, 248, 252, 0.80)",
  backdropLightHeavy: "rgba(248, 248, 252, 0.95)",
} as const;

// ─── Spacing Scale (px values) ────────────────────────────────────────────────

export const spacing = {
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
} as const;

// ─── Radius Scale ─────────────────────────────────────────────────────────────

export const radius = {
  xs: 6,
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
    sm: "0 2px 8px rgba(0, 0, 0, 0.4)",
    md: "0 4px 20px rgba(0, 0, 0, 0.5)",
    lg: "0 8px 40px rgba(0, 0, 0, 0.6)",
    xl: "0 16px 64px rgba(0, 0, 0, 0.7)",
    primarySm: "0 4px 16px rgba(124, 77, 255, 0.30)",
    primaryMd: "0 6px 28px rgba(124, 77, 255, 0.40)",
  },
  light: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.08)",
    md: "0 4px 20px rgba(0, 0, 0, 0.12)",
    lg: "0 8px 40px rgba(0, 0, 0, 0.16)",
    xl: "0 16px 64px rgba(0, 0, 0, 0.20)",
    primarySm: "0 4px 16px rgba(98, 0, 234, 0.20)",
    primaryMd: "0 6px 28px rgba(98, 0, 234, 0.28)",
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
    hero: 800,
  },
  curve: {
    standard: [0.2, 0.0, 0, 1.0] as const,
    decelerate: [0.0, 0.0, 0.2, 1.0] as const,
    accelerate: [0.4, 0.0, 1.0, 1.0] as const,
    spring: [0.25, 0.46, 0.45, 0.94] as const,
    bounce: [0.34, 1.56, 0.64, 1.0] as const,
  },
  ease: {
    standard: "cubic-bezier(0.2, 0.0, 0, 1.0)",
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
    spring: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1.0)",
  },
} as const;

// ─── Typography Scale ─────────────────────────────────────────────────────────

export const typography = {
  size: {
    "2xs": "0.625rem",
    xs: "0.70rem",
    sm: "0.75rem",
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

// ─── Main Export (backward-compatible) ────────────────────────────────────────

export const tokens = {
  gradient: {
    primary: "linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)",
    primaryHover: "linear-gradient(135deg, #9c6fff 0%, #33ecff 100%)",
    primaryLight: "linear-gradient(135deg, rgba(124,77,255,0.15) 0%, rgba(0,229,255,0.10) 100%)",
    primarySubtle: "linear-gradient(135deg, rgba(124,77,255,0.08) 0%, rgba(0,229,255,0.05) 100%)",
    text: "linear-gradient(135deg, #7c4dff, #00e5ff)",
    textWarm: "linear-gradient(135deg, #ff6b9d, #c44dff, #7c4dff)",
    textShimmer: "linear-gradient(135deg, #7c4dff 0%, #00e5ff 50%, #7c4dff 100%)",
    surface: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    surfaceCard: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
    hero: "linear-gradient(180deg, transparent 0%, rgba(5,5,10,0.85) 100%)",
    heroLight: "linear-gradient(180deg, transparent 0%, rgba(248,248,252,0.92) 100%)",
    heroFull: "linear-gradient(180deg, rgba(5,5,10,0.2) 0%, transparent 30%, transparent 60%, rgba(5,5,10,0.85) 100%)",
    cardOverlay: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0) 50%)",
  },
  color: {
    primary: "#7c4dff",
    primaryLight: colorPrimitives.violet[300],
    primaryDark: colorPrimitives.violet[700],
    secondary: "#00e5ff",
    secondaryLight: colorPrimitives.cyan[300],
    secondaryDark: colorPrimitives.cyan[700],
    primaryLightCss: semanticColors.primaryAlpha30,
    accent: "#ff6b9d",
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
