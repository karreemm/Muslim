import { useState, useEffect } from "react";
import { getMultipleHadiths } from "../../(Pages)/ReadHadith/Service/GetHadith";
import { useFavoriteHadiths } from "../../Context/FavoriteHadithsContext";
import { hadithBooks } from "../../Contants/HadithData";

export interface HadithData {
  numberAr: string;
  numberEn: number;
  arabic: string;
}

export interface UseMultipleHadithsReturn {
  hadiths: HadithData[];
  loading: boolean;
  bookNameEn: string;
  bookNameAr: string;
  handleLoveClick: (hadith: HadithData) => void;
  isFavorite: (numberEn: number) => boolean;
}

export const useMultipleHadiths = (
  startingNumber: number,
  bookId: string
): UseMultipleHadithsReturn => {
  const [hadiths, setHadiths] = useState<HadithData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookNameEn, setBookNameEn] = useState<string>("");
  const [bookNameAr, setBookNameAr] = useState<string>("");

  const { favoriteHadiths, addFavoriteHadith, removeFavoriteHadith } =
    useFavoriteHadiths();

  useEffect(() => {
    const book = hadithBooks.find((b) => b.id === bookId);
    if (book) {
      setBookNameEn(book.name_en);
      setBookNameAr(book.name_ar);
    }
  }, [bookId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const hadiths = await getMultipleHadiths(bookId, startingNumber);
        setHadiths(hadiths);
        console.log(hadiths);
      } catch (error) {
        console.error("Error fetching hadiths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startingNumber, bookId]);

  const handleLoveClick = (hadith: HadithData) => {
    const isFav = favoriteHadiths.some(
      (fav) => fav.numberEn === hadith.numberEn && fav.bookId === bookId
    );
    if (isFav) {
      removeFavoriteHadith(hadith.numberEn, bookId);
    } else {
      addFavoriteHadith({
        text: hadith.arabic,
        nameAr: bookNameAr,
        nameEn: bookNameEn,
        numberAr: hadith.numberAr,
        numberEn: hadith.numberEn,
        bookId: bookId,
      });
    }
  };

  const isFavorite = (numberEn: number) => {
    return favoriteHadiths.some(
      (fav) => fav.numberEn === numberEn && fav.bookId === bookId
    );
  };

  return {
    hadiths,
    loading,
    bookNameEn,
    bookNameAr,
    handleLoveClick,
    isFavorite,
  };
};