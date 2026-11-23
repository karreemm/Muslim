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
  "/read-hadith/book/sahih-bukhari/chapter/1",
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
  "/read-hadith/book/sahih-bukhari/chapter/1",
  "/read-quran/surah/1",
  "/radios",
  "/read-hadith",
];

const pageTitleRoutes = [
  "",
  "/read-quran",
  "/read-quran/surah/1",
  "/read-quran/juz/1",
  "/read-hadith",
  "/read-hadith/book/sahih-bukhari",
  "/read-hadith/book/sahih-bukhari/chapter/1",
  "/azkar",
  "/azkar/category/morning_azkar",
  "/listen-quran",
  "/listen-quran/reciter/ar.alafasy",
  "/tasbeeh",
  "/saved-ayahs",
  "/favourites",
  "/sadaqat",
  "/search-ayah",
  "/generate-ayah-image",
  "/radios",
  "/sadaqa-garya",
];

const subtitleRoutes = [
  "/read-quran",
  "/listen-quran",
  "/read-hadith",
  "/read-hadith/book/sahih-bukhari",
  "/read-hadith/book/sahih-bukhari/chapter/1",
  "/azkar",
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

        if (pageTitleRoutes.includes(route)) {
          const align = await heading.evaluate(
            (element) => getComputedStyle(element).textAlign,
          );
          expect(align, "index title must be centered").toBe("center");
        }

        if (subtitleRoutes.includes(route)) {
          const subtitle = await heading.evaluate((element) => {
            const sibling = element.nextElementSibling;
            return sibling?.tagName === "P" ? (sibling.textContent ?? "").trim() : "";
          });
          expect(subtitle.length, "page title must have a subtitle").toBeGreaterThan(0);
        }

        if (quoteRoutes.includes(route)) {
          const quoteFont = await page
            .locator("figure blockquote")
            .first()
            .evaluate((element) => getComputedStyle(element).fontFamily);
          expect(quoteFont, "quote must use a Quran font").toMatch(/Amiri|p\d+-font/);
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

for (const locale of ["en", "ar"]) {
  test.describe(`${locale} title scale`, () => {
    test("page titles share one size", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const sizes: Record<string, string> = {};

      for (const route of pageTitleRoutes.filter((route) => route !== "")) {
        await page.goto(`/${locale}${route}`, { waitUntil: "domcontentloaded" });
        const heading = page.locator("h1");
        await expect(heading).toHaveCount(1, { timeout: 20_000 });
        sizes[route] = await heading.evaluate(
          (element) => getComputedStyle(element).fontSize,
        );
      }

      expect(
        new Set(Object.values(sizes)).size,
        `title sizes must match: ${JSON.stringify(sizes)}`,
      ).toBe(1);
    });

    test("page quotes use the mushaf page font", async ({ page }) => {
      await page.goto(`/${locale}/read-quran`, { waitUntil: "domcontentloaded" });
      const ayah = page.locator("figure blockquote span.inline-block").first();
      await expect(ayah).toBeVisible({ timeout: 20_000 });

      await expect
        .poll(() => ayah.evaluate((element) => getComputedStyle(element).fontFamily), {
          timeout: 20_000,
        })
        .toMatch(/^"?p\d+-font/);
    });
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
