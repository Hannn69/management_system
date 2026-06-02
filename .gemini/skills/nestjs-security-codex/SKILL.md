---
name: nestjs-security-codex
description: Official NestJS security best practices for Authentication, Authorization, Encryption, and Protection. Use when implementing login flows, setting up RBAC/CASL, or configuring global security middleware.
---

# NestJS Security Codex

This skill provides expert implementation guidance based on official NestJS security standards.

## Security Mandates

1.  **JWT-First Authentication**: Use `@nestjs/jwt` with a global `AuthGuard`. Use `@Public()` to explicitly opt-out of authentication.
2.  **Guard-Based Authorization**: Implement RBAC or Claims-based authorization using dedicated Guards. `AuthGuard` MUST always execute before `AuthorizationGuard`.
3.  **Encrypted Data at Rest**: Never store passwords in plain text. Use `bcrypt` for hashing and `crypto` (AES-256-CTR) for reversible encryption.
4.  **Early Middleware Defense**: Apply Helmet and CORS configurations as early as possible in `main.ts`.

## Core Implementation Guides

### 1. Authentication & Identity
Implementation of JWT strategies and Passport integration. See [auth.md](references/auth.md).

### 2. Authorization & RBAC
Defining and enforcing access control policies. See [authorization.md](references/authorization.md).

### 3. Protection Mechanisms
Configuration of Helmet, CORS, CSRF, and Rate Limiting. See [protection.md](references/protection.md).

## Quick Reference Commands

- **Authentication**: `pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt`
- **Rate Limiting**: `pnpm add @nestjs/throttler`
- **Security Headers**: `pnpm add helmet`
- **CSRF**: `pnpm add csrf-csrf`
