import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getHadithBaseUrl(): string {
  return (
    process.env.HADITH_API_BASE_URL ||
    process.env.NEXT_PUBLIC_HADITH_API_BASE_URL ||
    "https://hadithapi.com/api"
  );
}

function getHadithApiKey(): string {
  const value =
    process.env.HADITH_API_KEY || process.env.NEXT_PUBLIC_HADITH_API_KEY;
  if (!value) {
    throw new Error(
      "HADITH_API_KEY is not configured. Add it to .env.local and restart the dev server.",
    );
  }
  return value;
}

export async function GET(req: Request) {
  try {
    const baseUrl = getHadithBaseUrl();
    const apiKey = getHadithApiKey();

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
        return NextResponse.json(
          { error: "bookSlug is required" },
          { status: 400 },
        );
      }

      endpoint = `/${encodeURIComponent(bookSlug)}/chapters`;
      const paginate = searchParams.get("paginate");
      const page = searchParams.get("page");

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

    const normalizedBase = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
    const targetUrl = `${normalizedBase}${endpoint}?${upstreamParams.toString()}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          {
            error:
              "Hadith API rejected the key (401). Verify HADITH_API_KEY in .env.local and restart the server.",
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { error: data?.message || "Failed to fetch hadith data" },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
