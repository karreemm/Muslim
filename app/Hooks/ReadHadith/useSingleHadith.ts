import { useState, useEffect } from "react";
import { getHadith } from "../../(Pages)/ReadHadith/Service/GetHadith";
import { useFavoriteHadiths } from "../../Context/FavoriteHadithsContext";
import { hadithBooks } from "../../Contants/HadithData";

export interface HadithData {
  numberAr: string;
  numberEn: number;
  arabic: string;
}

export interface UseSingleHadithReturn {
  hadith: HadithData | null;
  loading: boolean;
  bookNameEn: string;
  bookNameAr: string;
  isFavorite: boolean;
  handleLoveClick: () => void;
}

export const useSingleHadith = (
  hadithNumber: number,
  bookId: string
): UseSingleHadithReturn => {
  const [hadith, setHadith] = useState<HadithData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookNameEn, setBookNameEn] = useState<string>("");
  const [bookNameAr, setBookNameAr] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

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
        const fetchedHadith = await getHadith(bookId, hadithNumber);
        setHadith(fetchedHadith);
        console.log(fetchedHadith);
      } catch (error) {
        console.error("Error fetching hadith:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hadithNumber, bookId]);

  useEffect(() => {
    if (hadith) {
      const isFav = favoriteHadiths.some(
        (fav) => fav.numberEn === hadith.numberEn && fav.bookId === bookId
      );
      setIsFavorite(isFav);
    }
  }, [hadith, favoriteHadiths, bookId]);

  const handleLoveClick = () => {
    if (hadith) {
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
      setIsFavorite(!isFav);
    }
  };

  return {
    hadith,
    loading,
    bookNameEn,
    bookNameAr,
    isFavorite,
    handleLoveClick,
  };
};