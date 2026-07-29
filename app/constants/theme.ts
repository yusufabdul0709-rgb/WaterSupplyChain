/**
 * GVMC Design System — Theme Constants
 * Apple iOS 26 + Google Material 3 + Government Digital Service (GDS)
 */

export const Colors = {
  // Primary & Secondary Brand Colors
  primary: '#005BAC',       // GVMC Navy Blue
  primaryLight: '#0070D4',
  primaryDark: '#004A8C',
  secondary: '#0EA5E9',     // Sky Blue / Cyan Accent
  secondaryLight: '#38BDF8',
  secondaryDark: '#0284C7',

  // Accent & Soft Tint Colors
  accent: '#0EA5E9',
  accentSoft: 'rgba(14, 165, 233, 0.12)',

  // Background & Surfaces
  background: '#F5F7FA',     // Calm Municipal Neutral Grey-White
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Glass Morphism & Card Surfaces
  card: '#FFFFFF',
  cardSolid: '#FFFFFF',
  cardBorder: '#E7EDF5',
  cardShadow: 'rgba(15, 23, 42, 0.04)',

  glass: 'rgba(255, 255, 255, 0.65)',
  glassBorder: '#E7EDF5',
  glassIntense: 'rgba(255, 255, 255, 0.85)',
  glassDark: 'rgba(15, 23, 42, 0.85)',
  glassDarkBorder: 'rgba(255, 255, 255, 0.15)',

  // Typography & Text
  text: '#0F172A',           // Slate 900
  subtitle: '#64748B',       // Slate 500
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',   // Slate 400
  textInverse: '#FFFFFF',
  textAccent: '#005BAC',

  // Status & Telemetry Indicators
  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.12)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.12)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.12)',

  // Utility Colors
  border: '#E7EDF5',
  divider: '#E7EDF5',
  overlay: 'rgba(15, 23, 42, 0.4)',

  // Bottom Navigation Bar
  tabBar: 'rgba(255, 255, 255, 0.85)',
  tabBarBorder: '#E7EDF5',
  tabActive: '#005BAC',
  tabInactive: '#94A3B8',

  // Map & Water Telemetry Specifics
  water: '#0EA5E9',
  waterLight: 'rgba(14, 165, 233, 0.15)',
  waterDark: '#0284C7',
  pipeline: '#38BDF8',
  pipelineGlow: 'rgba(56, 189, 248, 0.35)',

  mapDark: '#070D19',
  mapNode: '#00E5FF',
  mapNodeGlow: 'rgba(0, 229, 255, 0.6)',
  mapAlert: '#EF4444',
  mapAlertGlow: 'rgba(239, 68, 68, 0.8)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
  screen: 20,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  card: 24,         // Exact global design system: 24px
  button: 18,       // Exact global design system: 18px
  bottomSheet: 32,  // Exact global design system: 32px
  avatar: 26,       // Exact global design system: 26px
  input: 16,
  pill: 999,
} as const;

export const Typography = {
  display: {
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
    lineHeight: 42,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  // Backward compatibility aliases for existing components
  largeTitle: {
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
    lineHeight: 42,
  },
  title1: {
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  title3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  subheadMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  footnoteMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  caption1: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption2: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 6,
  },
  glass: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const BlurIntensity = {
  light: 20,
  medium: 35,
  heavy: 55,
} as const;

export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
  spring: {
    damping: 18,
    stiffness: 160,
    mass: 1,
  },
} as const;
