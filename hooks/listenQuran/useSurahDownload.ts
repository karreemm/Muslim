import { useState } from "react";
import { Surah } from "../../app/(pages)/listen-quran/service/GetSurah";

type Progress = "idle" | "registering" | "downloading" | "error";

export function useSurahDownload(surah: Surah | null, surahNumber: number) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<Progress>("idle");

  const downloadSurah = async (): Promise<{ success: boolean; error?: string }> => {
    if (!surah) return { success: false, error: "No surah data available" };

    setIsDownloading(true);
    setProgress("downloading");

    try {
      const iframe = document.createElement("iframe");
      iframe.name = "surah-download-iframe";
      iframe.style.cssText = "display:none;width:0;height:0;border:0;position:absolute;";
      document.body.appendChild(iframe);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/download-audio";
      form.target = "surah-download-iframe";

      const urlsInput = document.createElement("input");
      urlsInput.type = "hidden";
      urlsInput.name = "urls";
      urlsInput.value = JSON.stringify(surah.ayahs.map((a) => a.audio));
      form.appendChild(urlsInput);

      const nameInput = document.createElement("input");
      nameInput.type = "hidden";
      nameInput.name = "fileName";
      nameInput.value = surah.name ?? `Surah-${surahNumber}`;
      form.appendChild(nameInput);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10_000);

      return { success: true };
    } catch (error) {
      console.error("useSurahDownload error:", error);
      setProgress("error");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setProgress("idle");
      }, 2_000);
    }
  };

  return { downloadSurah, isDownloading, progress };
}