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

test("Qibla calculates a bearing from a governorate", async ({ page }) => {
  await page.goto("/en/qibla", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Qibla Direction" })).toBeVisible();

  const selector = page.getByRole("button", {
    name: /Choose a governorate|My current location/,
  });
  await expect(async () => {
    await selector.click();
    await expect(page.getByRole("option", { name: "Cairo" })).toBeVisible({
      timeout: 1_000,
    });
  }).toPass({ timeout: 15_000 });

  await page.getByRole("option", { name: "Cairo" }).click();

  await expect(page.getByText("136.1°")).toBeVisible();
});

test("unknown route returns a localized 404", async ({ page }) => {
  const response = await page.goto("/en/this-page-does-not-exist", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(404);
  await expect(page.getByText("Page Not Found")).toBeVisible();
});
