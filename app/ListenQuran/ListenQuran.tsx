"use client";

import Link from "next/link";
import { useLanguage } from "../Context/LanguageContext";
import { reciters } from "../Lib/Constants";
import TranslationPair from "../Lib/Types";

export default function ListenQuranPage() {

    const { language } = useLanguage();

    const Title: TranslationPair = {
        en: "Listen to the Holy Quran by your favourite reciters",
        ar: "استمع الى القرآن الكريم بصوت قراءك المفضلين",
    };

    const Rec: TranslationPair = {
        ar: "فضيلة الشيخ",
        en: "His Eminence Sheikh",
    };

    return (
        <div className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 min-h-screen w-full flex justify-center">
            <div className="w-[95%] mt-32 flex flex-col items-center gap-10">
                <h1 className="text-2xl md:text-4xl text-center">
                    {Title[language]}
                </h1>
                <div className="w-full flex flex-wrap gap-3 justify-center bg-[#FFF5E4] text-black dark:bg-slate-900 dark:text-white p-5">
                    {reciters.map((reciter) => (
                        <Link
                            key={reciter.id}
                            href={`/ListenQuran/Reciter/${reciter.id}`}
                            className="w-full md:w-[30%] px-5 py-3 border border-[#134B70] dark:border-white shadow-lg rounded-lg flex justify-between group hover:border-teal-600 hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:hover:border-teal-500"
                        >
                            <div className="flex gap-5 items-center">
                                <div className="w-[65px] h-[65px] flex items-center justify-center bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl">
                                    <img
                                        loading="lazy"
                                        decoding="async"
                                        src={reciter.image.src}
                                        alt={reciter.NameEn}
                                        className="w-[50px] h-[50px] rounded-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h1 className="md:text-2xl text-xl">
                                        {Rec[language]}
                                    </h1>
                                    <span className="text-lg md:text-xl group-hover:text-teal-600 dark:group-hover:text-teal-500">
                                        {language === "en" ? reciter.NameEn : reciter.NameAr}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="h-20"></div>

            </div>
        </div>
    );
}
