import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_HOSTS = new Set(["live.mp3quran.net", "qurango.net"]);

function isAllowedRadioUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      ALLOWED_HOSTS.has(url.hostname)
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing radio URL" }, { status: 400 });
  }

  if (!isAllowedRadioUrl(rawUrl)) {
    return NextResponse.json(
      { error: "Radio URL not allowed" },
      { status: 400 },
    );
  }

  try {
    const upstreamHeaders: HeadersInit = {
      Accept: "audio/*, */*;q=0.8",
    };

    const range = request.headers.get("range");
    if (range) {
      upstreamHeaders.Range = range;
    }

    const upstream = await fetch(rawUrl, {
      headers: upstreamHeaders,
      cache: "no-store",
    });

    const headers = new Headers(upstream.headers);
    headers.set("Cache-Control", "no-store");

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    console.error("GET /radio-proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy radio stream" },
      { status: 502 },
    );
  }
}
