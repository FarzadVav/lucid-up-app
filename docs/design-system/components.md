# Component & UX Standards

All reusable UI primitives live in `src/components/ui/` and are built on **React Native Reusables** + **NativeWind v4**, customized to enforce zero borders, zero shadows, our restrained palette, and the three-role typography system.

---

## 1. Foundational Components

### Typography (`@/components/ui/text`)
- Always import `Text` from `@/components/ui/text`, not `react-native`.
- Variants: `'title' | 'text' | 'subtext'` (default `'text'`).
- Automatically integrates with `TextClassContext` inside `Button` and `Card`.

### Buttons (`@/components/ui/button`)
- Minimum `48px` height (`min-h-12`) for default touch targets (`min-h-10` only for compact secondary actions).
- Radius: `rounded-md` (`16px`).
- Variants:
  - `default`: Primary off-white fill (`bg-primary`, `#F5F4F7`) with `#121016` `Text`. Use for the single primary action in a view.
  - `secondary`: Calm neutral fill (`bg-surface-muted`, `#26232D`) with `#F5F4F7` `Text`. Use for secondary actions such as sign-out or cancel.
  - `accent`: Soft muted purple tint (`bg-accent-soft`, `#282233`) with `#D5C7E8` `Text`. Use sparingly for selected/highlighted actions.
  - `ghost`: Transparent fill (`active:bg-surface`) with `#A6A0AE` `Text`. Use for low-emphasis actions.
- Feedback uses subtle opacity (`active:opacity-85`) and disabled dimming (`opacity-50`), never borders or shadows.

### Inputs & Writing Fields (`@/components/ui/input`)
- Surface-based boundaries: `bg-surface` (`#1C1A22`) at rest, shifting to `bg-surface-muted` (`#26232D`) on focus. Zero borders.
- Radius: `rounded-sm` (`12px`), padding `px-4 py-3`, `min-h-12`.
- Selection & cursor color: `THEME.accent` (`#A891C4`), with `keyboardAppearance="dark"`.
- Multiline writing editors: use `multiline` without forcing a fixed `min-h-12` cap; allow comfortable vertical growth, generous padding, and `text-text` (`16px` / `26px` line height). In full-screen journal editors, prefer an open `bg-background` (`#121016`) writing canvas over nested boxes.

### Cards / Surfaces (`@/components/ui/card`)
- Use `Card` (`bg-surface rounded-md p-6`) sparingly—**do not wrap every item in a card**.
- Prefer whitespace (`gap-8`, `gap-10`) over boxed containers on open `#121016` backgrounds.

---

## 2. Standard UI Patterns

### Dialogs & Modals
- Use `@rn-primitives/dialog` with `<PortalHost />` (already mounted in `src/app/_layout.tsx`).
- Backdrop: subtle translucent dark scrim (`bg-background/70`) without harsh blur clutter.
- Container: `bg-surface` (`#1C1A22`) or `bg-surface-muted` (`#26232D`), `rounded-lg` (`24px`), `p-6`, zero border, zero shadow.

### Bottom Sheets
- Radius: `rounded-t-lg` (`24px` top corners), `bg-surface` (`#1C1A22`), generous internal padding (`px-6 pt-6 pb-8`), optional quiet drag handle (`bg-surface-muted rounded-full`) with no borders or shadows.
- Respect `SafeAreaView` bottom insets and keyboard avoidance.

### Navigation (Stack & Tabs)
- Stack headers must set `headerShadowVisible: false`, `headerStyle: { backgroundColor: THEME.background }`, and `THEME.foreground` tint via `NAV_THEME` in `src/lib/theme.ts`.
- Tabs (when added): quiet `bg-background` bar with zero top border/shadow; inactive items in `text-text-secondary`, active/selected item highlighted with `text-accent-foreground` or `bg-accent-soft` pill.

### Lists & Journal Entries
- Separate journal entries with vertical spacing (`gap-6` or `gap-8`), not hairline divider lines or heavy card borders.
- Entry hierarchy: `Title` for entry heading (or `Text` with `font-semibold` when compact), `Text` (`text-foreground`) for body preview, `Subtext` (`text-text-secondary`) for date/metadata.

### Empty, Loading, and Error States
- **Empty states**: Calm, concise copy (`Title` + `Text` in `text-text-secondary`), zero large decorative illustrations, and at most one clear primary `<Button>`.
- **Loading states**: Minimal `<ActivityIndicator color={THEME.foreground} />` centered on `bg-background`, or calm `bg-surface` skeleton blocks (`rounded-sm`/`rounded-md`) without shimmer clutter.
- **Error & Status states**: Quiet `rounded-sm bg-surface-muted p-4` (errors/warnings) or `rounded-sm bg-accent-soft p-4` (confirmations) with `Subtext` and appropriate `accessibilityRole="alert"`.

---

## 3. Implementation & Accessibility Standards

- **Touch targets**: Minimum `48px` height/width (`min-h-12`) for primary interactive controls; minimum `44px` for icon/compact targets.
- **Responsive layout**: Constrain wide web/tablet forms and reading columns with `w-full max-w-md` or `w-full max-w-lg self-center`, and keep `px-6` (`24px`) horizontal screen margins on mobile.
- **Safe areas & keyboards**: Wrap screens in `SafeAreaView` (`react-native-safe-area-context`); pair forms and writing views with `KeyboardAvoidingView` and `ScrollView` (`keyboardShouldPersistTaps="handled"`).
- **RTL / LTR support**: Never hardcode `text-left`, `pl-`, `pr-`, `ml-`, or `mr-` where direction matters. Use `ps-`, `pe-`, `ms-`, `me-` logical classes and rely on React Native's automatic writing-direction alignment.
- **Accessibility**: Provide `accessibilityLabel`, `role`/`accessibilityRole`, and `accessibilityState={{ disabled }}` on interactive controls and alerts.
