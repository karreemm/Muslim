import axios from "axios";
import { NextResponse } from "next/server";

const cumulativeAyahCounts = [
  0, 7, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750, 1802,
  1901, 2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159, 3252,
  3340, 3409, 3469, 3503, 3533, 3606, 3660, 3705, 3788, 3970, 4058, 4133, 4272,
  4325, 4414, 4473, 4510, 4545, 4583, 4612, 4630, 4675, 4735, 4784, 4846, 4901,
  4979, 5075, 5104, 5126, 5150, 5163, 5177, 5188, 5199, 5217, 5229, 5241, 5271,
  5323, 5375, 5419, 5447, 5475, 5495, 5551, 5591, 5622, 5672, 5712, 5758, 5800,
  5829, 5848, 5867, 5897, 5922, 5948, 5965, 5983, 6001, 6013, 6027, 6041, 6054,
  6060, 6079, 6087, 6105, 6111, 6121, 6130, 6138, 6146, 6157, 6168, 6176, 6185,
  6193, 6197, 6204, 6211, 6216, 6220, 6225, 6230,
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reciterId = searchParams.get("reciterId");
  const surahNumber = searchParams.get("surahNumber");
  const ayahNumber = searchParams.get("ayahNumber");

  try {
    let absoluteAyahNumber;

    if (surahNumber && ayahNumber) {
      const surahIndex = parseInt(surahNumber) - 1; 
      const relativeAyahNumber = parseInt(ayahNumber);

      if (surahIndex < 0 || surahIndex >= cumulativeAyahCounts.length) {
        throw new Error(`Invalid surah number: ${surahNumber}`);
      }

      absoluteAyahNumber =
        cumulativeAyahCounts[surahIndex] + relativeAyahNumber;

    } else if (ayahNumber && !surahNumber) {
      absoluteAyahNumber = parseInt(ayahNumber);
    } else {
      const errorMsg =
        "Either provide both surahNumber and ayahNumber, or just ayahNumber (absolute)";
      throw new Error(errorMsg);
    }

    const url = `https://cdn.islamic.network/quran/audio/192/${reciterId}/${absoluteAyahNumber}.mp3`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    const headers = new Headers();
    headers.set("Content-Type", "audio/mpeg");

    return new NextResponse(response.data, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error(`Error fetching audio:`, error);
    return new NextResponse(`Error fetching the audio: ${error}`, {
      status: 500,
    });
  }
}
