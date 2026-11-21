import { expect, test } from "@playwright/test";

test("Sadaqat shows a retryable error instead of a coming-soon card", async ({
  page,
}) => {
  await page.route("**/api/sadaqa-garya", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Failed to load records" }),
    }),
  );

  await page.goto("/ar/sadaqat", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("تعذر تحميل صدقاتك")).toBeVisible();
  await expect(page.getByRole("button", { name: "حاول مرة أخرى" })).toBeVisible();
  await expect(page.getByText("قريبًا")).toHaveCount(0);
});

test("Sadaqat recovers locally owned records when the cookie list is empty", async ({
  page,
}) => {
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
      body: JSON.stringify({ deceased: [], ownedSlugs: [] }),
    }),
  );

  await page.route("**/api/sadaqa-garya/example", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        deceased: {
          id: "example-id",
          slug: "example",
          nameEn: "Test Person",
          nameAr: "شخص تجريبي",
          messageEn: "A test memorial.",
          messageAr: "صفحة تجريبية.",
          createdAt: new Date().toISOString(),
        },
      }),
    }),
  );

  await page.goto("/ar/sadaqat", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("شخص تجريبي")).toBeVisible();
});

test("Sadaqat shows the empty state only after a successful empty response", async ({
  page,
}) => {
  await page.route("**/api/sadaqa-garya", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ deceased: [], ownedSlugs: [] }),
    }),
  );

  await page.goto("/ar/sadaqat", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("ليس لديك أي صدقات جارية حتى الآن.")).toBeVisible();
  await expect(page.getByText("تعذر تحميل صدقاتك")).toHaveCount(0);
});
