# Authentication Implementation

## JWT Configuration
Register the `JwtModule` globally in your `AuthModule`:

```typescript
JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
})
```

## Global AuthGuard Pattern
Register the guard as a global provider to ensure "Secure by Default":

```typescript
// app.module.ts
{
  provide: APP_GUARD,
  useClass: AuthGuard,
}
```

## Public Decorator
Allow explicit opt-out for public endpoints:

```typescript
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// In AuthGuard
const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  context.getHandler(),
  context.getClass(),
]);
if (isPublic) return true;
```

## Password Hashing
Always use `bcrypt` with at least 10 salt rounds:
- Store: `await bcrypt.hash(password, 10)`
- Verify: `await bcrypt.compare(password, hash)`
