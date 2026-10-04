import { test, expect } from "@playwright/test";

test("smoke test - French page", async ({ page }) => {
  await page.goto("/fr");
  await expect(page).toHaveTitle(/Domicile|Create Next App/);
});

test("smoke test - Arabic RTL page", async ({ page }) => {
  await page.goto("/ar");
  const html = await page.locator("html");
  await expect(html).toHaveAttribute("dir", "rtl");
  await expect(html).toHaveAttribute("lang", "ar");
});
