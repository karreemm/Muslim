import { useFavoriteSurahs } from "../../context/favourites/FavoriteSurahsContext";

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
  reciterNameAr: string,
) {
  const { favoriteSurahs, addFavoriteSurah, removeFavoriteSurah } = useFavoriteSurahs();

  const isFavorite = favoriteSurahs.some(
    (surah) => surah.number === surahNumber && surah.reciterId === reciterId,
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteSurah(surahNumber, reciterId);
    } else {
      const newFavorite: FavoriteSurah = {
        number: surahNumber,
        nameEn: surahNameEn,
        nameAr: surahNameAr,
        reciterId: reciterId,
        reciterNameEn: reciterNameEn,
        reciterNameAr: reciterNameAr,
      };
      addFavoriteSurah(newFavorite);
    }

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
