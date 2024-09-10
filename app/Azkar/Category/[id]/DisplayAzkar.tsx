import { useLanguage } from "@/app/Context/LanguageContext";
import { useEffect, useState } from "react";
import { fetchThreeAzkarItems, AzkarItem } from "./GetAzkar";
import { AzkarCategories } from "@/app/Lib/Constants";
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as notLoved } from '@fortawesome/free-regular-svg-icons';
import { faHeart as loved } from '@fortawesome/free-solid-svg-icons';
import { useFavoriteAzkar } from "@/app/Context/FavoriteAzkarContext";
import ShareButtons from "@/app/Components/ShareButtons";
import useMediaQuery from "@/app/Lib/CustomHooks";
import "../../../globals.css";

export default function AzkarPage({ startingNumber, categoryId }: { startingNumber: number, categoryId: string }) {
    
  const { language } = useLanguage();
  const isMdOrLarger = useMediaQuery('(min-width: 768px)');


  const [azkarItems, setAzkarItems] = useState<AzkarItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [categoryNameEn, setCategoryNameEn] = useState<string>("");
  const [categoryNameAr, setCategoryNameAr] = useState<string>("");

  const { favoriteAzkar, addFavoriteAzkar, removeFavoriteAzkar } = useFavoriteAzkar();

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
        const azkar = await fetchThreeAzkarItems(categoryId, startingNumber);
        setAzkarItems(azkar);
        console.log(azkar);
      } catch (error) {
        console.error('Error fetching Azkar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startingNumber, categoryId]);

  const handleLoveClick = (azkar: AzkarItem) => {
    const isFav = favoriteAzkar.some(fav => fav.number === azkar.number && fav.categoryId === categoryId);
    if (isFav) {
      removeFavoriteAzkar(azkar.number!, categoryId);
    } else {
      addFavoriteAzkar({
        ...azkar,
        categoryId: categoryId
      });
    }
  };

  const isFavorite = (number: number) => {
    return favoriteAzkar.some(fav => fav.number === number && fav.categoryId === categoryId);
  };

  return (
    <div className="w-full flex justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900">
      <div className="w-[95%] flex flex-col items-center gap-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
          </div>
        ) : (
          azkarItems && azkarItems.map((azkar, index) => {
            const zekr = AzkarCategories.find(b => b.ar === azkar.category);
            return(
            <div key={index} className="relative bg-white w-full rounded-lg flex flex-col px-4 py-4">
              <button
                id={`love-button-${azkar.number}`}
                onClick={() => handleLoveClick(azkar)}
                className={`text-red-500 hover:text-red-600 absolute ${language === "ar" ? `top-4 left-4` : `top-4 right-4`} `}
              >
                <FontAwesomeIcon icon={isFavorite(azkar.number!) ? loved : notLoved} className={!isFavorite(azkar.number!) ? 'vibrate text-xl md:text-2xl' : 'text-xl md:text-2xl'} />
              </button>

              <div className={`absolute ${language === "ar" ? 'left-14 md:bottom-4 md:left-4' : 'right-14 md:bottom-4 md:left-4'} ${isMdOrLarger ? '' : 'top-4'}`}>
               <ShareButtons url={`https://muslim-one.vercel.app/Azkar/Category/${zekr?.id}?zekr=${azkar.number}`} />
              </div>

              <h1 className="text-3xl font-bold text-center flex gap-1">
                {language === 'en' ? `Azkar Number ${azkar.number}` : `ذكر رقم ${azkar.number}`}
              </h1>
              <p dir="rtl" className="leading-9 mt-5 text-lg text-center">{azkar.content}</p>
              <p className="text-center mt-2">{azkar.description}</p>
            </div>
          )})
        )}
        <div className=""></div>
      </div>
    </div>
  );
}