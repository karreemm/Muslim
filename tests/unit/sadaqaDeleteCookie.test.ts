// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  buildDeleteTokenCookieValue,
  deleteTokenCookieName,
  getDeleteTokenFromRequest,
  readDeleteTokenMapFromRequest,
} from "@/lib/sadaqaGarya/sadaqaDeleteCookie";

function requestWithCookie(value: string): Request {
  return new Request("http://localhost", {
    headers: {
      cookie: `${deleteTokenCookieName()}=${value}`,
    },
  });
}

describe("sadaqa delete-token cookie", () => {
  it("round-trips a token map", () => {
    const tokens = { "ahmed-ali": "token-a", "fatima-youssef": "token-b" };
    const request = requestWithCookie(buildDeleteTokenCookieValue(tokens));

    expect(readDeleteTokenMapFromRequest(request)).toEqual(tokens);
    expect(getDeleteTokenFromRequest(request, "ahmed-ali")).toBe("token-a");
  });

  it("returns an empty map when the cookie is missing", () => {
    expect(readDeleteTokenMapFromRequest(new Request("http://localhost"))).toEqual({});
  });

  it("returns an empty token when the slug is unknown", () => {
    const request = requestWithCookie(buildDeleteTokenCookieValue({ known: "token" }));

    expect(getDeleteTokenFromRequest(request, "unknown")).toBe("");
  });

  it("ignores malformed cookie values", () => {
    const request = requestWithCookie("%E0%A4%A");
    expect(readDeleteTokenMapFromRequest(request)).toEqual({});
  });
});
