// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { HttpError, fetchArrayBuffer, fetchJson } from "@/lib/http";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchJson", () => {
  it("returns parsed JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));

    await expect(fetchJson<{ ok: boolean }>("https://example.com")).resolves.toEqual({
      ok: true,
    });
  });

  it("throws HttpError for non-ok responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("upstream failed", {
          status: 503,
          statusText: "Service Unavailable",
        }),
      ),
    );

    await expect(fetchJson("https://example.com")).rejects.toMatchObject({
      name: "HttpError",
      status: 503,
      body: "upstream failed",
    });
  });

  it("exposes a typed HttpError", async () => {
    const error = new HttpError(404, "Not Found", "missing");
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
    expect(error.body).toBe("missing");
  });
});

describe("fetchArrayBuffer", () => {
  it("returns the response body as an ArrayBuffer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]))),
    );

    const buffer = await fetchArrayBuffer("https://example.com/audio.mp3");
    expect(Array.from(new Uint8Array(buffer))).toEqual([1, 2, 3]);
  });
});
