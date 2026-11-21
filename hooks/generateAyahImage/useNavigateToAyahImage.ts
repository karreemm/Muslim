"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useLanguage } from "@/context/general/LanguageContext";
import { localizePath } from "@/lib/i18n";

export function useNavigateToAyahImage() {
  const router = useRouter();
  const { language } = useLanguage();

  const navigateToAyahImage = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      const params = new URLSearchParams();
      params.append("surah", surahNumber.toString());
      params.append("ayah", ayahNumber.toString());
      router.push(localizePath(language, `/generate-ayah-image?${params.toString()}`));
    },
    [router, language],
  );

  return navigateToAyahImage;
}
