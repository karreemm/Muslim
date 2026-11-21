import { expect, test } from "@playwright/test";

test("security headers are applied to pages and APIs", async ({ request }) => {
  for (const path of ["/en", "/ar", "/api/search-quran?q=ab"]) {
    const response = await request.get(path);
    const headers = response.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=63072000");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["permissions-policy"]).toContain("clipboard-write=(self)");

    const csp = headers["content-security-policy-report-only"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("report-uri /api/csp-report");
    expect(csp).toContain("https://api.quran.com");
    expect(csp).toContain("https://cdn.islamic.network");
  }
});

test("CSP report endpoint accepts classic and Reporting API payloads", async ({
  request,
}) => {
  const classic = await request.post("/api/csp-report", {
    headers: { "content-type": "application/csp-report" },
    data: {
      "csp-report": {
        "document-uri": "https://example.test/en",
        "violated-directive": "script-src",
        "blocked-uri": "https://evil.example/script.js",
        "line-number": 12,
      },
    },
  });
  expect(classic.status()).toBe(204);

  const reporting = await request.post("/api/csp-report", {
    headers: { "content-type": "application/reports+json" },
    data: [
      {
        type: "csp-violation",
        body: {
          documentURL: "https://example.test/en",
          effectiveDirective: "connect-src",
          blockedURL: "https://evil.example/api",
          lineNumber: 4,
        },
      },
    ],
  });
  expect(reporting.status()).toBe(204);
});

test("CSP report endpoint rejects oversized or malformed reports", async ({
  request,
}) => {
  const oversized = await request.post("/api/csp-report", {
    headers: { "content-type": "application/csp-report" },
    data: "x".repeat(20_000),
  });
  expect(oversized.status()).toBe(413);

  const wrongType = await request.post("/api/csp-report", {
    headers: { "content-type": "text/plain" },
    data: "not a report",
  });
  expect(wrongType.status()).toBe(415);

  const malformed = await request.post("/api/csp-report", {
    headers: { "content-type": "application/json" },
    data: Buffer.from("{not-json", "utf8"),
  });
  expect(malformed.status()).toBe(400);
});

test("proxy and search inputs are validated", async ({ request }) => {
  const badReciter = await request.get(
    "/api/proxy?reciterId=bad&surahNumber=1&ayahNumber=1",
  );
  expect(badReciter.status()).toBe(400);

  const badSurah = await request.get(
    "/api/proxy?reciterId=ar.alafasy&surahNumber=999&ayahNumber=1",
  );
  expect(badSurah.status()).toBe(400);

  const radio = await request.get("/api/radio-proxy?url=http://evil.example/stream");
  expect(radio.status()).toBe(400);

  const tafseer = await request.get("/api/tafseer?tafseerId=bad");
  expect(tafseer.status()).toBe(400);

  const cappedSearch = await request.get(
    "/api/search-quran?q=%D8%A7%D9%84%D9%84%D9%87&limit=99999&page=99999",
  );
  expect(cappedSearch.status()).toBeLessThan(500);
});
