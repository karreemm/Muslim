import { fetchBlob, fetchJson } from "@/lib/http";
import { logger } from "@/lib/logger";

export interface Ayah {
  number: number;
  audio: string;
  text?: string;
}

export interface Surah {
  number: number;
  name?: string;
  englishName: string;
  arabicName?: string;
  reciterId?: string | number;
  ayahs: Ayah[];
}

export const fetchSurahByNumber = async (
  surahNumber: number,
  reciterId: string,
): Promise<Surah | null> => {
  try {
    const response = await fetchJson<{ data: Surah }>(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`,
    );

    return response.data ?? null;
  } catch (error) {
    logger.error("Error fetching surah:", error);
    return null;
  }
};

export const fetchAyahAudio = async (
  surahNumber: number,
  ayahNumber: number,
  reciterId: string,
): Promise<Blob | null> => {
  try {
    return await fetchBlob(
      `/api/proxy?surahNumber=${surahNumber}&ayahNumber=${ayahNumber}&reciterId=${reciterId}`,
    );
  } catch (error) {
    logger.error(`Error fetching audio for ayah ${ayahNumber}:`, error);
    return null;
  }
};
