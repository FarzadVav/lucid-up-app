# Code Quality & Testing Standards

## Clean Code

- Apply **DRY**, **KISS**, **YAGNI**, and pragmatic **SOLID** principles.
- Extract shared error message parsing via `getErrorMessage` (`@/shared/utils/errors`) and route/UUID helpers via `@/shared/utils/params`.
- Keep functions small, cohesive, and single-purpose with early returns and shallow nesting.
- Never silently swallow errors; surface clear user-facing errors via `FeedbackBanner` or inline form field validation errors.

## Testing & Verification

- Write unit tests (`*.test.ts`) with Vitest for:
  - Valibot domain schemas (valid transforms, trimming, invalid input rejection).
  - Application use cases (mocking repository interfaces to verify business rules and edge cases).
  - Zustand stores (state transitions and reset behavior).
  - Pure shared utilities and mappers.
- Before considering any code change complete, run and pass:
  - `npm run typecheck` (`tsc --noEmit`)
  - `npm run lint` (`expo lint`)
  - `npm test` (`vitest run`)
- Never claim checks passed without running them after the final edit.
