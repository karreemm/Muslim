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
  "/qibla",
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
  "/qibla",
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
  "/qibla",
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
  "/qibla",
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
  "/qibla",
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
        await expect(heading.first()).toBeVisible();

        // /sadaqa-garya needs Supabase. Without it the page swaps to the
        // error card after hydration, so form-specific checks do not apply.
        if (route === "/sadaqa-garya") {
          await page.waitForLoadState("networkidle").catch(() => {});
          await page.waitForTimeout(300);
        }
        const sadaqaUnavailable =
          route === "/sadaqa-garya" && (await page.locator("form").count()) === 0;

        const className = (await heading.first().getAttribute("class")) ?? "";
        expect(className, "h1 must use a type-* role").toMatch(/\btype-/);

        const headingText = (await heading.first().innerText()).trim();
        expect(headingText.length, "h1 must stay short").toBeLessThanOrEqual(60);

        if (pageTitleRoutes.includes(route) && !sadaqaUnavailable) {
          const align = await heading
            .first()
            .evaluate((element) => getComputedStyle(element).textAlign);
          expect(align, "index title must be centered").toBe("center");
        }

        if (subtitleRoutes.includes(route) && !sadaqaUnavailable) {
          const subtitle = await heading.first().evaluate((element) => {
            const sibling = element.nextElementSibling;
            return sibling?.tagName === "P" ? (sibling.textContent ?? "").trim() : "";
          });
          expect(subtitle.length, "page title must have a subtitle").toBeGreaterThan(0);
        }

        if (quoteRoutes.includes(route) && !sadaqaUnavailable) {
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
      test.setTimeout(120_000);
      await page.setViewportSize({ width: 1440, height: 900 });
      const sizes: Record<string, string> = {};

      for (const route of pageTitleRoutes.filter((route) => route !== "")) {
        await page.goto(`/${locale}${route}`, { waitUntil: "domcontentloaded" });

        if (route === "/sadaqa-garya") {
          await page.waitForLoadState("networkidle").catch(() => {});
          await page.waitForTimeout(300);
          if ((await page.locator("form").count()) === 0) continue;
        }

        const heading = page.locator("h1");
        await expect(heading).toHaveCount(1, { timeout: 20_000 });
        let fontSize = "";
        await expect
          .poll(
            async () => {
              try {
                fontSize = await heading
                  .first()
                  .evaluate((element) => getComputedStyle(element).fontSize);
              } catch {
                fontSize = "";
              }
              return fontSize;
            },
            { timeout: 5_000 },
          )
          .not.toBe("");
        sizes[route] = fontSize;
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
