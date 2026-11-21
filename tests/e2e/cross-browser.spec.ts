import { expect, test } from "@playwright/test";

test("home renders in the active locale", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("Arabic home renders RTL", async ({ page }) => {
  await page.goto("/ar", { waitUntil: "domcontentloaded" });

  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("Quran index renders", async ({ page }) => {
  await page.goto("/en/read-quran", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("link", { name: /Al-Fatiha/i }).first()).toBeVisible();
});

test("Tasbeeh interactive control renders", async ({ page }) => {
  await page.goto("/en/tasbeeh", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("button", { name: "Increment" })).toBeVisible();
});

test("unknown route returns a localized 404", async ({ page }) => {
  const response = await page.goto("/en/this-page-does-not-exist", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(404);
  await expect(page.getByText("Page Not Found")).toBeVisible();
});
