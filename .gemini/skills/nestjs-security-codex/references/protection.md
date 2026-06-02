# Protection Mechanisms

## Helmet (Security Headers)
Always initialize in `main.ts` before other middleware:

```typescript
import helmet from 'helmet';
app.use(helmet());
```

## CORS
Configure restrictive origins in production:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
});
```

## Rate Limiting (Throttler)
Prevent Brute Force and DoS attacks:

```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,
  limit: 10,
}])

// Register globally
{
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
}
```

## CSRF
Use the `csrf-csrf` package for cookie-based CSRF protection. Ensure `cookie-parser` is initialized first.
For APIs used by SPAs with JWT in headers (not cookies), standard JWT authentication often mitigates CSRF, but defense-in-depth is recommended if using cookies for session persistence.
