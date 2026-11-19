// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  formatGregorianDate,
  formatHijriDate,
  formatTime12h,
} from "@/lib/dateFormatting";

describe("formatGregorianDate", () => {
  it("formats English and Arabic Gregorian dates", () => {
    expect(formatGregorianDate("01-01-2024", "en")).toBe("1 January, 2024");
    expect(formatGregorianDate("01-01-2024", "ar")).toBe("١ يناير، ٢٠٢٤");
  });

  it("returns the original value for an invalid date", () => {
    expect(formatGregorianDate("bad-date", "en")).toBe("bad-date");
    expect(formatGregorianDate("31-02-2024", "en")).toBe("31-02-2024");
  });
});

describe("formatHijriDate", () => {
  it("formats English and Arabic Hijri dates", () => {
    expect(formatHijriDate("01-01-2024", "en")).toBe("19 Jumada al-thani, 1445");
    expect(formatHijriDate("01-01-2024", "ar")).toBe("١٩ جمادى الآخرة، ١٤٤٥");
    expect(formatHijriDate("11-03-2024", "en")).toBe("1 Ramadan, 1445");
    expect(formatHijriDate("11-03-2024", "ar")).toBe("١ رمضان، ١٤٤٥");
    expect(formatHijriDate("26-06-2025", "en")).toBe("1 Muharram, 1447");
  });
});

describe("formatTime12h", () => {
  it("formats prayer times with a 12-hour clock", () => {
    expect(formatTime12h("05:03")).toBe("5:03 AM");
    expect(formatTime12h("17:45")).toBe("5:45 PM");
    expect(formatTime12h("00:00")).toBe("12:00 AM");
    expect(formatTime12h("12:00")).toBe("12:00 PM");
  });

  it("returns the original value for invalid input", () => {
    expect(formatTime12h("nope")).toBe("nope");
  });
});
