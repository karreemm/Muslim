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

  const readCount = () => page.evaluate(() => localStorage.getItem("tasbeeh_count"));

  // Clicks before hydration are silently ignored, so drive the counter until it
  // reaches two instead of assuming the first two clicks land.
  await expect
    .poll(
      async () => {
        const count = Number((await readCount()) ?? "0");
        if (count >= 2) return count;
        await increment.click();
        return Number((await readCount()) ?? "0");
      },
      { timeout: 15_000 },
    )
    .toBe(2);
});

test("Quran search returns results", async ({ page }) => {
  await page.goto("/en/search-ayah", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);

  const searchInput = page.getByRole("textbox", { name: "Search" });
  const searchButton = page.getByRole("button", { name: "Search" });

  // Hydration can reset a controlled input filled too early in dev.
  await expect(async () => {
    await searchInput.fill("الله");
    await expect(searchButton).toBeEnabled({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await searchButton.click();

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

  const nameEn = page.getByRole("textbox", {
    name: "Deceased's Name (in English)",
  });
  const nameAr = page.getByRole("textbox", {
    name: "Deceased's Name (in Arabic)",
  });
  const createButton = page.getByRole("button", { name: "Create" });

  // In dev, hydration can happen after the first fill and reset the controlled
  // inputs. Re-fill until the form actually accepts both names.
  await expect(async () => {
    await nameEn.fill("Test Person");
    await nameAr.fill("شخص تجريبي");
    await expect(createButton).toBeEnabled({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await createButton.click();

  // The first navigation to the dynamic memorial route compiles it in dev, which
  // can take longer than the default assertion timeout.
  await expect(page).toHaveURL(/\/en\/sadaqa-garya\/test-person$/, {
    timeout: 15_000,
  });
  await expect(page.getByText("Test Person")).toBeVisible();

  await page.goto("/en/sadaqat", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Test Person")).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Delete" }).click();

  await expect(dialog.getByRole("button", { name: "Delete" })).toBeHidden();
  await expect(page.getByText("Test Person", { exact: true })).toBeHidden();
});

test("a saved ayah opens the surah at that ayah", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "savedAyahs",
      JSON.stringify([
        {
          surahNameEn: "Al-Baqara",
          surahNameAr: "البقرة",
          ayahNumberEn: 255,
          ayahNumberAr: "٢٥٥",
          text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
          SurahNumber: 2,
        },
      ]),
    );
  });

  await page.goto("/en/saved-ayahs", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Al-Baqara")).toBeVisible();
  await page.getByRole("button", { name: "Go to" }).first().click();

  await expect(page).toHaveURL(/\/en\/read-quran\/surah\/2\?ayah=255$/);
  // The reader renders pages progressively and loads page fonts lazily; the
  // saved ayah must still end up in view, not just load the surah at the top.
  await expect(page.locator("#ayah-255-2")).toBeInViewport({ timeout: 20_000 });
});

test("qibla calculates a bearing from a governorate", async ({ page }) => {
  await page.goto("/en/qibla", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { name: "Qibla Direction" })).toBeVisible();

  const selector = page.getByRole("button", {
    name: /Choose a governorate|My current location/,
  });
  await expect(async () => {
    await selector.click();
    await expect(page.getByRole("option", { name: "Cairo" })).toBeVisible({
      timeout: 1_000,
    });
  }).toPass({ timeout: 15_000 });

  await page.getByRole("option", { name: "Cairo" }).click();

  await expect(page.getByText("136.1°")).toBeVisible();
  await expect(page.getByText(/1,287/)).toBeVisible();
});
