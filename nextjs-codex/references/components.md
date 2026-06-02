# Server vs. Client Components

## Server Components (Default)
- **Use Case**: Data fetching, accessing backend resources, storing sensitive config.
- **Security**: Code never leaves the server. You can safely use private API keys.
- **Constraint**: No interactivity (no `useState`, `useEffect`).

## Client Components
- **Use Case**: User interactivity, state management, browser APIs (local storage).
- **Security**: All code and props are visible to the user.
- **Constraint**: **NEVER** fetch data directly from the NestJS API if it requires a secret key. Proxy through a Server Action or Route Handler.

## The `server-only` Pattern
To ensure a file containing sensitive logic (like NestJS API keys) is never accidentally imported into a Client Component, add this import at the top:

```typescript
import 'server-only';
```

## Data Transformation
When passing data from a Server Component to a Client Component, use a "Surgical Prop" approach:
- **Bad**: `<ClientComp user={userFromDB} />` (leaks hashed passwords, etc.)
- **Good**: `<ClientComp user={{ name: user.name, avatar: user.avatar }} />`
