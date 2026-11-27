import { expect, test } from "@playwright/test";

const paths = [
  "",
  "/read-quran",
  "/read-quran/surah/1",
  "/read-quran/juz/1",
  "/read-hadith",
  "/read-hadith/book/sahih-bukhari",
  "/listen-quran",
  "/listen-quran/reciter/ar.alafasy",
  "/radios",
  "/azkar",
  "/azkar/category/morning_azkar",
  "/prayer-times",
  "/qibla",
  "/tasbeeh",
  "/search-ayah",
  "/generate-ayah-image",
  "/sadaqa-garya",
  "/saved-ayahs",
  "/favourites",
  "/sadaqat",
];

const routes = ["ar", "en"].flatMap((locale) => paths.map((path) => `/${locale}${path}`));

test("main routes do not log missing translation keys in either locale", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const missing: string[] = [];

  page.on("console", (message) => {
    if (
      message.type() === "warning" &&
      message.text().includes("Translation key not found")
    ) {
      missing.push(message.text());
    }
  });

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);
  }

  expect(missing).toEqual([]);
});

test("switching language does not warn about rendering script tags", async ({ page }) => {
  const scriptWarnings: string[] = [];

  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().includes("Encountered a script tag")
    ) {
      scriptWarnings.push(message.text());
    }
  });

  await page.goto("/en/read-quran", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: /language/i }).click();
  await page.getByRole("button", { name: /arabic/i }).click();

  await expect(page).toHaveURL(/\/ar\/read-quran$/);
  await page.waitForTimeout(500);

  expect(scriptWarnings).toEqual([]);
});

test("switching language keeps the current page", async ({ page }) => {
  await page.goto("/en/read-quran/surah/1", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: /language|اللغة/i }).click();
  await page.getByRole("button", { name: /arabic|العربية/i }).click();

  await expect(page).toHaveURL(/\/ar\/read-quran\/surah\/1$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("switching language preserves query parameters", async ({ page }) => {
  await page.goto("/en/read-quran/surah/1?ayah=7", {
    waitUntil: "domcontentloaded",
  });

  await page.getByRole("button", { name: /language|اللغة/i }).click();
  await page.getByRole("button", { name: /arabic|العربية/i }).click();

  await expect(page).toHaveURL(/\/ar\/read-quran\/surah\/1\?ayah=7$/);
});
