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
} as const;

export const radius = {
  input: 24,
  button: 16,
  dialog: 28,
  card: 20,
  sheet: 32,
  snackbar: 18,
  pill: 9999,
} as const;

export const color = {
  bg: '#0B0B0C',
  surface: '#151518',
  surfaceVariant: '#202024',
  primary: '#7C9EFF',
  secondary: '#A78BFA',
  accent: '#22C55E',
  error: '#EF4444',
  textPrimary: '#F0F0F0',
  textSecondary: '#909090',
  textTertiary: '#606060',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(0,0,0,0.7)',
  primaryAlpha10: 'rgba(124,158,255,0.10)',
  primaryAlpha20: 'rgba(124,158,255,0.20)',
  primaryAlpha30: 'rgba(124,158,255,0.30)',
  errorAlpha10: 'rgba(239,68,68,0.10)',
  errorAlpha20: 'rgba(239,68,68,0.20)',
} as const;

export const shadow = {
  card: '0 2px 8px rgba(0,0,0,0.2)',
  cardHover: '0 8px 24px rgba(0,0,0,0.3)',
  search: '0 4px 12px rgba(0,0,0,0.3)',
  dialog: '0 16px 48px rgba(0,0,0,0.4)',
  subtle: '0 1px 3px rgba(0,0,0,0.15)',
} as const;

export const animation = {
  fast: 200,
  normal: 250,
  slow: 300,
  ease: [0.25, 0.1, 0.25, 1] as const,
  curve: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

export const typography = {
  title: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '0.6875rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.02em' },
} as const;

export const gridDensity = {
  compact: { columns: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, gap: { xs: 10, md: 14, lg: 16 } },
  comfortable: { columns: { xs: 2, sm: 3, md: 3, lg: 4, xl: 5 }, gap: { xs: 12, md: 16, lg: 20 } },
  spacious: { columns: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }, gap: { xs: 16, md: 20, lg: 24 } },
} as const;

export const tokens = {
  spacing,
  radius,
  color,
  shadow,
  animation,
  typography,
  gridDensity,
} as const;

export type Tokens = typeof tokens;
