---
name: ui-ux-design-principles
description: >-
  Guides UI/UX layout, visual hierarchy, journal-specific reading/writing workflows,
  accessibility, keyboard handling, safe areas, and RTL/LTR layout decisions for
  Lucid Up. Activate whenever designing, reviewing, or updating screens, navigation,
  forms, lists, or empty/loading/error states.
---

# UI/UX Design Principles

Apply Lucid Up's calm, minimal, editorial journal aesthetic to all screens and flows. Refer to [docs/design-system/README.md](../../../docs/design-system/README.md) and [docs/design-system/components.md](../../../docs/design-system/components.md) for the complete reference.

## Steps

1. **Audit Layout & Visual Quietness**
   - Keep `#121016` (`bg-background`) as the open dark primary canvas; do not wrap every section in a card.
   - Verify **zero borders, zero shadows, zero outline rings, and zero divider lines** exist anywhere in the layout or navigation header (`headerShadowVisible: false`).
   - Separate unrelated sections with generous whitespace (`gap-8` or `gap-10`), and keep screen margins comfortable (`px-6`).

2. **Enforce Journal-First Hierarchy**
   - Use strictly the 3 typography roles via `<Text variant="title | text | subtext" />` from `@/components/ui/text`.
   - Reserve soft purple (`bg-accent-soft`, `text-accent-foreground`, `bg-accent`) strictly for selected states, subtle highlights, and important accents—never as the dominant surface or default CTA fill.
   - Keep journal editors open, padded, and distraction-free; keep entry lists separated by whitespace rather than bordered cards.

3. **Verify Interaction, Accessibility & RTL/LTR**
   - Ensure interactive elements meet comfortable touch targets (`min-h-12` / `>= 44–48px`).
   - Wrap screens in `SafeAreaView` (`react-native-safe-area-context`) and pair inputs/editors with `KeyboardAvoidingView` and `ScrollView` (`keyboardShouldPersistTaps="handled"`).
   - Use RTL-safe logical utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`) and omit explicit `text-left` so React Native aligns text naturally for both LTR and RTL (e.g., Persian) scripts.
   - Add `accessibilityLabel`, `role` / `accessibilityRole` (`"alert"` for errors), and `accessibilityState` where appropriate.
