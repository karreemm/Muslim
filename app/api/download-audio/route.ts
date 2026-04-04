import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, "-").trim() || "surah";
}

function toAsciiFileName(name: string): string {
  const ascii = name
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return ascii || "surah";
}

function encodeRfc5987Value(value: string): string {
  return encodeURIComponent(value)
    .replace(/['()]/g, escape)
    .replace(/\*/g, "%2A");
}

function isAllowedAudioUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false;
    }

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

async function fetchAudioChunk(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch audio chunk: ${response.status}`);
  }
  return response.arrayBuffer();
}

async function fetchChunksInBatches(
  urls: string[],
  batchSize: number,
): Promise<{ chunks: ArrayBuffer[]; failedCount: number }> {
  const chunks: ArrayBuffer[] = [];
  let failedCount = 0;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((url) => fetchAudioChunk(url)),
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        chunks.push(result.value);
      } else {
        failedCount += 1;
      }
    });
  }

  return { chunks, failedCount };
}

function downloadHeaders(fileName: string): Headers {
  const headers = new Headers();
  const asciiFileName = toAsciiFileName(fileName);
  const encodedUtf8Name = encodeRfc5987Value(fileName);

  headers.set("Content-Type", "audio/mpeg");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${asciiFileName}.mp3"; filename*=UTF-8''${encodedUtf8Name}.mp3`,
  );
  headers.set("Cache-Control", "no-store");
  return headers;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const audioUrl = (searchParams.get("url") || "").trim();
  const fileName = sanitizeFileName(searchParams.get("filename") || "ayah");

  if (!audioUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  if (!isAllowedAudioUrl(audioUrl)) {
    return NextResponse.json(
      { error: "Audio URL is not allowed" },
      { status: 400 },
    );
  }

  try {
    const chunk = await fetchAudioChunk(audioUrl);
    return new NextResponse(chunk, {
      status: 200,
      headers: downloadHeaders(fileName),
    });
  } catch (error) {
    console.error("Error fetching audio:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      urls?: string[];
      fileName?: string;
    };

    const urls = Array.isArray(body.urls) ? body.urls.filter(Boolean) : [];
    const fileName = sanitizeFileName(body.fileName || "surah");

    if (urls.length === 0) {
      return NextResponse.json(
        { error: "No audio URLs provided" },
        { status: 400 },
      );
    }

    if (urls.some((url) => !isAllowedAudioUrl(url))) {
      return NextResponse.json(
        { error: "One or more audio URLs are not allowed" },
        { status: 400 },
      );
    }

    const { chunks, failedCount } = await fetchChunksInBatches(urls, 12);

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch any audio chunks for this surah" },
        { status: 502 },
      );
    }

    const merged = new Blob(
      chunks.map((chunk) => new Uint8Array(chunk)),
      {
        type: "audio/mpeg",
      },
    );

    const response = new NextResponse(merged, {
      status: 200,
      headers: downloadHeaders(fileName),
    });

    if (failedCount > 0) {
      response.headers.set("X-Audio-Chunks-Failed", String(failedCount));
    }

    return response;
  } catch (error) {
    console.error("Error creating combined audio download:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to prepare download",
      },
      { status: 500 },
    );
  }
}
