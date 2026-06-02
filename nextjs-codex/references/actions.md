# Securing Server Actions

## Zero-Trust Implementation
Server Actions are public POST endpoints. Always implement these four checks:

```typescript
export async function myAction(data: any) {
  'use server'
  
  // 1. Authentication
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Authorization
  const hasAccess = await checkRole(session.user, 'admin');
  if (!hasAccess) throw new Error("Forbidden");

  // 3. Validation
  const validatedFields = mySchema.safeParse(data);
  if (!validatedFields.success) throw new Error("Invalid Input");

  // 4. Rate Limiting (Optional but Recommended)
  await checkRateLimit(session.user.id);

  // Execute Backend Call
  return await callNestJS(validatedFields.data);
}
```

## Closures & Data Leakage
Be careful when a Server Action uses variables from the outer scope of a Server Component. 
- **Rule**: Only close over non-sensitive IDs. Never close over objects containing secrets.

## CSRF Protection
Next.js provides built-in CSRF protection for Server Actions by comparing the `Origin` and `Host` headers. Ensure your environment correctly reflects the production URL.
