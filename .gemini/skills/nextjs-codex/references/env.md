# Environment Variables & Secrets

## The `NEXT_PUBLIC_` Rule
- **Private**: Variables like `NESTJS_API_KEY` or `DATABASE_URL` must **NOT** have a prefix. They are only available on the server.
- **Public**: Variables like `NEXT_PUBLIC_GA_ID` are inlined into the JS bundle and visible to everyone.

## Validation (Zod)
Always validate environment variables at startup to avoid runtime failures:

```typescript
// src/lib/env.mjs
import { z } from "zod";

const envSchema = z.object({
  NESTJS_API_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

## Tainting (React API)
Use the experimental `taint` APIs to prevent passing unique secrets (like raw API keys) to Client Components:

```typescript
import { experimental_taintUniqueValue } from 'react';

export async function getSecrets() {
  const secret = process.env.MY_SECRET;
  experimental_taintUniqueValue(
    'Do not pass the raw secret to the client.',
    null,
    secret
  );
  return secret;
}
```
