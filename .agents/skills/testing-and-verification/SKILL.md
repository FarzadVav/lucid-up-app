---
name: testing-and-verification
description: >-
  Workflow for writing Vitest unit tests for Clean Architecture layers and
  running Lucid Up's full verification suite (typecheck, lint, unit tests, and
  Expo diagnostics). Activate before finalizing any code change.
---

# Testing & Verification Workflow

## Unit Testing (`vitest`)

Vitest runs in Node (`vitest.config.mts`) with `@/* -> ./src/*` alias resolution. Keep tests fast, deterministic, and focused on pure layers:

1. **Valibot Schemas (`domain/schemas/*.test.ts`)**: Verify trimming, transforms, valid payloads, and rejection messages.
2. **Use Cases (`application/use-cases/*.test.ts`)**: Pass mock repository objects (`vi.fn()`) to verify business rules, UUID validation, default fallbacks, and error cases without hitting Supabase.
3. **Zustand Stores (`application/stores/*.test.ts`)**: Reset store state in `beforeEach` and verify state transitions.
4. **Shared Utilities & Mappers (`shared/utils/*.test.ts`, `infrastructure/mappers/*.test.ts`)**: Test pure transformations and edge cases.

## Required Verification Commands

Run all three after final edits before reporting completion:

```bash
npm run typecheck   # npx tsc --noEmit
npm run lint        # expo lint (ESLint + React Compiler rules)
npm test            # vitest run
```

Also run `npx expo-doctor` when modifying `package.json`, Expo SDK packages, or `app.json`.
