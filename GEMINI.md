# Next.js Agent Instructions

These instructions are scoped to the `management_system/` directory and govern frontend development.

## Frontend Mandates

### 1. Architectural Integrity
- **App Router Proficiency**: Leverage the App Router's nested layouts and loading states.
- **Server-First Logic**: Perform data fetching in Server Components to minimize client-side bundle size and improve security.
- **Module Consistency**: When adding a new module, follow the existing pattern in `src/app/`. Ensure a consistent layout with `AppShell`.

### 2. Interaction & State
- **Thin Client Components**: Keep Client Components focused on UI state and event handling. Move business logic to Server Actions or utility functions.
- **Optimistic Updates**: Use the `useOptimistic` hook for a snappier UI during Server Action mutations.
- **Error Boundaries**: Implement granular `error.tsx` and `loading.tsx` files for each major route.

### 3. Verification & Quality
- **Type Syncing**: Always verify that types in `src/lib/types.ts` match the backend DTOs before implementing new UI features.
- **Linting**: Run `pnpm lint` after significant component refactors.
- **Visual Regression**: Ensure new UI components adhere to the project's Tailwind CSS theme and spacing system.

## Performance Standards
- **Image Optimization**: Always use the Next.js `Image` component.
- **Font Optimization**: Use `next/font` for local and Google fonts.
- **Dynamic Imports**: Use `dynamic()` for heavy client-side components to improve initial load time.
