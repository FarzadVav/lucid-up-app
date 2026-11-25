# Lucid Up Design System

Lucid Up is a personal journal writing application. Every visual and interaction decision serves one goal: **a calm, minimal, editorial, and distraction-free reading and writing experience**.

## Visual Identity

- **Tone**: Calm, private, clear, editorial, and unhurried.
- **Avoid**: Corporate dashboards, admin panels, dense productivity chrome, saturated colors, or decorative clutter.
- **Primary experience**: Writing and reading journal content always take visual priority over controls and containers.

## Non-Negotiable Rules

1. **Zero Borders & Zero Shadows**: Never use borders, border colors, outline rings, box shadows, elevation shadows, or decorative divider lines anywhere in the app. Separate elements with whitespace, padding, typography hierarchy, and subtle surface shifts (`#121016` -> `#1C1A22` -> `#26232D`).
2. **Restrained Dark-Mode Palette Only**: Use only deep obsidian-charcoal, off-white, neutral dark grays, and very soft muted purple (`Accent` reserved strictly for selected states, subtle highlights, and important accents).
3. **Exactly Three Typography Roles**: All text must use `Title` (`24px` semibold), `Text` (`16px` regular), or `Subtext` (`14px` regular). Never invent extra font sizes or unnecessary weight variations.
4. **Consistent Spacing & Radii**: Use only the documented spacing scale (`4, 8, 12, 16, 24, 32, 40, 48`) and radius scale (`12, 16, 24, 9999`).
5. **Single Source of Truth**: All visual tokens live in:
   - [global.css](../../global.css) (HSL CSS variables)
   - [tailwind.config.js](../../tailwind.config.js) (enforced NativeWind utilities)
   - [src/shared/lib/theme.ts](../../src/shared/lib/theme.ts) (JS/React Navigation tokens)
   - [src/shared/lib/utils.ts](../../src/shared/lib/utils.ts) (`cn()` with custom `font-size` merge group)

## Documentation Index

- [Design Tokens](./tokens.md) — Semantic colors, contrast ratios, 3-role typography, spacing, and radius scales.
- [Component & UX Standards](./components.md) — Specifications for all UI primitives, journal views, overlays, accessibility, keyboard, and RTL/LTR behavior.

## Governance & Change Process

- Every screen, feature, and component must reuse existing tokens and `src/shared/components/ui/*` primitives.
- Never introduce ad-hoc colors, font sizes, spacing values, borders, or shadows in feature code.
- If a new requirement genuinely conflicts with a rule, propose an explicit global design-system update: update the token files, update `docs/design-system/`, and audit existing screens for consistency.
