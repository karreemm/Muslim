import { expect, test } from "@playwright/test";

const routes = [
  "",
  "/read-quran",
  "/read-quran/surah/1",
  "/read-quran/juz/1",
  "/listen-quran",
  "/listen-quran/reciter/ar.alafasy",
  "/read-hadith",
  "/read-hadith/book/sahih-bukhari",
  "/azkar",
  "/azkar/category/morning_azkar",
  "/prayer-times",
  "/radios",
  "/tasbeeh",
  "/search-ayah",
  "/generate-ayah-image",
  "/sadaqa-garya",
  "/sadaqat",
  "/saved-ayahs",
  "/favourites",
  "/this-page-does-not-exist",
];

const narrowRoutes = [
  "",
  "/read-quran",
  "/azkar",
  "/tasbeeh",
  "/sadaqa-garya",
  "/saved-ayahs",
];

for (const locale of ["en", "ar"]) {
  test.describe(`${locale} route contract`, () => {
    for (const route of routes) {
      test(`${route || "/"}`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`/${locale}${route}`, {
          waitUntil: "domcontentloaded",
        });

        const heading = page.locator("h1");
        await expect(heading).toHaveCount(1, { timeout: 20_000 });
        await expect(heading).toBeVisible();

        const className = (await heading.getAttribute("class")) ?? "";
        expect(className, "h1 must use a type-* role").toMatch(/\btype-/);

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, "no horizontal overflow").toBeLessThanOrEqual(1);
      });
    }
  });
}

for (const width of [320, 768]) {
  test.describe(`${width}px route contract`, () => {
    for (const route of narrowRoutes) {
      test(`${route || "/"}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/en${route}`, { waitUntil: "domcontentloaded" });

        await expect(page.locator("h1")).toHaveCount(1, { timeout: 20_000 });

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, "no horizontal overflow").toBeLessThanOrEqual(1);
      });
    }
  });
}
