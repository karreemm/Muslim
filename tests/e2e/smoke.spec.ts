import { expect, test } from "@playwright/test";

const englishRoutes = [
  "/en",
  "/en/read-quran",
  "/en/read-quran/surah/1",
  "/en/read-quran/juz/1",
  "/en/read-hadith",
  "/en/read-hadith/book/sahih-bukhari",
  "/en/listen-quran",
  "/en/listen-quran/reciter/ar.alafasy",
  "/en/radios",
  "/en/azkar",
  "/en/azkar/category/morning_azkar",
  "/en/prayer-times",
  "/en/tasbeeh",
  "/en/search-ayah",
  "/en/generate-ayah-image",
  "/en/sadaqa-garya",
  "/en/saved-ayahs",
  "/en/favourites",
  "/en/sadaqat",
];

const arabicRoutes = [
  "/ar",
  "/ar/read-quran",
  "/ar/read-quran/surah/1",
  "/ar/read-hadith/book/sahih-bukhari",
  "/ar/listen-quran/reciter/ar.alafasy",
  "/ar/azkar/category/morning_azkar",
  "/ar/prayer-times",
  "/ar/sadaqa-garya",
];

test.describe("route smoke", () => {
  for (const route of englishRoutes) {
    test(`${route} renders without an HTTP error`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
    });
  }

  for (const route of arabicRoutes) {
    test(`${route} renders without an HTTP error`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

test.describe("localized 404", () => {
  test("English unknown path returns a noindex 404", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByText("Page Not Found")).toBeVisible();
    const robots = await page
      .locator('meta[name="robots"]')
      .evaluateAll((metas) => metas.map((meta) => meta.getAttribute("content")));
    expect(robots.some((content) => content?.includes("noindex"))).toBe(true);
  });

  test("Arabic unknown path returns a noindex 404", async ({ page }) => {
    const response = await page.goto("/ar/this-page-does-not-exist", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByText("الصفحة غير موجودة")).toBeVisible();
    const robots = await page
      .locator('meta[name="robots"]')
      .evaluateAll((metas) => metas.map((meta) => meta.getAttribute("content")));
    expect(robots.some((content) => content?.includes("noindex"))).toBe(true);
  });
});

test.describe("root locale redirect", () => {
  test("defaults to Arabic without a saved language", async ({ request }) => {
    const response = await request.get("/", {
      headers: { "accept-language": "en-US,en;q=0.9" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/ar");
  });

  test("prefers the saved language cookie over Accept-Language", async ({ request }) => {
    const response = await request.get("/", {
      headers: {
        "accept-language": "en-US,en;q=0.9",
        cookie: "language=ar",
      },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/ar");
  });

  test("uses a saved English cookie even when the browser prefers Arabic", async ({
    request,
  }) => {
    const response = await request.get("/", {
      headers: {
        "accept-language": "ar",
        cookie: "language=en",
      },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/en");
  });

  test("falls back to Arabic and saves the cookie when there is no preference", async ({
    request,
  }) => {
    const response = await request.get("/", {
      headers: { "accept-language": "" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/ar");
    expect(response.headers()["set-cookie"]).toContain("language=ar");
  });

  test("unprefixed links fall back to Arabic and save the cookie", async ({
    request,
  }) => {
    for (const path of [
      "/read-quran",
      "/azkar/category/morning_azkar",
      "/sadaqa-garya/example?from=share",
    ]) {
      const response = await request.get(path, {
        headers: { "accept-language": "" },
        maxRedirects: 0,
      });

      expect(response.status(), path).toBe(307);
      expect(response.headers()["location"], path).toContain(`/ar${path}`);
      expect(response.headers()["set-cookie"], path).toContain("language=ar");
    }
  });

  test("re-homes an unsupported locale prefix", async ({ request }) => {
    const response = await request.get("/fr/read-quran", {
      headers: { "accept-language": "ar" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/ar/read-quran");
  });
});
