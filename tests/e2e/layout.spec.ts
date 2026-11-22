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

const centeredIndexRoutes = [
  "",
  "/read-quran",
  "/read-hadith",
  "/azkar",
  "/listen-quran",
  "/tasbeeh",
  "/saved-ayahs",
  "/favourites",
  "/sadaqat",
  "/search-ayah",
  "/generate-ayah-image",
  "/radios",
  "/sadaqa-garya",
];

const quoteRoutes = [
  "",
  "/read-quran",
  "/listen-quran",
  "/read-hadith",
  "/azkar",
  "/tasbeeh",
  "/prayer-times",
  "/radios",
  "/sadaqa-garya",
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

        const headingText = (await heading.innerText()).trim();
        expect(headingText.length, "h1 must stay short").toBeLessThanOrEqual(60);

        if (centeredIndexRoutes.includes(route)) {
          const align = await heading.evaluate(
            (element) => getComputedStyle(element).textAlign,
          );
          expect(align, "index title must be centered").toBe("center");
        }

        if (quoteRoutes.includes(route)) {
          const quoteFont = await page
            .locator("figure blockquote")
            .first()
            .evaluate((element) => getComputedStyle(element).fontFamily);
          expect(quoteFont, "quote must use the Amiri font").toContain("Amiri");
        }

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
