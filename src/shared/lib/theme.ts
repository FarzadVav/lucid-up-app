import { DarkTheme, type Theme } from 'expo-router/react-navigation';

export const THEME = {
  background: '#121016',
  foreground: '#F5F4F7',
  surface: '#1C1A22',
  surfaceMuted: '#26232D',
  textPrimary: '#F5F4F7',
  textSecondary: '#A6A0AE',
  accent: '#A891C4',
  accentSoft: '#282233',
  accentForeground: '#D5C7E8',
  primary: '#F5F4F7',
  primaryForeground: '#121016',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

export const TYPOGRAPHY = {
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400' as const,
  },
  subtext: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
} as const;

export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 24,
  full: 9999,
} as const;

export const NAV_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: THEME.background,
    border: 'transparent',
    card: THEME.background,
    notification: THEME.accent,
    primary: THEME.accent,
    text: THEME.foreground,
  },
};
