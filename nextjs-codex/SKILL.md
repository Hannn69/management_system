---
name: nextjs-codex
description: Expert guidance for Next.js App Router, Server Components, Server Actions, and Secure Frontend Patterns. Use when building UI components, implementing data fetching, or securing frontend mutations.
---

# Next.js App Router Codex

This skill provides the architectural mandates and procedural workflows for the Next.js frontend, focusing on security and seamless integration with the NestJS backend.

## Core Mandates

1.  **Server-First Architecture**: Prioritize Server Components for data fetching and sensitive logic. Keep Client Components thin and purely for interactivity.
2.  **Zero-Trust Server Actions**: Every Server Action MUST perform its own authentication, authorization, and Zod validation. Never trust data from the client.
3.  **Strict Data Hiding**: Use the `server-only` package and React `taint` APIs to prevent leakage of secrets or backend-only data to the browser.
4.  **BFF Integration**: Next.js acts as the Backend-for-Frontend. All calls to the NestJS API should happen via Server Components or secure proxies to hide backend endpoints.

## Procedural Workflows

### 1. Implementing a Protected Page
1.  **Verification**: Use middleware or Server Component checks to verify the user session.
2.  **Data Fetching**: Call the NestJS API directly from the Server Component. Attach the session JWT securely.
3.  **DTO Transformation**: Transform the backend response into a minimal DTO before passing it to child Client Components.

### 2. Securing a Server Action
1.  **Import**: Add `'use server'` at the top of the file or function.
2.  **Auth**: Call the session provider (e.g., Auth.js or custom session logic) inside the action.
3.  **Validate**: Use Zod to parse the input `formData` or arguments.
4.  **Execute**: Call the NestJS API. Update the UI cache using `revalidatePath` or `revalidateTag`.

## Reference Guides

- **Component Security**: See [components.md](references/components.md) for Server vs. Client patterns.
- **Action Security**: See [actions.md](references/actions.md) for securing mutations and validation.
- **Environment & Secrets**: See [env.md](references/env.md) for safe variable handling.
