// @vitest-environment node

import { describe, expect, it } from "vitest";
import { getClientIp, isRateLimited } from "@/lib/apiSecurity";

describe("getClientIp", () => {
  it("uses the first x-forwarded-for address", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.10, 198.51.100.4" },
    });

    expect(getClientIp(request)).toBe("203.0.113.10");
  });

  it("falls back to x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "203.0.113.20" },
    });

    expect(getClientIp(request)).toBe("203.0.113.20");
  });

  it("returns unknown when no IP header exists", () => {
    const request = new Request("http://localhost");
    expect(getClientIp(request)).toBe("unknown");
  });
});

describe("isRateLimited", () => {
  it("allows requests up to the limit and then blocks", () => {
    const key = `test:${Date.now()}:${Math.random()}`;

    const first = isRateLimited(key, 2, 60_000);
    const second = isRateLimited(key, 2, 60_000);
    const third = isRateLimited(key, 2, 60_000);

    expect(first).toMatchObject({ limited: false, remaining: 1 });
    expect(second).toMatchObject({ limited: false, remaining: 0 });
    expect(third.limited).toBe(true);
    expect(third.remaining).toBe(0);
    expect(third.retryAfterSec).toBeGreaterThan(0);
  });

  it("resets after the window expires", () => {
    const key = `test-window:${Date.now()}:${Math.random()}`;

    expect(isRateLimited(key, 1, 1).limited).toBe(false);
    expect(isRateLimited(key, 1, 1).limited).toBe(true);
  });
});
