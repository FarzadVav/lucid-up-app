---
name: feature-development
description: >-
  Step-by-step workflow for creating or extending a self-contained feature module
  in src/features/ using Lucid Up's pragmatic Clean Architecture layers and thin
  Expo Router routes. Activate whenever adding a new feature or refactoring
  feature boundaries.
---

# Feature Development Workflow

Build new features inside `src/features/<feature-name>/` while keeping `src/app/` strictly for Expo Router route entrypoints.

## Steps

1. **Define Domain (`src/features/<feature>/domain/`)**
   - Add entities in `domain/entities/` using camelCase domain types (decoupled from Postgres snake_case columns).
   - Add repository contracts in `domain/repositories/`.
   - Add Valibot schemas and inferred types (`v.InferInput`, `v.InferOutput`) in `domain/schemas/`.
   - Keep `domain/` pure TypeScript (+ `valibot` only). Never import React, Expo, Zustand, TanStack Query, or Supabase.

2. **Implement Application (`src/features/<feature>/application/`)**
   - Add pure use-case functions in `application/use-cases/` that accept repository interfaces and validate inputs with domain schemas.
   - Only add a Zustand store in `application/stores/` if the feature owns global client/UI state that is not server state.

3. **Implement Infrastructure (`src/features/<feature>/infrastructure/`)**
   - Add row-to-entity mappers in `infrastructure/mappers/` converting `@/shared/types/database.types` / `AppDatabase` rows into domain entities.
   - Implement repository contracts in `infrastructure/repositories/` using `supabase` from `@/shared/infrastructure/supabase/client`.

4. **Build Presentation (`src/features/<feature>/presentation/`)**
   - Add TanStack Query keys and hooks (`useQuery` / `useMutation`) in `presentation/hooks/`.
   - Build screens and feature-specific components using `@/shared/components/ui/*` and `@/shared/components/form/*`.
   - Gate important/destructive actions (`edit`, `delete`) with `ConfirmDialog` and display feedback with `FeedbackBanner`.

5. **Expose Public Barrel & Thin Route**
   - Export public screens, hooks, and domain types from `src/features/<feature>/index.ts`.
   - Create thin route file(s) in `src/app/` that re-export the feature screen, and register routes in `_layout.tsx` if needed.
   - Never import another feature's internal files; only import from `@/features/<other-feature>`.

6. **Test & Verify**
   - Add unit tests (`*.test.ts`) for schemas and use cases.
   - Run `npm run typecheck`, `npm run lint`, and `npm test`.
