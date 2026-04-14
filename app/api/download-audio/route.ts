import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, "-").trim() || "surah";
}

function toAsciiFileName(name: string): string {
  return (
    name.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/\s+/g, " ").trim() || "surah"
  );
}

function encodeRfc5987Value(value: string): string {
  return encodeURIComponent(value).replace(/['()]/g, escape).replace(/\*/g, "%2A");
}

function isAllowedAudioUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const allowedHosts = new Set([
      "cdn.islamic.network",
      "server8.mp3quran.net",
      "download.quranicaudio.com",
    ]);
    return allowedHosts.has(url.hostname);
  } catch {
    return false;
  }
}

function makeDownloadResponse(stream: ReadableStream<Uint8Array>, fileName: string): Response {
  const ascii = toAsciiFileName(fileName);
  const encoded = encodeRfc5987Value(fileName);
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename="${ascii}.mp3"; filename*=UTF-8''${encoded}.mp3`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function buildStream(urls: string[]): ReadableStream<Uint8Array> {
  const BATCH = 12;
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < urls.length; i += BATCH) {
        const batch = urls.slice(i, i + BATCH);
        const results = await Promise.allSettled(
          batch.map((url) =>
            fetch(url, { cache: "no-store" }).then((r) => {
              if (!r.ok) throw new Error(`Upstream ${r.status}`);
              return r.arrayBuffer();
            })
          )
        );
        for (const r of results) {
          if (r.status === "fulfilled") {
            controller.enqueue(new Uint8Array(r.value));
          }
        }
      }
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawUrls = formData.get("urls");
    const rawName = formData.get("fileName");

    if (!rawUrls || typeof rawUrls !== "string") {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    const urls = (JSON.parse(rawUrls) as string[]).filter(Boolean);
    const fileName = sanitizeFileName(typeof rawName === "string" ? rawName : "surah");

    if (urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }
    if (urls.some((u) => !isAllowedAudioUrl(u))) {
      return NextResponse.json({ error: "One or more URLs not allowed" }, { status: 400 });
    }

    return makeDownloadResponse(buildStream(urls), fileName);
  } catch (error) {
    console.error("POST /download-audio error:", error);
    return NextResponse.json({ error: "Failed to start download" }, { status: 500 });
  }
}