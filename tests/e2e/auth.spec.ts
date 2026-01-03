import { test, expect } from '@playwright/test'

test('redirects unauthenticated user from /app to landing', async ({ page }) => {
  await page.goto('/app')
  await expect(page).toHaveURL('/')
})
