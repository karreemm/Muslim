import { expect, test } from "@playwright/test";

const cases = [
  {
    path: "/en",
    title: /Muslim - Quran, Hadith, Azkar & Prayer Times/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar",
    title: /مسلم - القرآن والحديث والأذكار ومواقيت الصلاة/,
    lang: "ar",
    dir: "rtl",
  },
  { path: "/en/read-quran", title: /Read Quran \| Muslim/, lang: "en", dir: "ltr" },
  {
    path: "/ar/read-quran",
    title: /قراءة القرآن \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/read-quran/surah/1",
    title: /Surah Al-Fatiha \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/read-quran/surah/1",
    title: /سورة الفاتحة \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/read-quran/juz/1",
    title: /Juz 1 \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/read-quran/juz/1",
    title: /الجزء 1 \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/read-hadith/book/sahih-bukhari",
    title: /Sahih Bukhari \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/read-hadith/book/sahih-bukhari",
    title: /صحيح البخاري \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/read-hadith/book/sahih-bukhari/chapter/1",
    title: /Sahih Bukhari - Chapter 1 \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/read-hadith/book/sahih-bukhari/chapter/1",
    title: /صحيح البخاري - الباب 1 \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/listen-quran/reciter/ar.alafasy",
    title: /Listen to Mishary Alafasy \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/listen-quran/reciter/ar.alafasy",
    title: /الاستماع إلى مشاري العفاسي \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/azkar/category/morning_azkar",
    title: /Morning Azkar \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/azkar/category/morning_azkar",
    title: /أذكار الصباح \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/prayer-times",
    title: /Prayer Times \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/prayer-times",
    title: /مواقيت الصلاة \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/qibla",
    title: /Qibla Direction \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/qibla",
    title: /اتجاه القبلة \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
  {
    path: "/en/sadaqa-garya",
    title: /Sadaqa Jariyah \| Muslim/,
    lang: "en",
    dir: "ltr",
  },
  {
    path: "/ar/sadaqa-garya",
    title: /صدقة جارية \| مسلم/,
    lang: "ar",
    dir: "rtl",
  },
];

for (const entry of cases) {
  test(`${entry.path} has locale-aware metadata`, async ({ page }) => {
    await page.goto(entry.path, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator("html")).toHaveAttribute("lang", entry.lang);
    await expect(page.locator("html")).toHaveAttribute("dir", entry.dir);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.trim().length).toBeGreaterThan(20);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(
      new RegExp(`${entry.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    );

    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) =>
        links.map((link) => ({
          hreflang: link.getAttribute("hreflang"),
          href: link.getAttribute("href"),
        })),
      );

    expect(alternates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ hreflang: "ar", href: expect.stringContaining("/ar") }),
        expect.objectContaining({ hreflang: "en", href: expect.stringContaining("/en") }),
      ]),
    );
  });
}

test("square app icons are available and declared", async ({ request }) => {
  for (const icon of [
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-maskable-512.png",
    "/icons/apple-touch-icon.png",
  ]) {
    const response = await request.get(icon);
    expect(response.ok(), `${icon} returned ${response.status()}`).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  }

  const manifest = await request.get("/manifest.webmanifest");
  const data = (await manifest.json()) as {
    icons?: Array<{ src: string; sizes: string; purpose?: string }>;
  };

  expect(data.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ src: "/icons/icon-192.png", sizes: "192x192" }),
      expect.objectContaining({ src: "/icons/icon-512.png", sizes: "512x512" }),
      expect.objectContaining({
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        purpose: "maskable",
      }),
    ]),
  );
});

test("robots.txt and sitemap.xml expose both locales", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  const robotsText = await robots.text();
  expect(robotsText).toContain("Sitemap:");
  expect(robotsText).toContain("/*/sadaqat");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("/en/read-quran/surah/1");
  expect(sitemapText).toContain("/ar/read-quran/surah/1");
  expect(sitemapText).toContain('hreflang="ar"');
  expect(sitemapText).toContain('hreflang="en"');
});
