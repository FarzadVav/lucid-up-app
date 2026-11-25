---
name: zustand-client-state
description: >-
  Guides creating and using Zustand v5 stores for client-side global state and
  shared UI state without overlapping TanStack Query server state. Activate when
  evaluating or adding global client state.
---

# Zustand Client-Side State

Use Zustand (`zustand` v5) strictly for client-side global state and shared UI state—never as a cache for Supabase database rows.

## Decision Check

- Is the data fetched from or persisted to Supabase Postgres? -> Use **TanStack Query**, not Zustand.
- Is the state local to a single screen or dialog? -> Use local `useState`, not Zustand.
- Is the state global client/runtime state (e.g., auth session, initialization flag, cross-screen transient UI state)? -> Use **Zustand**.

## Implementation Pattern

1. Place feature-scoped stores in `src/features/<feature>/application/stores/` (or `src/shared/stores/` if genuinely cross-feature).
2. Define an explicit TypeScript interface for state + actions (`create<StoreState>((set) => ({ ... }))`).
3. Do not import React components or JSX into store files.
4. Expose narrow selector hooks in `presentation/hooks/` (e.g., `useAuthStore((s) => s.session)`) so components only re-render on slices they use.
5. Add unit tests (`*.test.ts`) verifying store actions and `reset()` behavior.
