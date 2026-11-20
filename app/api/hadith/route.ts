import { NextResponse } from "next/server";
import { getHadithEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { HADITH_API_BASE_URL: baseUrl, HADITH_API_KEY: apiKey } = getHadithEnv();

    const { searchParams } = new URL(req.url);
    const mode = (searchParams.get("mode") || "").trim();

    if (!mode) {
      return NextResponse.json({ error: "mode is required" }, { status: 400 });
    }

    let endpoint = "";
    const upstreamParams = new URLSearchParams();
    upstreamParams.set("apiKey", apiKey);

    if (mode === "books") {
      endpoint = "/books";
    } else if (mode === "chapters") {
      const bookSlug = (searchParams.get("bookSlug") || "").trim();
      if (!bookSlug) {
        return NextResponse.json({ error: "bookSlug is required" }, { status: 400 });
      }

      endpoint = `/${encodeURIComponent(bookSlug)}/chapters`;
      const paginate = searchParams.get("paginate");
      const page = searchParams.get("page");

      if (paginate && !/^\d+$/.test(paginate)) {
        return NextResponse.json({ error: "Invalid pagination value" }, { status: 400 });
      }
      if (page && !/^\d+$/.test(page)) {
        return NextResponse.json({ error: "Invalid page value" }, { status: 400 });
      }

      if (paginate) upstreamParams.set("paginate", paginate);
      if (page) upstreamParams.set("page", page);
    } else if (mode === "hadiths") {
      endpoint = "/hadiths";

      const allowedKeys = [
        "hadithEnglish",
        "hadithUrdu",
        "hadithArabic",
        "hadithNumber",
        "book",
        "chapter",
        "status",
        "paginate",
        "page",
      ];

      allowedKeys.forEach((key) => {
        const value = searchParams.get(key);
        if (value !== null && value !== "") {
          upstreamParams.set(key, value);
        }
      });
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const targetUrl = `${normalizedBase}${endpoint}?${upstreamParams.toString()}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      cache: "force-cache",
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      logger.error("Hadith upstream request failed:", {
        status: response.status,
        body: data,
      });

      return NextResponse.json({ error: "Failed to fetch hadith data" }, { status: 502 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    logger.error("GET /api/hadith failed:", error);
    return NextResponse.json({ error: "Failed to fetch hadith data" }, { status: 500 });
  }
}
