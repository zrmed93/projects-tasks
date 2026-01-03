import { test, expect } from "@playwright/test"

test("unauthenticated user is redirected from /app to landing page", async ({
  page,
}) => {
  await page.goto("/app")

  await expect(page).toHaveURL(/\/$/)

  await expect(
    page.getByRole("button", { name: /sign in with google/i })
  ).toBeVisible()
})
