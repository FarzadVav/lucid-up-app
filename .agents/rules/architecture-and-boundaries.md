# Architecture & Dependency Boundaries

## Top-Level `src/` Structure

- `src/app/`: Expo Router file-based routes and `_layout.tsx` navigators only. Keep route files thin: re-export feature screens or compose layout providers. Never place business logic, data fetching, or reusable UI here.
- `src/features/<feature>/`: Self-contained feature modules (`auth`, `profile`, `journals`, ...), organized pragmatically with Clean Architecture layers.
- `src/shared/`: Truly cross-feature code only (`components/ui/`, `components/form/`, `infrastructure/`, `lib/`, `types/`, `utils/`). Do not move feature-specific logic into `src/shared/`.

## Clean Architecture Layers Inside Each Feature

1. `domain/`: Entities, constants, repository interfaces, and Valibot validation schemas.
   - **Must stay pure TypeScript** (only `valibot` allowed as a schema library).
   - **Must NOT import** React, React Native, Expo, Supabase, Zustand, or TanStack Query.
2. `application/`: Use cases and feature-level client stores (Zustand when needed).
   - Depends only on `domain/` (and `shared/utils/` for pure helpers like UUID validation).
   - Use cases accept repository contracts as arguments so they remain unit-testable without network or React.
3. `infrastructure/`: Repository implementations, row-to-entity mappers, and external service adapters.
   - Implements `domain/repositories/*` using `@/shared/infrastructure/supabase/client`.
   - Maps database snake_case rows to domain camelCase entities in `infrastructure/mappers/`.
4. `presentation/`: Feature screens, feature-only components, and TanStack Query / form hooks.
   - Calls `application/` use cases through hooks, binds UI to `@/shared/components/ui/*` and `@/shared/components/form/*`.
   - **Must NOT import** `@/shared/infrastructure/supabase/client` directly in screens or components.

## Cross-Feature Isolation & Pragmatism

- Import across features **only** through each feature's public barrel (`@/features/<feature>`). Never deep-import into another feature's internal layers (`domain/`, `application/`, `infrastructure/`, `presentation/`).
- Avoid circular dependencies between features. Currently `profile` and `journals` consume `@/features/auth` (`useAuth`); `auth` must not import `profile` or `journals`.
- Follow **KISS**, **DRY**, and **YAGNI**: omit empty folders or layers a feature does not actually need (for example, do not create a Zustand store for a feature that only has server state).
