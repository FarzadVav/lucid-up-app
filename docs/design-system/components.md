# Component & UX Standards

All reusable UI primitives live in `src/shared/components/ui/` and are built on **React Native Reusables** + **NativeWind v4**, customized to enforce zero borders, zero shadows, our restrained palette, and the three-role typography system.

---

## 1. Foundational Components

### Typography (`@/shared/components/ui/text`)
- Always import `Text` from `@/shared/components/ui/text`, not `react-native`.
- Variants: `'title' | 'text' | 'subtext'` (default `'text'`).
- Automatically integrates with `TextClassContext` inside `Button` and `Card`.

### Buttons (`@/shared/components/ui/button`)
- Minimum `48px` height (`min-h-12`) for default touch targets (`min-h-10` only for compact secondary actions).
- Radius: `rounded-md` (`16px`).
- Variants:
  - `default`: Primary off-white fill (`bg-primary`, `#F5F4F7`) with `#121016` `Text`. Use for the single primary action in a view.
  - `secondary`: Calm neutral fill (`bg-surface-muted`, `#26232D`) with `#F5F4F7` `Text`. Use for secondary actions such as sign-out or cancel.
  - `accent`: Soft muted purple tint (`bg-accent-soft`, `#282233`) with `#D5C7E8` `Text`. Use sparingly for selected/highlighted actions.
  - `ghost`: Transparent fill (`active:bg-surface`) with `#A6A0AE` `Text`. Use for low-emphasis actions.
- Feedback uses subtle opacity (`active:opacity-85`) and disabled dimming (`opacity-50`), never borders or shadows.

### Inputs & Writing Fields (`@/shared/components/ui/input`)
- Surface-based boundaries: `bg-surface` (`#1C1A22`) at rest, shifting to `bg-surface-muted` (`#26232D`) on focus. Zero borders.
- Radius: `rounded-sm` (`12px`), padding `px-4 py-3`, `min-h-12`.
- Selection & cursor color: `THEME.accent` (`#A891C4`), with `keyboardAppearance="dark"`.
- Multiline writing editors: use `multiline` without forcing a fixed `min-h-12` cap; allow comfortable vertical growth, generous padding, and `text-text` (`16px` / `26px` line height). In full-screen journal editors, prefer an open `bg-background` (`#121016`) writing canvas over nested boxes.

### Cards / Surfaces (`@/shared/components/ui/card`)
- Use `Card` (`bg-surface rounded-md p-6`) sparingly—**do not wrap every item in a card**.
- Prefer whitespace (`gap-8`, `gap-10`) over boxed containers on open `#121016` backgrounds.
- **Swipeable cards (`SwipeableCard`)**: When a `Card` exposes contextual item actions (such as `edit` or `delete`), it must support horizontal swipe-to-reveal using `react-native-reanimated` (paired with `react-native-gesture-handler` `Gesture.Pan()` / `Animated.View`).
  - Keep revealed actions calm, borderless, and shadowless (`bg-surface-muted` for neutral/edit actions, `bg-accent-soft` with `text-accent-foreground` for highlighted/important actions), with `rounded-md` or `rounded-sm` and `min-h-12` (`>= 48px`) touch targets.
  - Respect RTL/LTR directionality (`I18nManager.isRTL`) so swipe reveal and action alignment feel natural in both Persian and English.
  - Snap smoothly with Reanimated spring/timing physics and close automatically after an action is triggered.

---

## 2. Standard UI Patterns

### Dialogs & Modals (`@/shared/components/ui/dialog`)
- Always use React Native Reusables `Dialog` (`@/shared/components/ui/dialog`, backed by `@rn-primitives/dialog` and `<PortalHost />` in `src/app/_layout.tsx`) styled with NativeWind v4.
- Backdrop: subtle translucent dark scrim (`bg-background/70`) without harsh blur clutter.
- Container: `bg-surface` (`#1C1A22`), `rounded-lg` (`24px`), `p-6`, zero border, zero shadow.

### Confirmation Dialogs (`@/shared/components/ui/confirm-dialog`)
- **Mandatory for important actions**: Every important, mutating, or destructive action—such as **edit** (e.g., entering/committing a sensitive edit) and **delete**—must use `ConfirmDialog` (built on RNR `Dialog`) before executing. The action runs **only** if the user explicitly confirms.
- Structure: `DialogHeader` (`DialogTitle` + optional `DialogDescription`) + `DialogFooter` with two comfortable `min-h-12` RNR `Button` actions (`Cancel` with `variant="secondary"` inside `DialogClose`, and `Confirm` with `variant="default"` or `variant="accent"`).
- Support backdrop tap or cancel button to dismiss without side effects, and keep `DialogPrimitive.Content` accessible.

### Bottom Sheets
- Radius: `rounded-t-lg` (`24px` top corners), `bg-surface` (`#1C1A22`), generous internal padding (`px-6 pt-6 pb-8`), optional quiet drag handle (`bg-surface-muted rounded-full`) with no borders or shadows.
- Respect `SafeAreaView` bottom insets and keyboard avoidance.

### Navigation (Stack & Tabs)
- Stack headers must set `headerShadowVisible: false`, `headerStyle: { backgroundColor: THEME.background }`, and `THEME.foreground` tint via `NAV_THEME` in `src/shared/lib/theme.ts`.
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
