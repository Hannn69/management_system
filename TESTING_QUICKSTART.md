// Quick Start Guide for Testing

## Installation

First, install the test dependencies:

```bash
pnpm install
```

This will install:

- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - E2E testing framework
- **Testing Library** - Best practices testing utilities

## Quick Test Commands

```bash
# Run all unit tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# Run with coverage report
pnpm test:coverage

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode (interactive)
pnpm test:e2e:ui

# Run everything
pnpm test:all
```

## First Steps

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Run existing tests**

   ```bash
   pnpm test
   ```

   You should see some example tests run successfully.

3. **Try E2E tests**

   ```bash
   # Make sure dev server is running in another terminal
   pnpm dev

   # Then in another terminal
   pnpm test:e2e
   ```

4. **Create your first test**

   Create a file: `test/unit/my-feature.test.ts`

   ```typescript
   describe("My Feature", () => {
     it("should work", () => {
       expect(true).toBe(true);
     });
   });
   ```

   Run it: `pnpm test my-feature`

## Test Types

### Unit Tests

- Location: `test/unit/`
- Purpose: Test individual functions/components
- Speed: Fast ⚡
- Example: [RefreshButton.test.tsx](test/unit/RefreshButton.test.tsx)

### Integration Tests

- Location: `test/integration/`
- Purpose: Test features working together
- Speed: Medium ⏱️
- Example: [dashboard.integration.test.tsx](test/integration/dashboard.integration.test.tsx)

### E2E Tests

- Location: `test/e2e/`
- Purpose: Test complete user workflows
- Speed: Slower 🐢
- Example: [dashboard.spec.ts](test/e2e/dashboard.spec.ts)

## File Structure

```
project/
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Jest setup file
├── playwright.config.ts        # Playwright configuration
├── package.json                # Updated with test scripts
├── test/                       # All tests
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── e2e/                    # E2E tests
│   └── test-utils.tsx          # Shared test utilities
├── src/
│   ├── components/
│   ├── lib/
│   └── app/
└── TESTING.md                  # Full testing documentation
```

## Common Test Patterns

### Testing a Function

```typescript
import { myFunction } from "@/lib/utils";

describe("myFunction", () => {
  it("should return expected value", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });
});
```

### Testing a Component

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByText('Text')).toBeInTheDocument()
  })
})
```

### Testing Navigation (E2E)

```typescript
import { test, expect } from "@playwright/test";

test("should navigate", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click("text=Assets");
  expect(page.url()).toContain("/assets");
});
```

## Coverage Reports

After running `pnpm test:coverage`, open:

```bash
open coverage/lcov-report/index.html
```

This shows which lines/branches are tested.

## Need Help?

- See [TESTING.md](TESTING.md) for detailed documentation
- Check example tests in `test/unit/`, `test/integration/`, and `test/e2e/`
- Visit [Jest docs](https://jestjs.io/) for Jest-specific help
- Visit [Playwright docs](https://playwright.dev/) for E2E help

## Next Steps

1. ✅ Setup complete - tests are configured
2. 📝 Write tests for your components
3. 🧪 Run tests frequently during development
4. 📊 Monitor coverage with `pnpm test:coverage`
5. 🚀 Add tests to CI/CD pipeline

Happy testing! 🎉
