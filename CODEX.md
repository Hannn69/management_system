# CODEX.md - Frontend

## Project Overview
This is the Next.js frontend for the Management System. It is built with the App Router, TypeScript, and Tailwind CSS. It communicates with a NestJS backend located in `management_system_api/`.

Key stack:
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Lucide React (Icons)
- Radix UI (Primitives)
- `pnpm` as the package manager

## Local Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables in `.env`.
Expected backend URL:
```env
NEXT_PUBLIC_API_URL="http://localhost:8080"
```

3. Start the development server:
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`.

## Common Commands
```bash
pnpm dev      # Start dev server with Turbopack
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Codebase Structure
- `src/app/`: App Router routes and pages.
  - Each directory (e.g., `assets/`, `users/`) represents a functional module.
- `src/components/`: Reusable React components.
  - `ui/`: Lower-level UI primitives (Radix UI, styled components).
- `src/lib/`: Utility functions, auth logic, and shared types.
  - `auth.ts`: Frontend authentication logic.
  - `types.ts`: TypeScript interfaces mirroring backend DTOs.
- `public/`: Static assets (images, icons).

## Conventions
- **Server Components by Default**: Use Server Components for data fetching and Layouts.
- **Client Components**: Use `'use client'` directive only when interactivity (hooks, event listeners) is required.
- **Data Fetching**: Fetch data in Server Components or use Server Actions for mutations.
- **Styling**: Use Tailwind CSS utility classes. Prefer `clsx` and `tailwind-merge` for conditional class joining.
- **Icons**: Use `lucide-react` for consistent iconography.

## Security Notes
- **Environment Variables**: Never prefix sensitive keys with `NEXT_PUBLIC_`.
- **Server Actions**: Always validate input using Zod and verify authorization inside the action.
- **Tainting**: Use React `taint` APIs to prevent passing raw backend secrets to the client.
