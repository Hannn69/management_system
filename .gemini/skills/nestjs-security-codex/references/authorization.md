# Authorization Implementation

## RBAC (Role-Based Access Control)
1. **Decorator**: Create a `@Roles(...roles: string[])` decorator.
2. **Guard**: Implement a `RolesGuard` that checks `request.user.roles`.

## Claims-Based Authorization
For granular permissions, use a metadata-driven approach:

```typescript
@CheckPermissions([Action.Read, 'User'])
@Get(':id')
findOne(@Param('id') id: string) { ... }
```

## CASL Integration (Advanced)
Use CASL for complex attribute-based access control (ABAC). Define abilities in a `AbilityFactory`:

```typescript
can(Action.Update, Article, { authorId: user.id });
```

## Best Practice
Always ensure the `AuthGuard` is registered before the `RolesGuard` or `PermissionsGuard` so that the `request.user` object is available for inspection.
