import { useEffect, useState } from "react";
import { useFavoriteSurahs } from "../../Context/FavoriteSurahsContext";

export interface FavoriteSurah {
  number: number;
  nameEn: string | null;
  nameAr: string | null;
  reciterId: string;
  reciterNameEn: string;
  reciterNameAr: string;
}

export function useFavoriteSurahActions(
  surahNumber: number,
  reciterId: string,
  surahNameEn: string | null,
  surahNameAr: string | null,
  reciterNameEn: string,
  reciterNameAr: string
) {
  const { favoriteSurahs, addFavoriteSurah, removeFavoriteSurah } =
    useFavoriteSurahs();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favoriteSurahs") || "[]"
      );
      const isFav = storedFavorites.some(
        (surah: FavoriteSurah) =>
          surah.number === surahNumber && surah.reciterId === reciterId
      );
      setIsFavorite(isFav);
    }
  }, [surahNumber, reciterId]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteSurah(surahNumber, reciterId);
      console.log("Removing favorite:", surahNumber);
    } else {
      const newFavorite: FavoriteSurah = {
        number: surahNumber,
        nameEn: surahNameEn,
        nameAr: surahNameAr,
        reciterId: reciterId,
        reciterNameEn: reciterNameEn,
        reciterNameAr: reciterNameAr,
      };
      console.log("Adding favorite:", newFavorite);
      addFavoriteSurah(newFavorite);
    }
    setIsFavorite(!isFavorite);

    const button = document.getElementById(`love-button-${surahNumber}`);
    if (button) {
      button.classList.add("heart-beat");
      setTimeout(() => {
        button.classList.remove("heart-beat");
      }, 800);
    }
  };

  return {
    isFavorite,
    toggleFavorite,
  };
}
