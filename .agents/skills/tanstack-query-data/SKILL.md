---
name: tanstack-query-data
description: >-
  Guides implementing server state queries, mutations, query key factories, and
  cache invalidation using TanStack Query v5 in Lucid Up. Activate whenever
  fetching or mutating Supabase data in a feature.
---

# TanStack Query Data Fetching & Mutations

All Supabase database reads and writes go through TanStack Query hooks in `src/features/<feature>/presentation/hooks/`, calling application use cases.

## Steps

1. **Create a User-Scoped Query Key Factory**
   - Put keys in `presentation/hooks/<feature>-query-keys.ts` (or top of the hook file).
   - Always scope user-owned keys by `userId` (`['<feature>', userId, ...]`) so cached entries are isolated per user.

2. **Implement Queries**
   - Read `user` from `@/features/auth` (`useAuth()`).
   - Gate queries with `enabled: Boolean(userId)` (plus `isValidUuid(id)` for detail queries).
   - Call the application use case inside `queryFn` (e.g., `listCategoriesUseCase(supabaseCategoryRepository, userId!)`).

3. **Implement Mutations & Cache Sync**
   - Call the application use case inside `mutationFn`.
   - In `onSuccess`, either update exact cache entries via `queryClient.setQueryData(...)` (e.g., profile updates) or invalidate affected keys via `queryClient.invalidateQueries({ queryKey: ... })`.
   - Ensure `AuthBootstrapper` / `useSignOutMutation` clears `queryClient.clear()` when the user signs out.

4. **Handle Loading & Error States**
   - Render `ActivityIndicator` (`color={THEME.foreground}`) during initial load.
   - Format thrown errors with `getErrorMessage(error, fallback)` (`@/shared/utils/errors`) and display them in `FeedbackBanner` (`variant="error"`, optional `onRetry={() => void query.refetch()}`).
