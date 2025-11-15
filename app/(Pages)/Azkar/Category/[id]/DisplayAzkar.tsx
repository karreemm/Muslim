import { useLanguage } from "@/app/Context/LanguageContext";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import { faHeart as loved } from "@fortawesome/free-solid-svg-icons";
import ShareModal from "@/app/Components/modals/ShareModal";
import useMediaQuery from "@/app/Hooks/general/useMediaQuery";
import { useAzkarCategory } from "@/app/Hooks/Azkar/useAzkarCategory";
import { useAzkarData } from "@/app/Hooks/Azkar/useAzkarData";
import { useFavoriteZekrActions } from "@/app/Hooks/Azkar/useFavoriteZekrActions";
import { AzkarCategories } from "@/app/Contants/AzkarData";

export default function AzkarPage({
  startingNumber,
  categoryId,
}: {
  startingNumber: number;
  categoryId: string;
}) {
  const { language } = useLanguage();
  const isMdOrLarger = useMediaQuery("(min-width: 768px)");

    useAzkarCategory(categoryId);
  const { azkarItems, loading } = useAzkarData(
    categoryId,
    startingNumber
  );
  const { handleLoveClick, isFavorite } = useFavoriteZekrActions(categoryId);

  return (
    <div className="w-full flex justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900">
      <div className="w-[95%] flex flex-col items-center gap-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
          </div>
        ) : (
          azkarItems &&
          azkarItems.map((azkar, index) => {
            const zekr = AzkarCategories.find((b) => b.ar === azkar.category);
            return (
              <div
                key={index}
                className="relative bg-white dark:bg-slate-800 dark:text-white w-full rounded-lg flex flex-col px-4 py-4"
              >
                <button
                  id={`love-button-${azkar.number}`}
                  onClick={() => handleLoveClick(azkar)}
                  className={`text-red-500 hover:text-red-600 absolute ${
                    language === "ar" ? `top-4 left-4` : `top-4 right-4`
                  } `}
                >
                  <FontAwesomeIcon
                    icon={isFavorite(azkar.number!) ? loved : notLoved}
                    className={
                      !isFavorite(azkar.number!)
                        ? "vibrate text-xl md:text-2xl"
                        : "text-xl md:text-2xl"
                    }
                  />
                </button>

                <div
                  className={`absolute ${
                    language === "ar"
                      ? "left-14"
                      : "right-14"
                  } ${isMdOrLarger ? "top-4" : "top-4"}`}
                >
                  <div className={`${language === "ar" ? "mr-2" : "ml-2"}`}>
                    <ShareModal
                      size="2xl"
                      url={`https://muslim-one.vercel.app/Azkar/Category/${zekr?.id}?zekr=${azkar.number}`}
                    />
                  </div>
                </div>

                <span className="inline-block bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold w-fit">
                  {language === "en"
                    ? `Zekr Number ${azkar.number}`
                    : `ذكر رقم ${azkar.number}`}
                </span>
                <p dir="rtl" className="leading-9 mt-5 text-lg text-center">
                  {azkar.content}
                </p>
                <p className="text-center mt-2">{azkar.description}</p>
              </div>
            );
          })
        )}
        <div className=""></div>
      </div>
    </div>
  );
}
