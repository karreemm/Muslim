"use client";

import Link from "next/link";
import { useLanguage } from "../Context/LanguageContext";
import { AzkarCategories } from "../Lib/Constants";
import TranslationPair from "../Lib/Types";

export default function ListenQuranPage() {

    const { language } = useLanguage();

    const Title: TranslationPair = {
        en: "Select a category to explore and reflect on its Azkar",
        ar: "اختر نوع الاذكار الذي تريد وابدأ تعلم الان"
    };
    
    return (
        <div className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 min-h-screen w-full flex justify-center">
            <div className="w-[95%] mt-32 flex flex-col items-center gap-10">
                <h1 className="text-2xl md:text-4xl text-center">
                    {Title[language]}
                </h1>
                <div className="w-full flex flex-wrap gap-3 justify-center bg-[#FFF5E4] text-black dark:bg-slate-900 dark:text-white p-5">
                    {AzkarCategories.map((item) => (
                        <Link
                            key={item.id}
                            href={`/Azkar/Category/${item.id}`}
                            className="w-full md:w-[30%] px-5 py-3 border border-[#134B70] dark:border-white shadow-lg rounded-lg flex justify-between group hover:border-teal-600 hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:hover:border-teal-500"
                        >
                            <div className="flex gap-5 items-center">
                                <div className="w-[65px] h-[65px] flex items-center justify-center bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl">
                                    <img
                                        loading="lazy"
                                        decoding="async"
                                        src={item.image?.src}
                                        alt={item.en}
                                        className="w-[50px] h-[50px] rounded-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h1 className="md:text-xl text-lg group-hover:text-teal-600 dark:group-hover:text-white">
                                        {language === "ar" ? item.ar : item.en}
                                    </h1>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="h-20 md:h-0"></div>
            </div>
        </div>
    );
}
