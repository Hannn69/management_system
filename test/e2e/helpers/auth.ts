import { expect, Page } from "@playwright/test";

const testUserEmail = process.env.E2E_USER_EMAIL || "admin@example.com";
const testUserPassword = process.env.E2E_USER_PASSWORD || "password123";

export async function signIn(page: Page) {
  const response = await page.request.post("/api/auth/login", {
    data: {
      email: testUserEmail,
      password: testUserPassword,
    },
  });

  expect(response.ok()).toBeTruthy();
}
