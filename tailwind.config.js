/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: {
      transparent: 'transparent',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      surface: 'hsl(var(--surface))',
      'surface-muted': 'hsl(var(--surface-muted))',
      'text-primary': 'hsl(var(--foreground))',
      'text-secondary': 'hsl(var(--text-secondary))',
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        soft: 'hsl(var(--accent-soft))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--surface))',
        foreground: 'hsl(var(--foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--surface))',
        foreground: 'hsl(var(--foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--surface-muted))',
        foreground: 'hsl(var(--foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--surface-muted))',
        foreground: 'hsl(var(--text-secondary))',
      },
    },
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
    },
    fontSize: {
      title: ['24px', { lineHeight: '32px', fontWeight: '600' }],
      text: ['16px', { lineHeight: '26px', fontWeight: '400' }],
      subtext: ['14px', { lineHeight: '20px', fontWeight: '400' }],
    },
    fontWeight: {
      normal: '400',
      semibold: '600',
    },
    borderRadius: {
      none: '0px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      full: '9999px',
    },
    borderWidth: {
      0: '0px',
    },
    boxShadow: {
      none: 'none',
    },
    ringWidth: {
      0: '0px',
    },
    outlineWidth: {
      0: '0px',
    },
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
