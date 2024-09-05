"use client";

import TranslationPair from "../Lib/Types";
import ImgLight from "../Assets/bg2.jpg";
import ImgDark from "../Assets/bg8.png";
import { useLanguage } from "../Context/LanguageContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
        ar: "قراءة الأحاديث النبوية من كتب السنة"
    }


    return (
        <>
        <div className="w-full flex justify-center">
            <div className="mt-24 md:mt-0 min-h-screen w-[90%] flex flex-col items-center gap-14 md:flex md:flex-row md:justify-between md:p-4 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500">
                <div className="md:w-1/2 flex flex-col gap-5">
                    <h1 className="text-2xl md:text-4xl font-bold">{Welcome[language]}</h1>
                    <h1 className="md:text-2xl text-lg">{Desc[language]}</h1>
                    <ul className="mt-5 list-disc list-inside text-lg md:text-2xl space-y-3">
                        <li>
                             <Link href="" className="hover:opacity-70">{FirstItem[language]}</Link>
                        </li>
                        <li>
                            <Link href="" className="hover:opacity-70">{SecondItem[language]}</Link>
                        </li>
                        <li>
                            <Link href="" className="hover:opacity-70">{ThirdItem[language]}</Link>
                        </li>
                    </ul>
                </div>

                <div className="md:w-1/2 flex justify-center">
                    <img src={ImgDark.src} alt="" className="hidden dark:block w-full md:w-3/4 rounded-lg" />
                    <img src={ImgLight.src} alt="" className="block dark:hidden w-full md:w-3/4 rounded-lg" />
                </div>

            </div>

        </div>
        </> 
    );
}
