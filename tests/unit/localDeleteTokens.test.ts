import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  readLocalDeleteTokens,
  writeLocalDeleteTokens,
} from "@/lib/sadaqaGarya/localDeleteTokens";

beforeEach(() => {
  window.localStorage.clear();
});

describe("local Sadaqa delete tokens", () => {
  it("round-trips a token map", () => {
    writeLocalDeleteTokens({ "ahmed-ali": "token-a" });
    expect(readLocalDeleteTokens()).toEqual({ "ahmed-ali": "token-a" });
  });

  it("returns an empty object when missing", () => {
    expect(readLocalDeleteTokens()).toEqual({});
  });

  it("rejects arrays", () => {
    window.localStorage.setItem(STORAGE_KEYS.sadaqaDeleteTokens, "[]");
    expect(readLocalDeleteTokens()).toEqual({});
  });

  it("rejects non-string token values", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.sadaqaDeleteTokens,
      JSON.stringify({ slug: 123 }),
    );
    expect(readLocalDeleteTokens()).toEqual({});
  });
});
