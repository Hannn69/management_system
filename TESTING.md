# Testing Guide

This project includes comprehensive testing setup with unit tests, integration tests, and end-to-end (E2E) tests.

## Testing Stack

- **Unit & Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage Reporting**: Jest coverage

## Getting Started

### Install Dependencies

```bash
pnpm install
```

## Running Tests

### Unit Tests

Run all unit tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run tests with coverage report:

```bash
pnpm test:coverage
```

### Integration Tests

Run integration tests only:

```bash
pnpm test:integration
```

### E2E Tests

Run E2E tests:

```bash
pnpm test:e2e
```

Run E2E tests with UI (interactive mode):

```bash
pnpm test:e2e:ui
```

Debug E2E tests:

```bash
pnpm test:e2e:debug
```

### Run All Tests

```bash
pnpm test:all
```

## Test Structure

### Directory Layout

```
test/
├── unit/                  # Unit tests for functions and components
│   ├── utils.test.ts
│   ├── auth.test.ts
│   └── RefreshButton.test.tsx
├── integration/           # Integration tests for multiple components
│   ├── dashboard.integration.test.tsx
│   └── api.integration.test.ts
├── e2e/                   # End-to-end tests with Playwright
│   ├── dashboard.spec.ts
│   ├── navigation.spec.ts
│   └── api.spec.ts
└── test-utils.tsx         # Shared test utilities
```

## Writing Tests

### Unit Test Example

```typescript
// test/unit/example.test.ts
describe("MyFunction", () => {
  it("should do something", () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

### Component Test Example

```typescript
// test/unit/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Integration Test Example

```typescript
// test/integration/feature.integration.test.tsx
describe('Feature Integration', () => {
  it('should work with other components', () => {
    render(<FeatureWithDependencies />)
    // Test interaction between components
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### E2E Test Example

```typescript
// test/e2e/feature.spec.ts
import { test, expect } from "@playwright/test";

test("should complete user flow", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  await page.click('button:has-text("Action")');

  expect(page.url()).toContain("/expected-page");
});
```

## Test Configuration

### Jest Configuration (`jest.config.ts`)

- Uses Next.js Jest configuration
- JSX support enabled
- Path aliases configured (@/_ maps to src/_)
- jsdom test environment for browser-like testing
- Coverage collection configured

### Playwright Configuration (`playwright.config.ts`)

- Tests run against `http://localhost:3000`
- Includes multiple browser profiles (Chromium, Firefox, WebKit)
- Mobile device testing included
- Dev server starts automatically
- HTML report generation enabled

## Best Practices

### For Unit Tests

1. Test one thing per test
2. Use descriptive test names
3. Follow the Arrange-Act-Assert pattern
4. Mock external dependencies
5. Keep tests fast

### For Integration Tests

1. Test feature workflows
2. Test component interaction
3. Mock API responses
4. Test error scenarios

### For E2E Tests

1. Test critical user paths
2. Test across different browsers
3. Test responsive design
4. Keep E2E tests minimal (they're slower)
5. Focus on user perspective

## Coverage Goals

Aim for:

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Debugging Tests

### Debug Jest Tests

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome.

### Debug Playwright Tests

```bash
pnpm test:e2e:debug
```

Or use the UI mode:

```bash
pnpm test:e2e:ui
```

## CI/CD Integration

These tests are ready for CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: pnpm test:coverage

- name: Run E2E tests
  run: pnpm test:e2e
```

## Troubleshooting

### Tests fail with module errors

1. Ensure `jest.setup.ts` is in root
2. Check `moduleNameMapper` in `jest.config.ts`
3. Verify TypeScript paths in `tsconfig.json`

### Playwright tests timeout

1. Ensure dev server is running: `pnpm dev`
2. Check `baseURL` in `playwright.config.ts`
3. Increase timeout in test or config

### Coverage reports not generating

1. Check write permissions in project
2. Verify `collectCoverageFrom` patterns
3. Ensure tests actually run

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
