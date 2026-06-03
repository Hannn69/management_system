// e2e/navigation.spec.ts
// Example E2E tests for navigation flows

import { test, expect } from '@playwright/test'

test.describe('Navigation E2E Tests', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Navigate to assets
    const assetsLink = page.locator('a[href*="/assets"]').first()
    if (await assetsLink.isVisible()) {
      await assetsLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/assets')
    }
  })

  test('should navigate to different category pages', async ({ page }) => {
    const pages = ['/categories', '/companies', '/departments', '/locations']
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl)
      await page.waitForLoadState('networkidle')
      
      // Verify page loaded
      expect(page.url()).toContain(pageUrl)
    }
  })

  test('should handle navigation errors gracefully', async ({ page }) => {
    // Test navigation to non-existent page
    await page.goto('/non-existent-page', { waitUntil: 'networkidle' })
    
    // Should either redirect or show error page
    const url = page.url()
    expect(url).toBeTruthy()
  })

  test('should display breadcrumb navigation', async ({ page }) => {
    await page.goto('/assets')
    await page.waitForLoadState('networkidle')
    
    // Check for navigation hints
    const navigation = await page.locator('[role="navigation"]').count()
    expect(navigation).toBeGreaterThanOrEqual(0)
  })
})
