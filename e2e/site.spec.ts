import { expect, test } from "@playwright/test";

test("renders cover and language toggle", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#cover")).toBeVisible();
  await expect(page.getByRole("button", { name: /switch to english|التحويل إلى العربية/i })).toBeVisible();
});
