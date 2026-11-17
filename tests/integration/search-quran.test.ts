// @vitest-environment node

import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/search-quran/route";

function request(query: string): Request {
  return new Request(`http://localhost/api/search-quran?${query}`);
}

describe("GET /api/search-quran", () => {
  it("rejects an empty query", async () => {
    const response = await GET(request(""));
    expect(response.status).toBe(400);
  });

  it("rejects a query shorter than two letters", async () => {
    const response = await GET(request("q=%D8%A7"));
    expect(response.status).toBe(400);
  });

  it("returns matches for a known Arabic word", async () => {
    const response = await GET(request("q=%D8%A7%D9%84%D9%84%D9%87&limit=5"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.count).toBeGreaterThan(0);
    expect(payload.matches.length).toBeLessThanOrEqual(5);
    expect(payload.totalPages).toBeGreaterThanOrEqual(1);
  });

  it("returns 404 when nothing matches", async () => {
    const response = await GET(request("q=zzzzzzzz&limit=5"));
    expect(response.status).toBe(404);
  });
});
