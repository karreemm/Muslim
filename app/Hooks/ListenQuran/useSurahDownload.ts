import { useState } from "react";
import {
  fetchAyahAudio,
  Surah,
} from "../../(Pages)/ListenQuran/Service/GetSurah";

export function useSurahDownload(
  surah: Surah | null,
  surahNumber: number,
  reciterId: string
) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const downloadSurah = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!surah) {
      return { success: false, error: "No surah data available" };
    }

    try {
      setIsDownloading(true);
      console.log("Downloading Surah:", surah.name);
      console.log("surahNumber:", surahNumber);
      console.log("reciterId:", reciterId);

      const audioBlobs = await Promise.all(
        surah.ayahs.map(async (ayah) => {
          try {
            console.log("surahNumber:", surahNumber);
            console.log("reciterId:", reciterId);
            console.log("ayahNumber:", ayah.number);
            return await fetchAyahAudio(surahNumber, ayah.number, reciterId);
          } catch (error) {
            console.error(
              `Error fetching audio for ayah ${ayah.number}:`,
              error
            );
            return null;
          }
        })
      );

      const validBlobs = audioBlobs.filter((blob) => blob !== null);

      if (validBlobs.length === 0) {
        throw new Error("Failed to fetch audio for all Ayahs.");
      }

      const combinedBlob = new Blob(validBlobs, { type: "audio/mpeg" });
      const downloadUrl = URL.createObjectURL(combinedBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${surah.name || `Surah-${surahNumber}`}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      console.error("Error downloading Surah:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadSurah,
    isDownloading,
  };
}
