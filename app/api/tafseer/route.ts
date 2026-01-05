import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tafseerId = searchParams.get("tafseerId");
  const surahNumber = searchParams.get("surahNumber");
  const ayahNumber = searchParams.get("ayahNumber");

  try {
    let url: string;
    if (!tafseerId && !surahNumber && !ayahNumber) {
      url = "http://api.quran-tafseer.com/tafseer";
    }
    else if (tafseerId && surahNumber && ayahNumber) {
      url = `http://api.quran-tafseer.com/tafseer/${tafseerId}/${surahNumber}/${ayahNumber}`;
    }
    else {
      return NextResponse.json(
        {
          error:
            "Invalid parameters. Provide either no parameters for list, or all three (tafseerId, surahNumber, ayahNumber) for specific tafseer.",
        },
        { status: 400 }
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
    console.error("Error in tafseer proxy:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tafseer data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
