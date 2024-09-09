"use client";

import TranslationPair from "../Lib/Types";
import { useLanguage } from "../Context/LanguageContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMosque } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';


export default function Footer() {

    const {language} = useLanguage();

    const Title: TranslationPair = {
        en: "Muslim",
        ar: "مسلم"
    }

    const firstText: TranslationPair = {
        en: "This website is designed as a continuous charity (Sadaqah Jariyah). I hope to make it easier for everyone to read and listen to the Quran and learn from the Hadiths.",
        ar: "تم تصميم هذا الموقع ليكون صدقة جارية. اتمنى أن ايسر على الجميع قراءة القرآن الكريم والاستماع إليه وتعلم الأحاديث النبوية الشريفة."
    }

    const Copyright: TranslationPair = {
        en: "© 2024 Muslim. All rights reserved.",
        ar: "© ٢٠٢٤ مسلم. كل الحقوق محفوظة."
    }

    const Madeby: TranslationPair = {
        en: "Kareem Abdel Nabi",
        ar: "كريم عبد النبي"
    }
    

    return (
        <>
        <div className="z-50 w-full flex flex-col gap-5 px-10 pt-10 md:pt-4 pb-2 border-t border-slate-900 dark:border-white bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 shadow-md">
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="flex items-center gap-4">
                        <FontAwesomeIcon icon={faMosque} className="text-4xl dark:text-white" />
                        <span className={`text-4xl font-semibold dark:text-white text-center`}>                            
                            {Title[language]}
                        </span>
                    </div>

                    <div className="w-full md:w-[60%] flex justify-center">
                        <p className={`w-[100%]  text-2xl flex flex-col dark:text-white items-center gap-2 text-center `}>
                            {firstText[language]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex flex-col gap-2 items-center md:flex md:flex-row md:justify-between md:items-start  dark:text-white">
                <p className="md:text-xl">
                    {Copyright[language]}
                </p>
                <div className="flex items-center gap-5">
                    <a className="md:text-xl hover:opacity-80" href="https://kareem-abdelnabi.vercel.app/">
                        {Madeby[language]}
                    </a>

                    <div className="flex gap-3">
                        <a className="md:text-2xl hover:opacity-80" href="https://github.com/karreemm">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>

                        <a className="md:text-2xl hover:opacity-80" href="www.linkedin.com/in/k-abdelnabii">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                    
                </div>
            </div>
        </div>
        </>
    )
}