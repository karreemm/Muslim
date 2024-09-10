import { useLanguage } from "@/app/Context/LanguageContext";
import { useEffect, useState } from "react";
import { getMultipleHadiths } from "./GetHadith";
import TranslationPair from "@/app/Lib/Types";
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as notLoved } from '@fortawesome/free-regular-svg-icons';
import { faHeart as loved } from '@fortawesome/free-solid-svg-icons';
import { useFavoriteHadiths } from "@/app/Context/FavoriteHadithsContext";
import { hadithBooks } from "@/app/Lib/Constants";
import ShareButtons from "@/app/Components/ShareButtons";
import "../../../globals.css";

export default function BookPage({ startingNumber, bookId }: { startingNumber: number, bookId: string }) {

    const { language } = useLanguage();


    const [hadiths, setHadiths] = useState<{ numberAr: string, numberEn: number, arabic: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [bookNameEn, setBookNameEn] = useState<string>("");
    const [bookNameAr, setBookNameAr] = useState<string>("");

    const { favoriteHadiths, addFavoriteHadith, removeFavoriteHadith } = useFavoriteHadiths();

    useEffect(() => {
        const book = hadithBooks.find(b => b.id === bookId);
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
                console.error('Error fetching hadiths:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [startingNumber, bookId]);

    const HadithNumber: TranslationPair = {
        ar: "حديث رقم",
        en: "Hadith Number"
    };

    const handleLoveClick = (hadith: { numberAr: string, numberEn: number, arabic: string }) => {
        const isFav = favoriteHadiths.some(fav => fav.numberEn === hadith.numberEn && fav.bookId === bookId);
        if (isFav) {
            removeFavoriteHadith(hadith.numberEn, bookId);
        } else {
            addFavoriteHadith({
                text: hadith.arabic,
                nameAr: bookNameAr,
                nameEn: bookNameEn,
                numberAr: hadith.numberAr,
                numberEn: hadith.numberEn,
                bookId: bookId
            });
        }
    };

    const isFavorite = (numberEn: number) => {
        return favoriteHadiths.some(fav => fav.numberEn === numberEn && fav.bookId === bookId);
    };

    return (
        <div className="w-full flex justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900">
            <div className="w-[95%] flex flex-col items-center gap-10">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
                    </div>
                ) : (
                    hadiths.map((hadith, index) => (
                        <div key={index} className="relative bg-white w-full rounded-lg flex flex-col px-4 py-4">
                            <button
                                id={`love-button-${hadith.numberEn}`}
                                onClick={() => handleLoveClick(hadith)}
                                className={`text-red-500 hover:text-red-600 absolute ${language === "ar" ? `top-4 left-4` : `top-4 right-4`} `}
                            >
                                <FontAwesomeIcon icon={isFavorite(hadith.numberEn) ? loved : notLoved} className={!isFavorite(hadith.numberEn) ? 'vibrate text-xl md:text-2xl' : 'text-xl md:text-2xl'} />
                            </button>

                            <div className={`absolute top-4 ${language === "ar" ? 'md:left-14 left-14' : 'md:right-14 right-14'}`}>
                                <ShareButtons url={`https://muslim-one.vercel.app/ReadHadith/Book/${bookId}?hadith=${hadith.numberEn}`} />
                            </div>

                            <h1 className="text-3xl font-bold text-center flex gap-1">
                                {HadithNumber[language]} {language === 'en' ? hadith.numberEn : hadith.numberAr}
                            </h1>
                            <p dir="rtl" className="leading-9 mt-5 text-lg text-center">{hadith.arabic}</p>
                        </div>
                    ))
                )}
                <div className=""></div>
            </div>
        </div>
    );
}