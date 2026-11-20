import { expect, test } from "@playwright/test";

type PerfMetrics = {
  lcp: number;
  cls: number;
  transferBytes: number;
  scriptBytes: number;
  imageBytes: number;
};

declare global {
  interface Window {
    __perfBudget?: { lcp: number; cls: number };
  }
}

const pages = ["/en", "/ar", "/en/read-quran", "/en/tasbeeh"];

for (const path of pages) {
  test(`${path} stays within the Web Vitals budget`, async ({ page }) => {
    await page.addInitScript(() => {
      window.__perfBudget = { lcp: 0, cls: 0 };

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__perfBudget!.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };
          if (!shift.hadRecentInput && shift.value) {
            window.__perfBudget!.cls += shift.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2_500);

    const metrics = await page.evaluate((): PerfMetrics => {
      const resources = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];

      return {
        lcp: window.__perfBudget?.lcp ?? 0,
        cls: window.__perfBudget?.cls ?? 0,
        transferBytes: resources.reduce(
          (sum, entry) => sum + (entry.transferSize || 0),
          0,
        ),
        scriptBytes: resources
          .filter((entry) => entry.initiatorType === "script")
          .reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
        imageBytes: resources
          .filter((entry) => entry.initiatorType === "img")
          .reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      };
    });

    expect(metrics.lcp, `LCP ${metrics.lcp}ms on ${path}`).toBeLessThan(4_000);
    expect(metrics.cls, `CLS ${metrics.cls} on ${path}`).toBeLessThan(0.15);
    expect(
      metrics.transferBytes,
      `transfer ${metrics.transferBytes} bytes on ${path}`,
    ).toBeLessThan(4 * 1024 * 1024);
  });
}
