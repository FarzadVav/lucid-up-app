# Expo, UI/UX & Design System Rules

## Expo SDK 58 & React Native

- Check `expo` (`~58.x`) in `package.json` and consult current SDK 58 docs (`https://docs.expo.dev/versions/v58.0.0/`) before using unfamiliar Expo/RN APIs.
- Always install packages via `npx expo install <package>` (never raw `npm install`).
- Keep Continuous Native Generation clean: never create or hand-edit `ios/` or `android/` directories; configure native settings in `app.json`.

## Design System & NativeWind v4 / RNR

- Always style with NativeWind v4 (`className` + `cn()` from `@/shared/lib/utils`) and build UI with React Native Reusables primitives in `@/shared/components/ui/*`.
- Use `<Text variant="title | text | subtext" />` from `@/shared/components/ui/text`; never import `Text` from `react-native`.
- **Zero borders & zero shadows**: Never add `border*`, `shadow*`, `elevation`, `ring*`, `outline*`, or divider lines anywhere.
- **Strict tokens**: Use only semantic tokens from `global.css`, `tailwind.config.js`, and `THEME` in `@/shared/lib/theme`. Keep soft purple (`accent`, `accent-soft`, `accent-foreground`) strictly as an accent.
- **Interactive patterns**:
  - Use `SwipeableCard` (`@/shared/components/ui/card`) with `react-native-reanimated` + `react-native-gesture-handler` for swipeable item cards.
  - Gate important, mutating, or destructive actions (`edit`, `delete`) behind `ConfirmDialog` (`@/shared/components/ui/confirm-dialog`).
  - Use `FeedbackBanner` (`@/shared/components/ui/feedback-banner`) for inline errors and confirmation messages.
- **Mobile, Accessibility & RTL**:
  - Maintain `min-h-12` (`48px`) touch targets, `SafeAreaView` (`react-native-safe-area-context`), `KeyboardAvoidingView` + `ScrollView` (`keyboardShouldPersistTaps="handled"`) on forms/editors.
  - Provide `accessibilityRole` and `accessibilityLabel` on controls and alerts.
  - Use logical spacing (`ps-`, `pe-`, `ms-`, `me-`) and never hardcode `text-left` or `text-right`.
