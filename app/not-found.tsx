"use client";

import NotFoundLight from "./Assets/notFoundLight.png";
import TranslationPair from "./Lib/Types";
import { useLanguage } from "./Context/LanguageContext";

export default function NotFound() {

    const { language } = useLanguage();

    const Title: TranslationPair = {
        en: "Oops! Page not found",
        ar: "عذراً! الصفحة غير موجودة"
    }

    const Desc: TranslationPair = {
        en: "The page you are looking for might have been removed, had its name changed or is temporarily unavailable.",
        ar: "قد تمت إزالة الصفحة التي تبحث عنها أو تغيير اسمها أو أنها غير متاحة مؤقتًا."
    }

    const Home: TranslationPair = {
        en: "Go to Home",
        ar: "الذهاب إلى الصفحة الرئيسية"
    }

    return(
        <>
        <div className="min-h-screen w-full bg-[#FFF5E4] text-teal-600 flex flex-col items-center justify-center ">
            <div className="w-full flex justify-center">
                <img src={NotFoundLight.src} alt="404" className="w-3/4 md:w-[30%]" />
            </div>
            <h1 className="text-2xl md:text-5xl font-semibold my-4">{Title[language]}</h1>
            <p className="text-sm md:text-lg">{Desc[language]}</p>
            <a href="/"  className="mt-4  py-2 px-4 rounded-lg bg-teal-600 text-white hover:opacity-80 ">{Home[language]}</a>
        </div>
        </>
    )
}