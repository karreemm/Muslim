import { expect, test } from "@playwright/test";

test("read Quran opens a surah from the index", async ({ page }) => {
  await page.goto("/en/read-quran", { waitUntil: "domcontentloaded" });

  await page
    .getByRole("link", { name: /Al-Fatiha/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/en\/read-quran\/surah\/1$/);
  await expect(page.locator("body")).toBeVisible();
});

test("azkar opens a category from the index", async ({ page }) => {
  await page.goto("/en/azkar", { waitUntil: "domcontentloaded" });

  await page
    .getByRole("link", { name: /Morning Azkar/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/en\/azkar\/category\/morning_azkar$/);
  await expect(page.locator("body")).toBeVisible();
});

test("tasbeeh increments and persists the count", async ({ page }) => {
  await page.goto("/en/tasbeeh", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);

  const increment = page.getByRole("button", { name: "Increment" });
  await expect(increment).toBeEnabled();

  await increment.click();
  await increment.click();

  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("tasbeeh_count")))
    .toBe("2");
});

test("Quran search returns results", async ({ page }) => {
  await page.goto("/en/search-ayah", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);

  await page.getByRole("textbox", { name: "Search" }).fill("الله");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText(/Al-Faatiha|Al-Baqara/i).first()).toBeVisible({
    timeout: 15_000,
  });
});

test("Sadaqa can be created and deleted with mocked storage", async ({ page }) => {
  const record = {
    id: "test-id",
    slug: "test-person",
    nameEn: "Test Person",
    nameAr: "شخص تجريبي",
    messageEn: "A test memorial.",
    messageAr: "صفحة تجريبية.",
    createdAt: new Date().toISOString(),
  };

  await page.route("**/api/sadaqa-garya", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ deceased: record, deleteToken: "test-token" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ deceased: [record], ownedSlugs: [record.slug] }),
    });
  });

  await page.route("**/api/sadaqa-garya/test-person", async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ deceased: record }),
    });
  });

  await page.goto("/en/sadaqa-garya", { waitUntil: "domcontentloaded" });

  await page
    .getByRole("textbox", { name: "Deceased's Name (in English)" })
    .fill("Test Person");
  await page
    .getByRole("textbox", { name: "Deceased's Name (in Arabic)" })
    .fill("شخص تجريبي");
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page).toHaveURL(/\/en\/sadaqa-garya\/test-person$/);
  await expect(page.getByText("Test Person")).toBeVisible();

  await page.goto("/en/sadaqat", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Test Person")).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Delete" }).click();

  await expect(dialog.getByRole("button", { name: "Delete" })).toBeHidden();
  await expect(page.getByText("Test Person", { exact: true })).toBeHidden();
});

test("a saved ayah opens the correct surah and ayah", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "savedAyahs",
      JSON.stringify([
        {
          surahNameEn: "Al-Fatiha",
          surahNameAr: "الفاتحة",
          ayahNumberEn: 1,
          ayahNumberAr: "١",
          text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          SurahNumber: 1,
        },
      ]),
    );
  });

  await page.goto("/en/saved-ayahs", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Al-Fatiha")).toBeVisible();
  await page.getByRole("button", { name: "Go to" }).first().click();

  await expect(page).toHaveURL(/\/en\/read-quran\/surah\/1\?ayah=1$/);
});
