// @vitest-environment node

import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/download-audio/route";

function post(formData: FormData): Request {
  return new Request("http://localhost/api/download-audio", {
    method: "POST",
    body: formData,
  });
}

describe("POST /api/download-audio", () => {
  it("rejects a request with no URLs", async () => {
    const response = await POST(post(new FormData()));
    expect(response.status).toBe(400);
  });

  it("rejects an empty URL list", async () => {
    const formData = new FormData();
    formData.set("urls", "[]");

    const response = await POST(post(formData));
    expect(response.status).toBe(400);
  });

  it("rejects URLs outside the allowlist", async () => {
    const formData = new FormData();
    formData.set("urls", JSON.stringify(["https://evil.example/audio.mp3"]));

    const response = await POST(post(formData));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/not allowed/i);
  });

  it("rejects malformed JSON", async () => {
    const formData = new FormData();
    formData.set("urls", "not-json");

    const response = await POST(post(formData));
    expect(response.status).toBe(500);
  });
});
