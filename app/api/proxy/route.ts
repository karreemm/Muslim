import { NextResponse } from "next/server";
import { reciters } from "@/constants/recitersData";
import { logger } from "@/lib/logger";

const cumulativeAyahCounts = [
  0, 7, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750, 1802, 1901,
  2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159, 3252, 3340, 3409,
  3469, 3503, 3533, 3606, 3660, 3705, 3788, 3970, 4058, 4133, 4272, 4325, 4414, 4473,
  4510, 4545, 4583, 4612, 4630, 4675, 4735, 4784, 4846, 4901, 4979, 5075, 5104, 5126,
  5150, 5163, 5177, 5188, 5199, 5217, 5229, 5241, 5271, 5323, 5375, 5419, 5447, 5475,
  5495, 5551, 5591, 5622, 5672, 5712, 5758, 5800, 5829, 5848, 5867, 5897, 5922, 5948,
  5965, 5983, 6001, 6013, 6027, 6041, 6054, 6060, 6079, 6087, 6105, 6111, 6121, 6130,
  6138, 6146, 6157, 6168, 6176, 6185, 6193, 6197, 6204, 6211, 6216, 6220, 6225, 6230,
];

const allowedReciters = new Set(reciters.map((reciter) => reciter.id));

function invalidRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reciterId = (searchParams.get("reciterId") || "").trim();
  const rawSurahNumber = searchParams.get("surahNumber");
  const rawAyahNumber = searchParams.get("ayahNumber");

  if (!allowedReciters.has(reciterId)) {
    return invalidRequest("Invalid reciter");
  }

  const ayahNumber = rawAyahNumber ? Number.parseInt(rawAyahNumber, 10) : NaN;
  if (!Number.isInteger(ayahNumber) || ayahNumber < 1) {
    return invalidRequest("Invalid ayah number");
  }

  let absoluteAyahNumber: number;

  if (rawSurahNumber) {
    const surahNumber = Number.parseInt(rawSurahNumber, 10);
    if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return invalidRequest("Invalid surah number");
    }

    const surahIndex = surahNumber - 1;
    const ayahCount =
      cumulativeAyahCounts[surahIndex + 1] - cumulativeAyahCounts[surahIndex];

    if (ayahNumber > ayahCount) {
      return invalidRequest("Invalid ayah number for this surah");
    }

    absoluteAyahNumber = cumulativeAyahCounts[surahIndex] + ayahNumber;
  } else {
    absoluteAyahNumber = ayahNumber;
  }

  if (absoluteAyahNumber < 1 || absoluteAyahNumber > 6236) {
    return invalidRequest("Invalid ayah number");
  }

  try {
    const url = `https://cdn.islamic.network/quran/audio/192/${encodeURIComponent(
      reciterId,
    )}/${absoluteAyahNumber}.mp3`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      logger.error("Audio upstream request failed:", response.status);
      return NextResponse.json(
        { error: "Audio is temporarily unavailable" },
        { status: 502 },
      );
    }

    const audio = await response.arrayBuffer();

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    logger.error("Error fetching audio:", error);
    return NextResponse.json({ error: "Failed to fetch audio" }, { status: 500 });
  }
}
