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
});
