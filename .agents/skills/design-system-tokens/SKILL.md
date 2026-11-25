---
name: design-system-tokens
description: >-
  Defines how to read, apply, and maintain Lucid Up's centralized NativeWind v4 and
  TypeScript design tokens (colors, 3-role typography, spacing, and radii). Activate
  whenever referencing theme values, updating global.css, tailwind.config.js,
  src/lib/theme.ts, or proposing an approved global design-system token change.
---

# Design System Tokens

All visual values in Lucid Up are centrally governed so components cannot drift into ad-hoc colors, font sizes, borders, or shadows. See [docs/design-system/tokens.md](../../../docs/design-system/tokens.md) for the full token tables.

## Architecture

- [global.css](../../../global.css): Source HSL CSS variables (`:root`).
- [tailwind.config.js](../../../tailwind.config.js): Enforces the exact `colors`, `spacing` (`0, 4, 8, 12, 16, 24, 32, 40, 48`), `fontSize` (`title`, `text`, `subtext`), `fontWeight` (`normal`, `semibold`), and `borderRadius` (`none`, `sm=12px`, `md=16px`, `lg=24px`, `full=9999px`) while locking `borderWidth`, `boxShadow`, `ringWidth`, and `outlineWidth` to `0`/`none`.
- [src/lib/theme.ts](../../../src/lib/theme.ts): Exports `THEME`, `SPACING`, `TYPOGRAPHY`, `RADIUS`, and `NAV_THEME` for React Navigation (`ThemeProvider`) and native props (`ActivityIndicator`, `placeholderTextColor`, `selectionColor`).
- [src/lib/utils.ts](../../../src/lib/utils.ts): Configures `extendTailwindMerge` so custom font-size classes (`text-title`, `text-text`, `text-subtext`) never conflict with text color classes (`text-foreground`, `text-text-secondary`, etc.).

## Rules & Procedure

1. Never use raw hex colors, arbitrary `fontSize` numbers, or unapproved Tailwind scale tokens in screen or component files.
2. When adding or modifying an approved global token:
   - Update `global.css`, `tailwind.config.js`, and `src/lib/theme.ts` together in sync.
   - Verify WCAG AA contrast (`>= 4.5:1` for `text` and `subtext`) against every surface the token sits on.
   - Update [docs/design-system/tokens.md](../../../docs/design-system/tokens.md).
3. Validate with `npx tailwindcss --input ./global.css --output <temp>` and `npx tsc --noEmit`.
