# Lucid Up — Agent Instructions

**Lucid Up** is a calm, minimal, editorial journal mobile app built with **Expo (SDK 58)**, **React Native (0.88)**, **Expo Router**, **NativeWind v4** (React Native Reusables), **Supabase**, **Zustand**, **TanStack Query**, **React Hook Form**, and **Valibot** (`npm` project; `package-lock.json` is the lockfile).

## Architecture Overview

Code lives under `src/` (`@/*` -> `./src/*`) in three top-level directories:

```text
src/
├── app/        # Expo Router routes & _layout.tsx navigators ONLY (thin entrypoints)
├── features/   # Self-contained feature modules (auth, profile, journals)
└── shared/     # Reusable cross-feature UI, form helpers, theme, infra, types, utils
```

### Feature Layers (Pragmatic Clean Architecture)

Each module in `src/features/<feature>/` separates responsibilities cleanly:

- **`domain/`**: Entities, constants, repository contracts, and Valibot validation schemas. Pure TypeScript (+ `valibot` only); never imports React, Expo, Zustand, TanStack Query, or Supabase.
- **`application/`**: Use cases (accepting repository contracts) and feature-owned Zustand client stores (when needed).
- **`infrastructure/`**: Repository implementations (`supabase` adapters) and DB-row-to-entity mappers.
- **`presentation/`**: Screens, feature components, and TanStack Query / form hooks.
- **`index.ts`**: Public barrel file. Cross-feature imports must go through `@/features/<feature>` only—never deep-import another feature's internal layers.

## Core Library Responsibilities

| Library | Responsibility | Where It Lives |
|---|---|---|
| **Zustand** | Client-side global runtime state & shared UI state (e.g., `useAuthStore`) | `<feature>/application/stores/` |
| **TanStack Query** | All server state, caching, query keys, synchronization, and mutations | `<feature>/presentation/hooks/` |
| **React Hook Form** | Form state, submission handling, and `ConfirmDialog` gating | `<feature>/presentation/screens/` & `shared/components/form/` |
| **Valibot** | Schema definitions, runtime validation, and inferred input/output types | `<feature>/domain/schemas/` |

## Rules & Skills (`.agents/`)

Persistent rules live in `.agents/rules/` and task workflows live in `.agents/skills/`. Load the matching skill before planning or editing files in that domain:

| Domain / Task | Rules & Skills | Key References |
|---|---|---|
| Feature modules & boundaries | `.agents/rules/architecture-and-boundaries.md`, `feature-development` | `src/features/`, `src/shared/` |
| State, queries & forms | `.agents/rules/state-and-data-fetching.md`, `tanstack-query-data`, `forms-with-rhf-valibot`, `zustand-client-state` | `src/shared/infrastructure/query/`, `src/shared/components/form/` |
| UI, tokens, RNR & RTL/LTR | `.agents/rules/expo-and-ui.md`, `ui-ux-design-principles`, `design-system-tokens`, `nativewind-reusables-components` | [docs/design-system/README.md](docs/design-system/README.md), [components.json](components.json) |
| Testing & code quality | `.agents/rules/code-quality-and-testing.md`, `testing-and-verification` | `vitest.config.mts`, `src/**/*.test.ts` |
| Supabase & Postgres | `supabase`, `supabase-postgres-best-practices` | [supabase/config.jsonc](supabase/config.jsonc), [src/shared/infrastructure/supabase/client.ts](src/shared/infrastructure/supabase/client.ts) |

## Non-Negotiable Constraints

1. **Expo SDK 58 & CNG**: Verify SDK 58 docs (`https://docs.expo.dev/versions/v58.0.0/`) before using Expo/RN APIs. Install packages with `npx expo install <package>`. Never hand-edit `ios/` or `android/` when using CNG; configure native behavior in [app.json](app.json).
2. **Design System**: Style exclusively with NativeWind v4 (`className` + `cn()` from `@/shared/lib/utils`), `@/shared/components/ui/*` (RNR), `@/shared/components/ui/text` (`title` | `text` | `subtext`), and centralized tokens (`global.css`, `tailwind.config.js`, `src/shared/lib/theme.ts`). Enforce **zero borders, zero shadows, zero divider lines**, `min-h-12` touch targets, `SafeAreaView`, `KeyboardAvoidingView`, RTL-safe logical spacing (`ps-`/`pe-`), `SwipeableCard` (`react-native-reanimated`), and `ConfirmDialog` before important/destructive actions (`edit`, `delete`).
3. **Supabase & Postgres**: Project uses imperative migrations in `supabase/migrations/` (`schema_paths: []` in [supabase/config.jsonc](supabase/config.jsonc)) targeting project `isjafkdnfwtscabinzyh`. On every DB change: create an idempotent migration, push/apply to remote, verify tables/migrations + run advisors + run a test query, and regenerate `src/shared/types/database.types.ts` via `npm run db:types` (or report the exact blocker if remote sync fails). Enable RLS on all `public` tables using `(select auth.uid())`, and never expose `service_role` keys to client code.

## Commands & Verification

```bash
npx expo install <package>              # Install SDK-compatible packages
npx expo start                          # Start dev server
npm run typecheck                       # Run TypeScript check (tsc --noEmit)
npm run lint                            # Run ESLint (expo lint)
npm test                                # Run Vitest unit tests (vitest run)
npx expo-doctor                         # Diagnose dependency/config issues
npm run db:link                         # Link CLI to Supabase project isjafkdnfwtscabinzyh
npm run db:start                        # Start local Supabase stack
npm run db:stop                         # Stop local Supabase stack
npm run db:reset                        # Reset local DB to current migrations
npm run db:migrations                   # List remote & local migrations
npm run db:migration:new -- <name>      # Create a new timestamped migration file
npm run db:push                         # Push migrations to remote Supabase project
npm run db:pull                         # Pull remote schema into a migration
npm run db:diff                         # Diff local vs remote schema
npm run db:query -- "<sql>"             # Run SQL against remote database
npm run db:advisors                     # Run Supabase security & performance advisors
npm run db:types                        # Regenerate src/shared/types/database.types.ts
npm run supabase:config:push            # Push Supabase config.jsonc changes
```

- **Before declaring any task done**: Run `npm run typecheck`, `npm run lint`, and `npm test`.
- **After UI token changes**: Validate Tailwind compilation (`design-system-tokens`) and update `docs/design-system/`.
- **After Supabase schema/RLS changes**: Sync remote migrations, run advisors + verification query, and regenerate `src/shared/types/database.types.ts`.
