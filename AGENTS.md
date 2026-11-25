# Lucid Up — Agent Instructions

**Lucid Up** is a calm, minimal, editorial journal mobile app built with **Expo (SDK 58)**, **React Native**, **Expo Router**, **NativeWind v4** (React Native Reusables), and **Supabase** (`npm` project; `package-lock.json` is the lockfile).

## Workspace Skills (`.agents/skills/`)

Activate the matching skill **before** planning or editing files in that domain. Do not duplicate or override skill procedures from memory.

| Task / Trigger | Skill to Load | Key References |
|---|---|---|
| Screens, layouts, journal UX, navigation chrome, accessibility, keyboard, RTL/LTR | `ui-ux-design-principles` | [docs/design-system/README.md](docs/design-system/README.md), [docs/design-system/components.md](docs/design-system/components.md) |
| Theme tokens, colors, 3-role typography, spacing, radii, `global.css`, `tailwind.config.js`, `src/lib/theme.ts` | `design-system-tokens` | [docs/design-system/tokens.md](docs/design-system/tokens.md) |
| Adding or editing `@/components/ui/*` primitives (RNR + NativeWind v4) | `nativewind-reusables-components` | [components.json](components.json), `src/components/ui/` |
| Supabase Auth, client queries, migrations, CLI/MCP, Edge Functions, debugging | `supabase` | [supabase/config.jsonc](supabase/config.jsonc), [src/utils/supabase.ts](src/utils/supabase.ts) |
| Postgres tables, columns, indexes, RLS policies, functions, query tuning | `supabase-postgres-best-practices` | `.agents/skills/supabase-postgres-best-practices/references/` |

## Non-Negotiable Rules

### 1. Expo & React Native
- **Verify current SDK docs**: Expo ships breaking changes every SDK release. Before touching Expo, EAS, or RN APIs, check `expo` in [package.json](package.json) (`~58.x`) and consult `https://docs.expo.dev/versions/v58.0.0/` or `https://docs.expo.dev/llms.txt` — never rely on memory.
- **Dependencies**: Always install Expo/RN packages via `npx expo install <package>` (never raw `npm install`). Prefer recommended Expo modules over third-party libraries.
- **Routing (`src/app/`)**: Use **Expo Router** (`Link`, `router`, `useLocalSearchParams` from `expo-router`). Keep only routes and `_layout.tsx` navigators inside `src/app/`; keep components, hooks, lib, providers, types, and utils outside `src/app/` (use `@/*` -> `./src/*`).
- **Native / CNG & EAS**: Do not create or hand-edit `ios/` or `android/` when using Continuous Native Generation — configure native behavior in [app.json](app.json) and config plugins. Libraries with native code require a development build (`npx expo run:ios|android` or `npx eas-cli@latest build --profile development`).

### 2. UI/UX & Design System
- **Zero borders & zero shadows**: Never use borders, border colors, outline rings, box/elevation shadows, or decorative divider lines anywhere. Separate elements with whitespace, padding, typography hierarchy, and subtle surface shifts.
- **Strict tokens & 3-role typography**: Use only centralized tokens (`global.css`, `tailwind.config.js`, `src/lib/theme.ts`) and `cn()` from `@/lib/utils`. Use `@/components/ui/text` (`title` | `text` | `subtext`) instead of React Native `Text`. Never hardcode hex values, arbitrary font sizes/radii/spacing, or unapproved saturated colors; keep soft purple strictly as an accent.
- **Mobile & RTL hygiene**: Reuse `@/components/ui/*` primitives, ensure `min-h-12` touch targets, `SafeAreaView` (`react-native-safe-area-context`), `KeyboardAvoidingView` + `keyboardShouldPersistTaps="handled"` on editors/forms, accessible roles/labels, and logical spacing (`ps-`/`pe-`/`ms-`/`me-`, no hardcoded `text-left`).

### 3. Supabase & Postgres
- **Imperative migrations**: This project uses imperative migrations in `supabase/migrations/` (`schema_paths: []` in [supabase/config.jsonc](supabase/config.jsonc)). Iterate with `execute_sql` (MCP) / `supabase db query` (CLI), then pull/commit clean migrations and regenerate TypeScript types (`npm run db:types` -> `src/types/database.types.ts`).
- **Security**: Enable RLS on all `public` tables, target `TO authenticated` / `TO anon` with `(select auth.uid())` (never deprecated `auth.role()` or editable `user_metadata` in authorization), and never expose `service_role` keys to client code.

## Commands & Verification

```bash
npx expo install <package>   # Install SDK-compatible packages
npx expo start               # Start dev server
npm run lint                 # Run ESLint (expo lint)
npx tsc --noEmit             # Run TypeScript typecheck
npx expo-doctor              # Diagnose dependency/config issues
npm run db:push              # Push migrations to linked Supabase project
npm run db:types             # Regenerate src/types/database.types.ts
npm run supabase:config:push # Push Supabase config changes
```

- **Before declaring any task done**: Run `npm run lint` and `npx tsc --noEmit`.
- **After UI token changes**: Also validate Tailwind compilation (`design-system-tokens`) and update `docs/design-system/` if an approved global change was made.
- **After Supabase schema/RLS changes**: Run `supabase db advisors` (or MCP `get_advisors`), verify with a test query, and run `npm run db:types`.
