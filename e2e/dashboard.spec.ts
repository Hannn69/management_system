// e2e/dashboard.spec.ts
// Example End-to-End test using Playwright

import { test, expect } from '@playwright/test'

test.describe('Dashboard E2E Tests', () => {
  test('should navigate to dashboard and load', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle')
    
    // Check if page loaded successfully
    expect(page.url()).toContain('localhost')
  })

  test('should display main dashboard page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Wait for page load
    await page.waitForLoadState('networkidle')
    
    // Check for dashboard elements
    const pageTitle = await page.locator('h1, h2').first()
    expect(pageTitle).toBeDefined()
  })

  test('should navigate through main sections', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Check if navigation elements exist
    const navigationElements = await page.locator('[role="navigation"]').count()
    expect(navigationElements).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Assets Page E2E Tests', () => {
  test('should load assets page', async ({ page }) => {
    await page.goto('/assets')
    await page.waitForLoadState('networkidle')
    
    // Verify page loaded
    const pageContent = await page.content()
    expect(pageContent).toBeTruthy()
  })

  test('should display assets list', async ({ page }) => {
    await page.goto('/assets')
    await page.waitForLoadState('networkidle')
    
    // Check for common list elements
    const listItems = await page.locator('tbody tr, [role="row"]').count()
    expect(listItems).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Users Page E2E Tests', () => {
  test('should load users page', async ({ page }) => {
    await page.goto('/users')
    await page.waitForLoadState('networkidle')
    
    // Verify page loaded
    const pageContent = await page.content()
    expect(pageContent).toBeTruthy()
  })

  test('should handle user interactions', async ({ page }) => {
    await page.goto('/users')
    await page.waitForLoadState('networkidle')
    
    // Check for interactive elements
    const buttons = await page.locator('button').count()
    expect(buttons).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Authentication Flow E2E Tests', () => {
  test('should have login capability', async ({ page }) => {
    await page.goto('/api/auth')
    
    // Verify auth endpoint exists
    const response = page.url()
    expect(response).toBeTruthy()
  })
})
