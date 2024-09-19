"use client";

import TranslationPair from "../Lib/Types";
import ImgLight from "../Assets/bg2.jpg";
import ImgDark from "../Assets/bg8.png";
import install from "../Assets/Installation.png"
import { useLanguage } from "../Context/LanguageContext";
import Link from "next/link";


export default function Header() {

    const { language } = useLanguage();

    const Welcome: TranslationPair = {
        en: "Your Way to the Right Way",
        ar: "طريقك إلى الهدى"
    };

    const Desc: TranslationPair = {
        en: "We are here to help you: ",
        ar: "نحن هنا لمساعدتك على: "
    }

    const FirstItem: TranslationPair = {
        en: "Read the Holy Quran",
        ar: "قراءة القرآن الكريم"
    }

    const SecondItem: TranslationPair = {
        en:" Listen to the Holy Quran with your favorite reciters",
        ar: "الاستماع إلى القرآن الكريم باصوات شيوخك المفضلين"
    }

    const ThirdItem: TranslationPair = {
        en: "Read the Hadiths of the Prophet from the books of Sunnah",
        ar: "قراءة الأحاديث النبوية الشريفة من كتب السنة"
    }

    const FourthItem: TranslationPair = {
        en: "Read and Learn Azkar and Duaa",
        ar: "قراءة الأذكار والأدعية والتعلم منها"
    }

    const Title: TranslationPair = {
        en: "How to Install it on your Phone",
        ar: "كيف تثبته على هاتفك"
    }

    const Step1: TranslationPair = {
        en: "Tap the menu icon (3 dots in upper right-hand corner)",
        ar: "اضغط على أيقونة القائمة (3 نقاط في الزاوية العلوية اليمنى)"
    }

    const Step2: TranslationPair = {
        en: "Tap Add to Home screen",
        ar: "اضغط على إضافة إلى الشاشة الرئيسية"
    }

    const Step3: TranslationPair = {
        en: "Choose a name for the website shortcut, then Chrome will add it to your home screen.",
        ar: "اختر اسمًا لاختصار الموقع، ثم سيضيفه كروم إلى الشاشة الرئيسية."}


    return (
        <>
        <div className="w-full flex justify-center">
            <div className="mt-32 md:mt-0 min-h-screen w-[90%] flex flex-col gap-10">
                <div className="w-full md:min-h-screen flex flex-col items-center gap-14 md:flex md:flex-row md:justify-between md:p-4 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500">
                    <div className="md:w-1/2 flex flex-col gap-5">
                        <h1 className="text-2xl md:text-4xl font-bold">{Welcome[language]}</h1>
                        <h1 className="md:text-2xl text-lg">{Desc[language]}</h1>
                        <ul className="mt-5 list-disc list-inside text-lg md:text-2xl space-y-3">
                            <li>
                                <Link href="/ReadQuran" className="hover:opacity-70">{FirstItem[language]}</Link>
                            </li>
                            <li>
                                <Link href="/ListenQuran" className="hover:opacity-70">{SecondItem[language]}</Link>
                            </li>
                            <li>
                                <Link href="/ReadHadith" className="hover:opacity-70">{ThirdItem[language]}</Link>
                            </li>
                            <li>
                                <Link href="/Azkar" className="hover:opacity-70">{FourthItem[language]}</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:w-1/2 flex justify-center">
                        <img src={ImgDark.src} alt="" className="hidden dark:block w-full md:w-3/4 rounded-lg" />
                        <img src={ImgLight.src} alt="" className="block dark:hidden w-full md:w-3/4 rounded-lg" />
                    </div>

                </div>

                <div className="md:hidden w-full flex flex-col gap-10 md:flex-row md:justify-between md:items-center mt-10">

                    <div className="w-full md:w-[70%] flex flex-col">
                        <h1 className="text-2xl md:text-4xl font-bold">{Title[language]}</h1>

                        <ul className={`flex flex-col list-disc list-outside text-lg md:text-2xl gap-5 mt-5 md:mt-10 relative ${language === "en" ? "pl-5" : "pr-5"}`}>

                            <li className={`before:absolute ${language === "en" ? "before:left-0" : "before:right-0"} before:text-lg before:font-bold before:top-0 before:mt-1`}>
                                {Step1[language]}
                            </li>

                            <li className={`before:absolute ${language === "en" ? "before:left-0" : "before:right-0"} before:text-lg before:font-bold before:top-0 before:mt-8`}>
                                {Step2[language]}
                            </li>

                            <li className={`before:absolute ${language === "en" ? "before:left-0" : "before:right-0"} before:text-lg before:font-bold before:top-0 before:mt-16`}>
                                {Step3[language]}
                            </li>

                        </ul>

                    </div>

                    <div className="w-full md:w-[30%] flex justify-center">
                        <img src={install.src} alt="Installation" className="w-[80%] rounded-lg"/>
                    </div>

                </div>

            </div>

        </div>
        </> 
    );
}
