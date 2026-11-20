import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

function parseIntParam(value: string | null, min: number, max: number) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tafseerId = parseIntParam(searchParams.get("tafseerId"), 1, 1000);
  const surahNumber = parseIntParam(searchParams.get("surahNumber"), 1, 114);
  const ayahNumber = parseIntParam(searchParams.get("ayahNumber"), 1, 300);
  const hasAnyParam = ["tafseerId", "surahNumber", "ayahNumber"].some((key) =>
    searchParams.has(key),
  );

  try {
    let url: string;
    if (!hasAnyParam) {
      url = "http://api.quran-tafseer.com/tafseer";
    } else if (tafseerId && surahNumber && ayahNumber) {
      url = `http://api.quran-tafseer.com/tafseer/${tafseerId}/${surahNumber}/${ayahNumber}`;
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid parameters. Provide either no parameters for list, or all three (tafseerId, surahNumber, ayahNumber) for specific tafseer.",
        },
        { status: 400 },
      );
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from tafseer API: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    logger.error("Error in tafseer proxy:", error);
    return NextResponse.json({ error: "Failed to fetch tafseer data" }, { status: 500 });
  }
}
