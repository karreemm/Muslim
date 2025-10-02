import { useState } from "react";
import { Surah } from "../../(Pages)/ListenQuran/Service/GetSurah";

export function useSurahDownload(
  surah: Surah | null,
  surahNumber: number,
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

      const audioBlobs = await Promise.all(
        surah.ayahs.map(async (ayah, index) => {
          try {
            console.log(`Fetching ayah ${index + 1} from: ${ayah.audio}`);
            const response = await fetch(`/api/download-audio?url=${encodeURIComponent(ayah.audio)}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.blob();
          } catch (error) {
            console.error(
              `Error fetching audio for ayah ${index + 1}:`,
              error
            );
            return null;
          }
        })
      );

      const validBlobs = audioBlobs.filter((blob) => blob !== null) as Blob[];

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