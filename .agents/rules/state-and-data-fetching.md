# State Management, Data Fetching & Forms

Each core library has one clear responsibility. Never duplicate state across them.

## 1. Zustand (Client-Side Global & Shared UI State)

- Use Zustand **only** for client-owned runtime state that is not fetched from Postgres (for example, `useAuthStore` holding `session`, `isInitialized`, `authError`, or truly shared transient UI state).
- Never store fetched database records (`categories`, `journals`, `profile`) inside Zustand.
- Expose focused selector hooks (such as `useAuth()`) rather than subscribing components to entire stores.

## 2. TanStack Query (Server State & Mutations)

- Use TanStack Query (`@tanstack/react-query`) for **all** Supabase Postgres reads and writes.
- Do **not** use `useFocusEffect` + `useState` + `requestIdRef` for server data fetching.
- Define a structured `queryKeys` object per feature (scoped by `userId` for user-owned data).
- Invalidate affected query keys (or update cache via `setQueryData`) in mutation `onSuccess` callbacks.
- Clear the query cache (`queryClient.clear()`) on sign-out or session loss so data never leaks across accounts.

## 3. React Hook Form + Valibot (Forms & Validation)

- Use `react-hook-form` with `valibotResolver` (`@hookform/resolvers/valibot`) for all user input forms.
- Define Valibot schemas and inferred input/output types (`v.InferInput`, `v.InferOutput`) inside `<feature>/domain/schemas/` so both forms and application use cases share one source of truth.
- Render text inputs with `FormTextField` (`@/shared/components/form/form-field`) or `Controller` for custom pickers.
- Because `reactCompiler: true` is enabled in `app.json`, avoid `watch()` from React Hook Form; use `Controller`, `useWatch`, or validated submit payloads instead.
- On React Native buttons/inputs (`onPress`, `onSubmitEditing`), invoke `handleSubmit` inside an arrow wrapper: `onPress={() => { void handleSubmit(onValid)(); }}`.
- Gate important, mutating, or destructive form submissions (`edit`, `delete`, create/save confirmations where required) behind `ConfirmDialog`: validate via `handleSubmit` first, then execute the TanStack Query mutation only inside `onConfirm`.
