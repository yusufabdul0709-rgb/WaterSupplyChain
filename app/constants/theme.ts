/**
 * GVMC Design System — Theme Constants
 * Apple Liquid Glass + Government Design Language
 */

export const Colors = {
  primary: '#005BAC',
  primaryLight: '#0070D4',
  primaryDark: '#004A8C',
  secondary: '#00A6D6',
  secondaryLight: '#00BDE6',
  accent: '#00D4FF',
  accentSoft: 'rgba(0, 212, 255, 0.15)',

  background: '#F6F8FB',
  backgroundDark: '#EDF0F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  card: 'rgba(255, 255, 255, 0.55)',
  cardSolid: 'rgba(255, 255, 255, 0.85)',
  cardBorder: 'rgba(255, 255, 255, 0.35)',
  cardShadow: 'rgba(0, 91, 172, 0.08)',

  glass: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
  glassIntense: 'rgba(255, 255, 255, 0.75)',
  glassDark: 'rgba(36, 52, 71, 0.06)',

  text: '#243447',
  textSecondary: '#5A6B7D',
  textTertiary: '#8A97A6',
  textInverse: '#FFFFFF',
  textAccent: '#005BAC',

  success: '#00C853',
  successLight: 'rgba(0, 200, 83, 0.12)',
  warning: '#FFC107',
  warningLight: 'rgba(255, 193, 7, 0.12)',
  danger: '#E53935',
  dangerLight: 'rgba(229, 57, 53, 0.12)',
  info: '#00A6D6',
  infoLight: 'rgba(0, 166, 214, 0.12)',

  divider: 'rgba(36, 52, 71, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.35)',

  tabBar: 'rgba(255, 255, 255, 0.82)',
  tabBarBorder: 'rgba(255, 255, 255, 0.5)',
  tabActive: '#005BAC',
  tabInactive: '#8A97A6',

  water: '#00A6D6',
  waterLight: 'rgba(0, 166, 214, 0.15)',
  waterDark: '#0089B3',
  pipeline: '#00D4FF',
  pipelineGlow: 'rgba(0, 212, 255, 0.3)',

  mapDark: '#070d19',
  mapNode: '#00e5ff',
  mapNodeGlow: 'rgba(0, 229, 255, 0.6)',
  mapAlert: '#ef4444',
  mapAlertGlow: 'rgba(239, 68, 68, 0.8)',
};

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
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
  card: 20,
  button: 14,
  input: 14,
};

export const Typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 25,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 17,
    fontWeight: '500' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
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
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 13,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  glass: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const BlurIntensity = {
  light: 25,
  medium: 40,
  heavy: 60,
};

export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 12,
    stiffness: 180,
    mass: 0.8,
  },
};
