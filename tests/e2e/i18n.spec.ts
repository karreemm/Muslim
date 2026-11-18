import { expect, test } from "@playwright/test";

const routes = [
  "/",
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
  "/tasbeeh",
  "/search-ayah",
  "/generate-ayah-image",
  "/sadaqa-garya",
  "/saved-ayahs",
  "/favourites",
  "/sadaqat",
];

test("main routes do not log missing translation keys", async ({ page }) => {
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
    await page.waitForTimeout(400);
  }

  expect(missing).toEqual([]);
});
