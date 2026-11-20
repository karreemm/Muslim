import { test, expect } from "@playwright/test";

const routes = [
  { name: "home-en", path: "/en" },
  { name: "home-ar", path: "/ar" },
  { name: "read-quran-en", path: "/en/read-quran" },
  { name: "read-quran-ar", path: "/ar/read-quran" },
  { name: "tasbeeh-en", path: "/en/tasbeeh" },
  { name: "tasbeeh-ar", path: "/ar/tasbeeh" },
  { name: "sadaqa-garya-en", path: "/en/sadaqa-garya" },
  { name: "sadaqa-garya-ar", path: "/ar/sadaqa-garya" },
  { name: "not-found-en", path: "/en/this-page-does-not-exist" },
  { name: "not-found-ar", path: "/ar/this-page-does-not-exist" },
];

test.describe("visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
      localStorage.setItem("palette", "gold");
      localStorage.removeItem("paletteHue");
    });

    await page.route("**/api/sadaqa-garya", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ deceased: [], ownedSlugs: [] }),
      }),
    );
  });

  for (const route of routes) {
    test(route.name, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);

      const footer = page.locator("footer");
      const masks = (await footer.count()) > 0 ? [footer] : [];

      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        mask: masks,
      });
    });
  }
});
