---
name: forms-with-rhf-valibot
description: >-
  Guides building validated, accessible, React Compiler-compatible forms using
  React Hook Form, Valibot (@hookform/resolvers/valibot), FormTextField, and
  ConfirmDialog. Activate whenever creating or updating any form screen.
---

# Forms with React Hook Form & Valibot

Standardizes form schemas, validation, error display, and confirmation dialogs across Lucid Up.

## Steps

1. **Define Schema in `domain/schemas/`**
   - Author the schema with `valibot` (`v.object`, `v.pipe`, `v.trim()`, `v.nonEmpty()`, etc.).
   - Export both `v.InferInput<typeof schema>` and `v.InferOutput<typeof schema>`.
   - Reuse the same schema inside `application/use-cases/` via `v.parse(...)` for defense-in-depth.

2. **Configure `useForm` in Presentation**
   - Pass `resolver: valibotResolver(schema)`.
   - For edit forms hydrated from TanStack Query, pass `values: { ... }` (declarative sync) instead of manual `useEffect` + `setState` syncing.
   - Avoid `watch()` because `reactCompiler: true` is enabled in `app.json`.

3. **Render Inputs & Pickers**
   - Use `FormTextField` (`@/shared/components/form/form-field`) for text inputs (`Input` + label + accessible field error).
   - Use `Controller` directly for custom controls such as `CategoryPicker`.
   - Wrap the form in `SafeAreaView`, `KeyboardAvoidingView`, and `ScrollView` with `keyboardShouldPersistTaps="handled"`.

4. **Submit & Gate Important Actions**
   - On React Native `Button` `onPress` and `Input` `onSubmitEditing`, call `() => { void handleSubmit(onValid)(); }` so RN synthetic event types do not conflict with DOM `BaseSyntheticEvent`.
   - For important or mutating edits/creations (journals, categories), store validated `pendingValues` in `onValid` and open `ConfirmDialog`; run the TanStack Query mutation only in `ConfirmDialog.onConfirm`.
