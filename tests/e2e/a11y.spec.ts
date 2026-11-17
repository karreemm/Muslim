import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no critical accessibility violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  const critical = results.violations.filter(
    (violation) => violation.impact === "critical",
  );

  expect(
    critical,
    critical.map((violation) => `${violation.id}: ${violation.description}`).join("\n"),
  ).toEqual([]);
});
