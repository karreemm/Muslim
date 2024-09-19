import install from "../Assets/Installation.png"
import TranslationPair from "../Lib/Types"
import { useLanguage } from "../Context/LanguageContext"

export default function Installation() {

    const {language} = useLanguage()

    const Title: TranslationPair = {
        en: "How to Install it on yor Phone",
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
        ar: "اختر اسمًا لاختصار الموقع، ثم سيضيفه كروم إليه شاشة الرئيسية."}

    return(
        <>
        <div className="w-full flex justify-center">
            <div className="w-[90%] bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 flex flex-col gap-10 md:flex md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-[70%] flex flex-col">
                    <h1 className="text-2xl font-bold">{Title[language]}</h1>

                    <ul className={`flex flex-col list-disc list-outside text-lg gap-3 mt-5 relative ${language === "en" ? "pl-5" : "pr-5"}`}>

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
        </>
    )
}