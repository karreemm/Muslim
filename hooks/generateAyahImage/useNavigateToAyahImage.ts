"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNavigateToAyahImage() {
  const router = useRouter();

  const navigateToAyahImage = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      const params = new URLSearchParams();
      params.append("surah", surahNumber.toString());
      params.append("ayah", ayahNumber.toString());
      router.push(`/generate-ayah-image?${params.toString()}`);
    },
    [router],
  );

  return navigateToAyahImage;
}
