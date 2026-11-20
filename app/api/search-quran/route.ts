import { NextResponse } from "next/server";
import { searchLocalQuran } from "@/utils/searchQuran";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const surah = searchParams.get("surah") || "all";
  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const parsedLimit = Number.parseInt(searchParams.get("limit") || "20", 10);
  const page = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), 1000) : 1;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 100)
    : 20;
  const wholeWord = (searchParams.get("wholeWord") || "true").toLowerCase() !== "false";

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 });
  }

  if (query.length > 200) {
    return NextResponse.json({ error: "Search query is too long" }, { status: 400 });
  }

  if (query.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").trim().length < 2) {
    return NextResponse.json(
      { error: "Search query is too short. Use at least two characters." },
      { status: 400 },
    );
  }

  try {
    const results = searchLocalQuran(query, surah, page, limit, wholeWord);

    if (results.count === 0) {
      return NextResponse.json(results, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (error) {
    logger.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search Quran" }, { status: 500 });
  }
}
