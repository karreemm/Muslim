// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { getHadithEnv, getSupabaseEnv } from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSupabaseEnv", () => {
  it("returns validated Supabase config", () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "secret");
    vi.stubEnv("SUPABASE_SADAQA_TABLE", "sadaqa_garya_records");

    expect(getSupabaseEnv()).toEqual({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "secret",
      SUPABASE_SADAQA_TABLE: "sadaqa_garya_records",
    });
  });

  it("defaults the Sadaqa table name", () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "secret");
    vi.stubEnv("SUPABASE_SADAQA_TABLE", "");

    expect(getSupabaseEnv().SUPABASE_SADAQA_TABLE).toBe("sadaqa_garya_records");
  });

  it("throws when required values are missing", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    expect(() => getSupabaseEnv()).toThrow();
  });
});

describe("getHadithEnv", () => {
  it("returns validated Hadith config", () => {
    vi.stubEnv("HADITH_API_KEY", "key");
    vi.stubEnv("HADITH_API_BASE_URL", "https://hadithapi.com/api");

    expect(getHadithEnv()).toEqual({
      HADITH_API_KEY: "key",
      HADITH_API_BASE_URL: "https://hadithapi.com/api",
    });
  });

  it("defaults the base URL", () => {
    vi.stubEnv("HADITH_API_KEY", "key");
    vi.stubEnv("HADITH_API_BASE_URL", "");

    expect(getHadithEnv().HADITH_API_BASE_URL).toBe("https://hadithapi.com/api");
  });

  it("throws when the API key is missing", () => {
    vi.stubEnv("HADITH_API_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_HADITH_API_KEY", "");

    expect(() => getHadithEnv()).toThrow();
  });
});
