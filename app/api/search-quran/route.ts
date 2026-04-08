import { NextResponse } from "next/server";
import { searchLocalQuran } from "@/utils/searchQuran";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const surah = searchParams.get("surah") || "all";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Number.parseInt(searchParams.get("limit") || "20", 10));
  const wholeWord = (searchParams.get("wholeWord") || "true").toLowerCase() !== "false";

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 },
    );
  }

  if (query.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").trim().length < 2) {
    return NextResponse.json(
      { error: "كلمة البحث قصيرة جدًا. يرجى استخدام حرفين على الأقل." },
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
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search Quran" },
      { status: 500 },
    );
  }
}