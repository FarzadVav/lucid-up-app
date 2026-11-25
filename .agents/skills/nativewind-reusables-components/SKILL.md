---
name: nativewind-reusables-components
description: >-
  Guides creating, adding, and customizing React Native Reusables components in
  src/components/ui/ using NativeWind v4. Activate whenever adding a new RNR
  component via CLI or modifying reusable UI components (Button, Input, Text, Card,
  Dialog, BottomSheet, Tabs).
---

# NativeWind & React Native Reusables Components

Lucid Up uses **NativeWind v4** (`4.2.7`) and **React Native Reusables** (`new-york` style, configured in [components.json](../../../components.json)) with `<PortalHost />` mounted in [src/app/_layout.tsx](../../../src/app/_layout.tsx).

## Procedure for Adding or Building a UI Component

1. **Check Existing Primitives First**
   - Inspect `src/components/ui/` before creating anything new. Never create duplicate component variants.
   - If scaffolding a new primitive from RNR: `npx @react-native-reusables/cli@latest add <component>`.

2. **Adapt Immediately to Lucid Up's Design System**
   Default RNR templates include borders, shadows, focus rings, and 10+ text variants. Always customize newly added components before using them:
   - **Remove all borders, shadows, and rings**: Strip `border`, `border-*`, `shadow-*`, `ring-*`, `focus-visible:border-ring`, `focus-visible:ring-*`.
   - **Map semantic colors**: Use only `bg-background`, `bg-surface`, `bg-surface-muted`, `bg-primary`, `bg-accent-soft`, `bg-accent`, `text-foreground`, `text-text-secondary`, `text-primary-foreground`, `text-accent-foreground`.
   - **Enforce 3-role typography**: Replace RNR `Text` imports or font-size classes with `<Text variant="title | text | subtext" />` from `@/components/ui/text` (`TextClassContext` compatible).
   - **Enforce radii & spacing**: Use only `rounded-sm` (`12px`), `rounded-md` (`16px`), `rounded-lg` (`24px`), `rounded-full` (`9999px`) and `min-h-12` (`48px`) touch targets on interactive controls.
   - **Use `cn()` from `@/lib/utils`**: Ensures `text-title`/`text-text`/`text-subtext` merge safely with text color utilities.
   - **Keep dependencies minimal**: Only add `@rn-primitives/*` packages required by the specific component being added.

3. **Verify**
   - Run `npx expo lint` and `npx tsc --noEmit`.
   - Verify bundle compilation if native/web platform-specific code (`Platform.select`) was added.
