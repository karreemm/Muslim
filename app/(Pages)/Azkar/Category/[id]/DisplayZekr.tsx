import { useLanguage } from "@/app/Context/LanguageContext";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import { faHeart as loved } from "@fortawesome/free-solid-svg-icons";
import TranslationPair from "@/app/Types";
import ShareModal from "@/app/Components/modals/ShareModal";
import { useSingleZekr } from "@/app/Hooks/Azkar/useSingleZekr";
import { useFavoriteZekrActions } from "@/app/Hooks/Azkar/useFavoriteZekrActions";

export default function SingleZekr({
  zekrNumber,
  categoryId,
}: {
  zekrNumber: number;
  categoryId: string;
}) {
  const { language } = useLanguage();

  // Use custom hooks to manage logic
  const { zekr, zekrData, loading } = useSingleZekr(
    categoryId,
    zekrNumber
  );
  const { useFavoriteStatus } = useFavoriteZekrActions(categoryId);
  const { isFav, toggle: handleLoveClick } = useFavoriteStatus(zekr);

  const ZekrNumber: TranslationPair = {
    ar: "رقم",
    en: "Number",
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
                className={`text-red-500 hover:text-red-600 absolute ${
                  language === "ar" ? `top-4 left-4` : `top-4 right-4`
                } `}
              >
                <FontAwesomeIcon
                  icon={isFav ? loved : notLoved}
                  className={
                    !isFav
                      ? "vibrate text-xl md:text-2xl"
                      : "text-xl md:text-2xl"
                  }
                />
              </button>

              <div
                className={`absolute ${
                  language === "ar"
                    ? "left-14 top-4"
                    : "right-14 top-4"
                } `}
              >
                <ShareModal
                  size="2xl"
                  url={`https://muslim-one.vercel.app/Azkar/Category/${zekrData?.id}?zekr=${zekr.number}`}
                />
              </div>

              <h1 className="text-3xl font-bold text-center flex gap-1">
                {ZekrNumber[language]}{" "}
                {language === "en" ? zekr.number : zekr.number}
              </h1>
              <p dir="rtl" className="leading-9 mt-5 text-lg text-center">
                {zekr.content}
              </p>
              <p className="text-center mt-2">{zekr.description}</p>
            </div>
          )
        )}
        <div className="h-10"></div>
      </div>
    </div>
  );
}
