import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile menu opens and closes with Escape", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);

    const toggle = page.getByRole("button", { name: "Toggle Mobile Menu" });
    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Home", exact: true })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

test("delete modal traps focus and restores it on close", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "sadaqaDeleteTokens",
      JSON.stringify({ example: "local-token" }),
    );
  });

  await page.route("**/api/sadaqa-garya", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        deceased: [
          {
            id: "example-id",
            slug: "example",
            nameEn: "Test Person",
            nameAr: "شخص تجريبي",
            messageEn: "A test memorial.",
            messageAr: "صفحة تجريبية.",
            createdAt: new Date().toISOString(),
          },
        ],
        ownedSlugs: ["example"],
      }),
    }),
  );

  await page.goto("/en/sadaqat", { waitUntil: "domcontentloaded" });

  const deleteButton = page.getByRole("button", { name: "Delete" }).first();
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  const dialog = page.getByRole("dialog");
  const confirmButton = dialog.getByRole("button", { name: "Delete" });
  await expect(confirmButton).toBeVisible();

  const focusIsInDialog = await page.evaluate(() =>
    Boolean(document.activeElement?.closest('[role="dialog"]')),
  );
  expect(focusIsInDialog).toBe(true);

  await page.keyboard.press("Escape");

  await expect(confirmButton).toBeHidden();
  await expect(deleteButton).toBeFocused();
});
