import { useLanguage } from "@/app/Context/LanguageContext";
import { useEffect, useState } from "react";
import { fetchAzkarItem, AzkarItem } from "./GetAzkar";
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as notLoved } from '@fortawesome/free-regular-svg-icons';
import { faHeart as loved } from '@fortawesome/free-solid-svg-icons';
import { useFavoriteAzkar } from "@/app/Context/FavoriteAzkarContext";
import TranslationPair from "@/app/Lib/Types";
import "../../../globals.css";
import { AzkarCategories } from "@/app/Lib/Constants";

export default function SingleZekr({ zekrNumber, categoryId }: { zekrNumber: number, categoryId: string }) {
  const { language } = useLanguage();
  const [zekr, setZekr] = useState<AzkarItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [categoryNameEn, setCategoryNameEn] = useState<string>("");
  const [categoryNameAr, setCategoryNameAr] = useState<string>("");

  const { favoriteAzkar, addFavoriteAzkar, removeFavoriteAzkar } = useFavoriteAzkar();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const category = AzkarCategories.find(b => b.id === categoryId);
    if (category) {
      setCategoryNameEn(category.en);
      setCategoryNameAr(category.ar);
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedZekr = await fetchAzkarItem(categoryId, zekrNumber);
        setZekr(fetchedZekr);
        console.log(fetchedZekr);
      } catch (error) {
        console.error('Error fetching Zekr:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [zekrNumber, categoryId]);

  useEffect(() => {
    if (zekr) {
      const isFav = favoriteAzkar.some(fav => fav.number === zekr.number && fav.categoryId === categoryId);
      setIsFavorite(isFav);
    }
  }, [zekr, favoriteAzkar, categoryId]);

  const handleLoveClick = () => {
    if (zekr) {
      const isFav = favoriteAzkar.some(fav => fav.number === zekr.number && fav.categoryId === categoryId);
      if (isFav) {
        removeFavoriteAzkar(zekr.number!, categoryId);
      } else {
        addFavoriteAzkar({
          ...zekr,
          categoryId: categoryId
        });
      }
      setIsFavorite(!isFav);
    }
  };

  const ZekrNumber: TranslationPair = {
    ar: "ذكر رقم",
    en: "Zekr Number"
  };

  return (
    <div className="w-full flex justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900">
      <div className="w-[95%] flex flex-col items-center gap-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
          </div>
        ) : (
          zekr && (
            <div className="relative bg-white w-full rounded-lg flex flex-col px-4 py-4">
              <button
                id={`love-button-${zekr.number}`}
                onClick={handleLoveClick}
                className={`text-red-500 hover:text-red-600 absolute ${language === "ar" ? `top-4 left-4` : `top-4 right-4`} `}
              >
                <FontAwesomeIcon icon={isFavorite ? loved : notLoved} className={!isFavorite ? 'vibrate text-xl md:text-2xl' : 'text-xl md:text-2xl'} />
              </button>
              <h1 className="text-3xl font-bold text-center flex gap-1">
                {ZekrNumber[language]} {language === 'en' ? zekr.number : zekr.number}
              </h1>
              <p dir="rtl" className="leading-9 mt-5 text-lg text-center">{zekr.content}</p>
              <p className="text-center mt-2">{zekr.description}</p>
            </div>
          )
        )}
        <div className="h-10"></div>
      </div>
    </div>
  );
}