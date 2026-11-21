import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/en",
  "/ar",
  "/en/read-quran",
  "/ar/read-quran",
  "/en/read-quran/surah/1",
  "/en/read-hadith",
  "/en/azkar",
  "/en/prayer-times",
  "/en/tasbeeh",
  "/en/search-ayah",
  "/en/generate-ayah-image",
  "/en/sadaqa-garya",
  "/en/saved-ayahs",
  "/en/favourites",
  "/en/sadaqat",
  "/en/this-page-does-not-exist",
];

for (const route of routes) {
  test(`${route} has no critical or serious accessibility violations`, async ({
    page,
  }) => {
    if (route.includes("sadaqa")) {
      await page.route("**/api/sadaqa-garya", (request) =>
        request.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ deceased: [], ownedSlugs: [] }),
        }),
      );
    }

    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await page.addStyleTag({
      content: "*,*::before,*::after{animation:none!important;transition:none!important}",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1_000);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );

    expect(
      blocking,
      blocking
        .map(
          (violation) =>
            `${violation.impact}: ${violation.id} — ${violation.description}`,
        )
        .join("\n"),
    ).toEqual([]);
  });
}

test("language dropdown can be used with the keyboard", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });

  const trigger = page.getByRole("button", { name: /language/i });
  await expect(trigger).toBeEnabled();
  await trigger.focus();
  await page.keyboard.press("Enter");

  const arabic = page.getByRole("button", { name: /arabic|العربية/i });
  await expect(arabic).toBeVisible();
  await arabic.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
});
