import { expect, test } from "@playwright/test";

const staticRoutes = [
  "/",
  "/read-quran",
  "/read-hadith",
  "/listen-quran",
  "/radios",
  "/azkar",
  "/prayer-times",
  "/tasbeeh",
  "/search-ayah",
  "/generate-ayah-image",
  "/sadaqa-garya",
  "/saved-ayahs",
  "/favourites",
  "/sadaqat",
];

test.describe("route smoke", () => {
  test("home page has the expected title", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/Muslim/i);
  });

  for (const route of staticRoutes) {
    test(`${route} renders without an HTTP error`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
    });
  }
});
