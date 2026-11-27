import { expect, test } from "@playwright/test";

const pagesWithLinks = [
  "/en",
  "/ar",
  "/en/read-quran/surah/1",
  "/ar/read-quran/surah/1",
  "/en/read-quran/juz/1",
  "/ar/read-quran/juz/1",
  "/en/read-hadith",
  "/ar/read-hadith",
  "/en/read-hadith/book/sahih-bukhari",
  "/ar/read-hadith/book/sahih-bukhari",
  "/en/listen-quran",
  "/ar/listen-quran",
  "/en/listen-quran/reciter/ar.alafasy",
  "/ar/listen-quran/reciter/ar.alafasy",
  "/en/radios",
  "/en/azkar",
  "/ar/azkar",
  "/en/azkar/category/morning_azkar",
  "/ar/azkar/category/morning_azkar",
  "/en/prayer-times",
  "/en/qibla",
  "/en/tasbeeh",
  "/en/search-ayah",
  "/en/generate-ayah-image",
  "/en/sadaqa-garya",
  "/en/saved-ayahs",
  "/en/favourites",
  "/en/sadaqat",
];

test("internal links keep the active locale", async ({ page }) => {
  test.setTimeout(120_000);

  for (const route of pagesWithLinks) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);

    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href"))
          .filter((href): href is string => Boolean(href)),
      );

    for (const href of hrefs) {
      expect(href, `${route} rendered an unprefixed internal link: ${href}`).toMatch(
        /^\/(ar|en)(\/|$)/,
      );
    }
  }
});

test("primary internal links resolve", async ({ page, request }) => {
  test.setTimeout(120_000);
  const paths = new Set<string>();

  for (const route of pagesWithLinks) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);

    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href"))
          .filter((href): href is string => Boolean(href)),
      );

    for (const href of hrefs) {
      paths.add(href.split("#")[0]);
    }
  }

  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), `${path} returned ${response.status()}`).toBeLessThan(400);
  }
});
