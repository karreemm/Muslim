import { expect, test, type Page } from "@playwright/test";

const colorScheme = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);

test.describe("theme color scheme", () => {
  test.use({ colorScheme: "dark" });

  test("a stored light theme keeps the canvas light", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect.poll(() => colorScheme(page)).toBe("light");
  });

  test("a stored dark theme keeps the canvas dark", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect.poll(() => colorScheme(page)).toBe("dark");
  });

  test("without a stored theme the OS preference wins", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect.poll(() => colorScheme(page)).toBe("dark");
  });

  test("switching language keeps the selected theme", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/en", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: "Language" }).click();
    await page.getByRole("button", { name: "Arabic" }).click();
    await page.waitForURL(/\/ar/);

    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme === "dark"))
      .toBe(true);

    const background = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    const [r, g, b] = (background.match(/\d+/g) ?? []).map(Number);
    expect((r + g + b) / 3, `expected a dark background, got ${background}`).toBeLessThan(
      80,
    );
  });

  test("keeps the loading cover until the first themed paint", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    const started = Date.now();
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    await expect(page.locator("#app-loader")).toBeVisible();
    await expect(page.locator("#app-loader")).toBeHidden({ timeout: 15_000 });
    expect(Date.now() - started).toBeGreaterThanOrEqual(250);
  });

  test("switching language never paints a light frame", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark");
      (window as Window & { __sawLight?: boolean }).__sawLight = false;
      let frames = 0;

      const check = () => {
        frames += 1;
        if (document.documentElement.dataset.theme !== "dark") {
          (window as Window & { __sawLight?: boolean }).__sawLight = true;
        }
        if (frames < 240) requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });

    await page.goto("/en", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Language" }).click();
    await page.getByRole("button", { name: "Arabic" }).click();
    await page.waitForURL(/\/ar/);
    await page.waitForTimeout(1000);

    expect(
      await page.evaluate(() => (window as Window & { __sawLight?: boolean }).__sawLight),
    ).toBe(false);
  });
});
