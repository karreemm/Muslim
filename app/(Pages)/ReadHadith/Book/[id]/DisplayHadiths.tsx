import { useLanguage } from "@/app/Context/LanguageContext";
import TranslationPair from "@/app/Types";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import { faHeart as loved } from "@fortawesome/free-solid-svg-icons";
import ShareModal from "@/app/Components/modals/ShareModal";
import { useMultipleHadiths } from "@/app/Hooks/ReadHadith/useMultipleHadiths";

export default function BookPage({
  startingNumber,
  bookId,
}: {
  startingNumber: number;
  bookId: string;
}) {
  const { language } = useLanguage();
  const { hadiths, loading, handleLoveClick, isFavorite } = useMultipleHadiths(
    startingNumber,
    bookId
  );

  const HadithNumber: TranslationPair = {
    ar: "رقم",
    en: "Number",
  };

  return (
    <div className="fontAmiri w-full flex justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900">
      <div className="w-[95%] flex flex-col items-center gap-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
          </div>
        ) : (
          hadiths.map((hadith, index) => (
            <div
              key={index}
              className="relative bg-white w-full rounded-lg flex flex-col px-4 py-4"
            >
              <button
                id={`love-button-${hadith.numberEn}`}
                onClick={() => handleLoveClick(hadith)}
                className={`text-red-500 hover:text-red-600 absolute ${
                  language === "ar" ? `top-4 left-4` : `top-4 right-4`
                } `}
              >
                <FontAwesomeIcon
                  icon={isFavorite(hadith.numberEn) ? loved : notLoved}
                  className={
                    !isFavorite(hadith.numberEn)
                      ? "vibrate text-xl md:text-2xl"
                      : "text-xl md:text-2xl"
                  }
                />
              </button>

              <div
                className={`absolute top-4 ${
                  language === "ar"
                    ? "md:left-14 left-14"
                    : "md:right-14 right-14"
                }`}
              >
                <ShareModal
                  size="2xl"
                  url={`https://muslim-one.vercel.app/ReadHadith/Book/${bookId}?hadith=${hadith.numberEn}`}
                />
              </div>

              <h1 className="text-3xl font-bold text-center flex gap-1">
                {HadithNumber[language]}{" "}
                {language === "en" ? hadith.numberEn : hadith.numberAr}
              </h1>
              <p dir="rtl" className="leading-9 mt-5 text-lg text-center">
                {hadith.arabic}
              </p>
            </div>
          ))
        )}
        <div className=""></div>
      </div>
    </div>
  );
}
